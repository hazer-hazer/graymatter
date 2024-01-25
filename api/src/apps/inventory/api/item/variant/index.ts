import { Api } from '@/App'
import baseDb, { DB } from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { ItemVariantAttrUpsert, ItemVariantCreate, ItemVariantDeleteBatch, ItemVariantQuickAdd, ItemVariantSearch, ItemVariantUpdate, schemas } from './schemas'
import { nameToUri } from '@/utils/names-format'
import { Currency,  extendWithRealPrice, fromRealValue } from '@/models/Currency'
import { ItemVariant } from '@/apps/inventory/models/ItemVariant'

export const itemVariantClientResInclude = {
    avatar: true,
} satisfies DB.ItemVariantInclude

type ItemVariantCurrencyIdentify = Pick<ItemVariant, 'id'> | Pick<ItemVariant, 'itemId'>

const db = baseDb.$extends({
    model: {
        itemVariant: {
            async currency(where: ItemVariantCurrencyIdentify): Promise<Currency> {
                const itemId = 'itemId' in where ? where.itemId : (await db.itemVariant.findUniqueOrThrow({ where: { id: where.id } })).itemId

                return db.item.fallbackCurrency({ id: itemId })
            },
        },
    },
})

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.post<ItemVariantQuickAdd>('/:itemId/variant/quick', { schema: schemas.ItemVariantQuickAdd }, async (req, res) => {
        const { itemId } = req.params
        const { names, realPriceEach, amountValueEach } = req.body

        const currency = await db.item.fallbackCurrency({ id: itemId })
        const price = realPriceEach ? fromRealValue(realPriceEach, currency) : null

        await db.itemVariant.createMany({
            data: names.map(name => ({
                itemId,
                name,
                uri: nameToUri(name),
                price,
                ...amountValueEach && { amountValue: amountValueEach },
            })),
        })

        const result = await db.itemVariant.findMany({
            where: { itemId },
            include: itemVariantClientResInclude,
        })

        const extended = result.map(variant => extendWithRealPrice({
            currency,
            ...variant,
        }))

        return res.code(200).send({
            itemVariants: extended,
        })
    })

    fastify.post<ItemVariantCreate>('/:itemId/variant', { schema: schemas.ItemVariantCreate }, async (req, res) => {
        const { itemId } = req.params
        const {
            name,
            description,
            uri,
            realPrice,
        } = req.body.itemVariant

        const currency = await db.itemVariant.currency({ itemId })
        const price = realPrice ? fromRealValue(realPrice, currency) : null

        const result = await db.itemVariant.create({
            data: {
                itemId,
                name,
                description,
                price,
                uri: uri ?? nameToUri(name),
            },
            include: itemVariantClientResInclude,
        })

        const extended = extendWithRealPrice({
            currency,
            ...result,
        })

        return res.code(200).send({
            itemVariant: extended,
        })
    })

    fastify.put<ItemVariantUpdate>('/variant/:itemVariantId', { schema: schemas.ItemVariantUpdate }, async (req, res) => {
        const { itemVariantId } = req.params
        const {
            uri,
            name,
            description,
            avatarImageId,
            amountValue,
            realPrice,
        } = req.body.itemVariant

        const currency = await db.itemVariant.currency({ id: itemVariantId })
        const price = realPrice ? fromRealValue(realPrice, currency) : null

        const result = await db.itemVariant.update({
            where: { id: itemVariantId },
            data: {
                uri,
                name,
                description,
                amountValue,
                price,
                avatarImageId,
            },
            include: itemVariantClientResInclude,
        })

        const extended = extendWithRealPrice({
            currency,
            ...result,
        })

        return res.code(200).send({
            itemVariant: extended,
        })
    })

    fastify.delete<ItemVariantDeleteBatch>('/variant', { schema: schemas.ItemVariantDeleteBatch }, async (req, res) => {
        const { itemVariantIds } = req.body
        await db.itemVariant.deleteMany({
            where: {
                id: {
                    in: itemVariantIds,
                },
            },
        })

        return res.code(200).send({})
    })

    fastify.put<ItemVariantAttrUpsert>('/variant/:itemVariantId/attr/:itemAttrId', { schema: schemas.ItemVariantAttrUpsert }, async (req, res) => {
        const { itemVariantId, itemAttrId } = req.params
        const { value } = req.body

        const data = {
            itemAttrId,
            itemVariantId,
            value,
        }

        const itemVariantAttr = await db.itemVariantAttr.upsert({
            where: {
                itemVariantId_itemAttrId: {
                    itemVariantId,
                    itemAttrId,
                },
            },
            create: data,
            update: data,
            include: {
                itemAttr: {
                    include: {
                        attr: true,
                    },
                },
            },
        })

        return res.code(200).send({
            itemVariantAttr,
        })
    })

    fastify.get<ItemVariantSearch>('/:itemId/variant/search', { schema: schemas.ItemVariantSearch }, async (req, res) => {
        const { itemId } = req.params
        const { q, limit } = req.query

        const foundVariants = await db.$queryRaw<{
            itemVariantId: ItemVariant['id'][]
        }>`
            SELECT
                iv.id AS "itemVariantId"
                ,sim
            FROM
                public.item_variants AS iv
                ,similarity(iv.name, ${q}) AS sim
            WHERE
                sim >= 0.1
                AND iv.item_id = ${itemId}
            ORDER BY
                sim DESC
                ,iv.updated_at DESC
                ,iv.created_at DESC
            LIMIT ${limit ?? 10}`

        const itemVariants = await db.itemVariant.findMany({
            where: {
                id: {
                    in: foundVariants.itemVariantId,
                },
            },
            include: itemVariantClientResInclude,
        })

        return res.code(200).send({
            itemVariants,
        })
    })
}

export default new Api({
    fastifyPlugin,
})
