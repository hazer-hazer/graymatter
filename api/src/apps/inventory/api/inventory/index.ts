
import { FastifyPluginAsync } from 'fastify'
import { InventoryGetByUri, InventorySearch, schemas } from './schemas'
import db from '@/modules/prisma'
import { Api } from '@/App'

const dashboard: FastifyPluginAsync = async function (fastify) {
    /// Dashboard
    fastify.get<InventoryGetByUri>('/:inventoryUri', { schema: schemas.InventoryGetByUri }, async (req, res) => {
        const { inventoryUri } = req.params

        const { _count: { items: itemsCount, folders: foldersCount }, ...inventory } = await db.inventory.findUniqueOrThrow({
            include: {
                _count: {
                    select: {
                        items: true,
                        folders: true,
                    },
                },
            },
            where: { userId_uri: { uri: inventoryUri, userId: req.user.userId } },
        })

        const path = await db.inventory.path({ id: inventory.id })
        const tree = await db.inventory.tree({ id: inventory.id })

        const { id: rootFolderId } = await db.folder.findUniqueOrThrow({
            where: { inventoryId_kind: { inventoryId: inventory.id, kind: 'Root' } },
            select: { id: true },
        })

        const variantsCount = await db.itemVariant.count({
            where: { item: { inventoryId: inventory.id } },
        })

        const resultInventory: InventoryGetByUri['Reply']['200']['inventory'] = {
            ...inventory,
            path,
            rootFolderId,
            stats: {
                itemsCount,
                variantsCount,
                foldersCount,
                priceValue: 0,
            },
            tree,
        }

        return res.code(200).send({ inventory: resultInventory })
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
}

export default new Api({
    fastifyPlugin: dashboard,
})
