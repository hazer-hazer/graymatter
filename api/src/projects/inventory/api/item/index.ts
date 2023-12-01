import { FastifyPluginAsync } from 'fastify'
import db, { DB } from '@/modules/prisma'
import { ItemCreate, ItemGetById, ItemSearch, ItemUpdate, schemas  } from './schemas'
import { formatUri } from '@/utils/names-format'
import { Item } from '#inventory/models/Item'
import image from './image'
import { Api } from '@/Project'

const itemSelectSingleFields = {
    id: true,
    uri: true,
    name: true,
    description: true,
    inventoryId: true,
    inventory: true,
    folderId: true,
    rawAmountValue: true,
    createdAt: true,
    updatedAt: true,
    amountUnitId: true,
    amountUnit: {
        include: {
            powerPrefixes: true,
        },
    },
    images: {
        include: {
            image: true,
        },
    },
    variants: true,
}

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.get<ItemSearch>('/', async () => {
        return db.item.findMany({})
    })

    fastify.get<ItemGetById>('/:itemId', async (req, res) => {
        const item: Item = await db.item.findUniqueOrThrow({
            select: itemSelectSingleFields,
            // include: {
            //     variants: true,
            //     inventory: true,
            //     images: {
            //         include: {
            //             image: true,
            //         },
            //     },
            //     amountUnit: {
            //         include: {
            //             powerPrefixes: true,
            //         },
            //     },
            // },
            where: { id: req.params.itemId },
        })

        item.path = await db.item.path({ id: item.id })

        return res.code(200).send({
            item,
        })
    })

    fastify.post<ItemCreate>('/', { schema: schemas.ItemCreate }, async (req, res) => {
        const { variants, ...itemData } = req.body
        const item = await db.item.create({
            data: {
                ...itemData,
                userId: req.user.id,
                uri: formatUri(itemData.name),
                ...variants && {
                    variants: {
                        createMany: {
                            data: variants.map((variant) => ({
                                ...variant,
                                uri: formatUri(variant.name),
                            })),
                        },
                    },
                },
            },
        })

        return res.code(200).send({ item })
    })

    fastify.put<ItemUpdate>('/:itemId', { schema: schemas.ItemUpdate }, async (req, res) => {
        const { itemId } = req.params
        const { item: updateParams } = req.body

        const item = await db.item.update({
            where: { id: itemId },
            select: itemSelectSingleFields,
            data: updateParams,
        })

        return res.code(200).send({ item })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/item',
    api: [image],
})
