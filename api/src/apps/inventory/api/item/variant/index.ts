import { Api } from '@/App'
import baseDb from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { ItemVariantCreate, ItemVariantDeleteBatch, ItemVariantQuickAdd, ItemVariantUpdate, schemas } from './schemas'
import { nameToUri } from '@/utils/names-format'
import { Currency,  extendWithRealPrice, fromRealValue } from '@/models/Currency'
import { ItemVariant } from '@/apps/inventory/models/ItemVariant'

// /// Determine `price` from `realPrice` for creation and update
// async function priceDetermined<T extends {
//     realPrice?: RealPrice | null
//     currencyId?: Currency['id']
// } & ({
//     id: ItemVariant['id']
//     itemId?: Item['id']
// } | {
//     id?: ItemVariant['id']
//     itemId: Item['id']
// })>(input: T): Promise<T & WithPrice> {
//     if (typeof input.realPrice !== 'number') {
//         return {
//             ...input,
//             price: null,
//         }
//     }

//     let currency: Currency | null = null
//     if (input.currencyId) {
//         currency = await db.currency.findUniqueOrThrow({ where: { id: input.currencyId } })
//     } else {
//         const itemId = input.itemId ?? (await db.itemVariant.findUniqueOrThrow({ where: { id: input.id }, select: { itemId: true } })).itemId
//         const result = await db.item.findUniqueOrThrow({
//             where: { id: itemId },
//             select: { currency: true },
//         })
//         currency = result.currency
//     }

//     return {
//         ...input,
//         price: fromRealValue(input.realPrice, currency),
//     }
// }

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

// const getPrice = async (realPrice: RealPrice | null | undefined, where: ItemVariantCurrencyIdentify): Promise<ItemVariant['price']> => {
//     if (typeof realPrice !== 'number') {
//         return null
//     }

//     return fromRealValue(realPrice, await db.itemVariant.currency(where))
// }

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
            include: {
                avatar: true,
            },
        })

        const extended = result.map(variant => extendWithRealPrice({
            currency,
            ...variant,
        }))

        return res.code(200).send({
            variants: extended,
        })
    })

    fastify.post<ItemVariantCreate>('/:itemId/variant', { schema: schemas.ItemVariantCreate }, async (req, res) => {
        const { itemId } = req.params
        const {
            name,
            description,
            uri,
            realPrice,
        } = req.body.variant

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
            include: {
                avatar: true,
            },
        })

        const extended = extendWithRealPrice({
            currency,
            ...result,
        })

        return res.code(200).send({
            variant: extended,
        })
    })

    fastify.put<ItemVariantUpdate>('/variant/:variantId', { schema: schemas.ItemVariantUpdate }, async (req, res) => {
        const { variantId } = req.params
        const {
            uri,
            name,
            description,
            avatarImageId,
            amountValue,
            realPrice,
        } = req.body.variant

        const currency = await db.itemVariant.currency({ id: variantId })
        const price = realPrice ? fromRealValue(realPrice, currency) : null

        const result = await db.itemVariant.update({
            where: { id: variantId },
            data: {
                uri,
                name,
                description,
                amountValue,
                price,
                avatarImageId,
            },
            include: {
                avatar: true,
            },
        })

        const extended = extendWithRealPrice({
            currency,
            ...result,
        })

        return res.code(200).send({
            variant: extended,
        })
    })

    fastify.delete<ItemVariantDeleteBatch>('/variant', { schema: schemas.ItemVariantDeleteBatch }, async (req, res) => {
        const { variants } = req.body
        await db.itemVariant.deleteMany({
            where: {
                id: {
                    in: variants,
                },
            },
        })
    })
}

export default new Api({
    fastifyPlugin,
})
