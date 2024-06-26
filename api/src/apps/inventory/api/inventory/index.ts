import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { InventoryCreate, InventoryGetByUri, InventoryGetCurrency, InventoryGetMy, InventoryGetStarred, InventoryGetTrash, InventorySearch, InventoryStarUpdate, schemas } from './schemas'
import { default as baseDb } from '@/modules/prisma'
import { Api } from '@/App'
import { nameToUri } from '@/utils/names-format'
import { Inventory } from '../../models/Inventory'
import { Folder, FolderKind } from '../../models/Folder'

const db = baseDb.$extends({
    model: {
        inventory: {
            async metaFolders(inventoryId: Inventory['id']): Promise<{
                rootFolderId: Folder['id']
                trashFolderId: Folder['id']
            }> {
                const findMetaFolder = async (kind: FolderKind): Promise<Folder['id']> => {
                    const result = await db.folder.findUniqueOrThrow({
                        select: { id: true },
                        where: {
                            inventoryId_kind: {
                                inventoryId,
                                kind,
                            },
                        },
                    })

                    return result.id
                }

                return {
                    rootFolderId: await findMetaFolder('Root'),
                    trashFolderId: await findMetaFolder('Trash'),
                }
            },
        },
    },
})

const isStarred = (req: FastifyRequest, inventory: Inventory): boolean => {
    if (inventory.stars?.length) {
        return inventory.stars.some(star => star.userId === req.user.userId)
    }

    return false
}

const dashboard: FastifyPluginAsync = async function (fastify) {
    /// Dashboard
    fastify.get<InventoryGetByUri>('/:inventoryUri', { schema: schemas.InventoryGetByUri }, async (req, res) => {
        const { inventoryUri } = req.params
        const { userId } = req.user

        const { _count: { items: itemsCount, folders: foldersCount }, ...inventory } = await db.inventory.findUniqueOrThrow({
            include: {
                _count: {
                    select: {
                        items: true,
                        folders: true,
                    },
                },
                stars: true,
            },
            where: { userId_uri: { uri: inventoryUri, userId } },
        })

        const where = { id: inventory.id }

        const { rootFolderId, trashFolderId } = await db.inventory.metaFolders(inventory.id)

        const { _sum: { id: itemsInTrashFolderCount } } = await db.item.aggregate({
            where: {
                inventoryId: inventory.id,
                folderId: trashFolderId,
            },
            _sum: { id: true },
        })

        const path = await db.inventory.path(where)
        const tree = await db.inventory.tree(where)
        const totalPrice = await db.inventory.totalPrice(where)

        const variantsCount = await db.itemVariant.count({ where: { item: { inventoryId: inventory.id, folderId: { not: trashFolderId } } } })

        const currency = await db.inventory.fallbackCurrency(where)

        const resultInventory: InventoryGetByUri['Reply']['200']['inventory'] = {
            ...inventory,
            currency,
            path,
            rootFolderId,
            trashFolderId,
            stats: {
                itemsCount,
                variantsCount,
                foldersCount,
                totalPrice,
                itemsInTrashFolderCount: itemsInTrashFolderCount ?? 0n,
            },
            tree,
            starred: isStarred(req, inventory),
        }

        return res.code(200).send({ inventory: resultInventory })
    })

    fastify.get<InventoryGetCurrency>('/:inventoryId/currency', { schema: schemas.InventoryGetCurrency }, async (req, res) => {
        const { inventoryId } = req.params
        const currency = await db.inventory.fallbackCurrency({ id: inventoryId })

        return res.code(200).send({
            currency,
        })
    })

    // Only item search
    fastify.get<InventorySearch>('/:inventoryUri/search', { schema: schemas.InventorySearch }, async (req, res) => {
        const { q, limit } = req.query

        const preparedQuery = q.split(' ').filter(word => word.length > 0).join(' & ')

        const { items, ...inventory } = await db.inventory.findUniqueOrThrow({
            where: { userId_uri: { userId: req.user.userId, uri: req.params.inventoryUri } },
            include: {
                items: {
                    orderBy: {
                        _relevance: {
                            fields: ['name'],
                            search: preparedQuery,
                            sort: 'desc',
                        },
                    },
                    take: limit,
                },
                // folders: {
                //     orderBy: {
                //         _relevance: {
                //             fields: ['name', 'description'],
                //             search: q,
                //             sort: 'asc',
                //         },
                //     },
                // },
            },
        })

        return res.code(200).send({
            inventory,
            results: items.map(item => ({ kind: 'item', item })),
        })
    })

    fastify.get<InventoryGetTrash>('/trash', async (req, res) => {
        const { inventoryUri } = req.params
        const { userId } = req.user

        const { id: inventoryId } = await db.inventory.findUniqueOrThrow({ where: { userId_uri: { userId, uri: inventoryUri } }, select: { id: true } })

        const { id: trashFolderId } = await db.folder.findUniqueOrThrow({
            select: { id: true },
            where: { inventoryId_kind: { inventoryId, kind: 'Trash' } },
        })

        const folders = await db.folder.findMany({
            where: {
                inventoryId,
                parentId: trashFolderId,
            },
        })

        const items = await db.item.findMany({
            where: {
                inventoryId,
                folderId: trashFolderId,
            },
        })

        return res.code(200).send({
            folders,
            items,
        })
    })

    fastify.get<InventoryGetMy>('/', { schema: schemas.InventoryGetMy }, async (req, res) => {
        const { limit = 10 } = req.query
        const { userId } = req.user

        let inventories: Inventory[] = await db.inventory.findMany({
            where: {
                userId,
            },
            include: {
                stars: true,
            },
            orderBy: [{
                updatedAt: 'desc',
            }, {
                createdAt: 'desc',
            }],
            take: limit,
        })

        inventories = inventories.map(inventory => ({
            ...inventory,
            starred: isStarred(req, inventory),
        }))

        return res.code(200).send({ inventories })
    })

    fastify.post<InventoryCreate>('/', { schema: schemas.InventoryCreate }, async (req, res) => {
        const { name, description, uri } = req.body
        const inventory: Inventory = await db.inventory.create({
            data: {
                name,
                description,
                uri: uri ?? nameToUri(name),
                userId: req.user.userId,
            },
        })

        const rootFolder = await db.folder.create({
            data: {
                inventoryId: inventory.id,
                kind: 'Root',
                name: 'Root folder',
                uri: '/',
            },
        })

        const trashFolder = await db.folder.create({
            data: {
                inventoryId: inventory.id,
                kind: 'Trash',
                name: 'Trash',
                uri: '/trash',
            },
        })

        inventory.rootFolderId = rootFolder.id
        inventory.trashFolderId = trashFolder.id

        return res.code(200).send({ inventory })
    })

    fastify.post<InventoryStarUpdate>('/:inventoryId/star', async (req, res) => {
        const inventoryId = Number(req.params.inventoryId)
        const { star } = req.body
        const { userId } = req.user

        if (star) {
            await db.inventoryStar.upsert({
                where: { userId_inventoryId: { userId, inventoryId } },
                create: {
                    inventoryId,
                    userId,
                },
                update: {},
            })
        } else {
            await db.inventoryStar.delete({
                where: { userId_inventoryId: { userId, inventoryId } },
            })
        }

        return res.code(200).send({
            star,
        })
    })

    fastify.get<InventoryGetStarred>('/starred', async (req, res) => {
        const { userId } = req.user

        const inventories = await db.inventory.findMany({
            where: {
                stars: {
                    some: {
                        userId,
                    },
                },
            },
        })

        return res.code(200).send({
            inventories,
        })
    })
}

export default new Api({ fastifyPlugin: dashboard })
