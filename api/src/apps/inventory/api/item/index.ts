import { FastifyPluginAsync } from 'fastify'
import { default as baseDb, DB } from '@/modules/prisma'
import { ItemCreate, ItemGetById, ItemMoveToTrash, ItemSearch, ItemUpdate, schemas  } from './schemas'
import { nameToUri } from '@/utils/names-format'
import { Item } from '@/apps/inventory/models/Item'
import image from './image'
import { Api } from '@/App'
import variant from './variant'
import { ItemVariant } from '../../models/ItemVariant'
import { Currency, extendWithRealPrice, fromRealValue, RealPrice, WithPrice, WithRealPrice } from '@/models/Currency'
import attr from './attr'

const itemSelectSingleFields = {
    id: true,
    uri: true,
    name: true,
    description: true,
    inventoryId: true,
    inventory: true,
    folderId: true,
    createdAt: true,
    updatedAt: true,
    buyLink: true,
    price: true,
    currencyId: true,
    currency: true,
    amountValue: true,
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
        orderBy: {
            createdAt: 'desc' as DB.SortOrder,
        },
    },
    variants: {
        include: {
            avatar: true,
            attributes: {
                include: {
                    itemAttr: {
                        include: {
                            attr: true,
                        },
                    },
                },
            },
        },
    },
    attributes: {
        include: {
            attr: true,
        },
    },
}

type CalculateTotalPriceInput =
    Required<Pick<Item, 'realPrice' | 'amountValue'>>
    & {
        variants?: Pick<ItemVariant, 'realPrice' | 'amountValue'>[]
    }

const calculateItemTotalPrice = ({
    realPrice: itemRealPrice,
    amountValue: itemAmountValue,
    variants,
}: CalculateTotalPriceInput): number | null => {
    if (variants?.length) {
        // TODO: Maybe if some variant's price is null then total price is null too?
        return variants.reduce((total: number | null, { realPrice, amountValue }) => {
            const useRealPrice = realPrice ?? itemRealPrice
            if (typeof useRealPrice !== 'number') {
                return total
            }

            return (total ?? 0.0) + useRealPrice * amountValue
        }, null)
    } else if (itemRealPrice) {
        return itemRealPrice * itemAmountValue
    }

    return null
}

const db = baseDb.$extends({
    // result: {
    //     item: {
    //         fallbackCurrency: {
    //             needs: {
    //                 id: true,
    //                 currencyId: true,
    //                 inventoryId: true,
    //             },
    //             compute(item) {
    //                 return async (): Promise<Currency> => {
    //                     if (item.currencyId === null) {
    //                         const { currency, userId } = await db.inventory.findUniqueOrThrow({
    //                             where: { id: item.inventoryId },
    //                             select: { userId: true, currency: true },
    //                         })

    //                         if (!currency) {
    //                             const { currency } = await db.user.findUniqueOrThrow({
    //                                 where: { id: userId },
    //                                 select: { currency: true },
    //                             })

    //                             return currency
    //                         }

    //                         return currency
    //                     }

    //                     // TODO: Fix when https://github.com/prisma/prisma/issues/15074 implemented
    //                     const currency = await db.currency.findUniqueOrThrow({ where: { id: item.currencyId } })

    //                     return currency
    //                 }
    //             },
    //         },
    //     },
    // },
}).$extends({
    model: {
        item: {
            async moveToTrash(where: DB.ItemWhereUniqueInput): Promise<Item> {
                const { inventoryId } = await db.item.findUniqueOrThrow({ where, select: { inventoryId: true } })
                const { id: trashFolderId } = await db.folder.findUniqueOrThrow({
                    where: { inventoryId_kind: { inventoryId, kind: 'Trash' } },
                })

                return db.item.update({
                    where,
                    select: itemSelectSingleFields,
                    data: {
                        folderId: trashFolderId,
                    },
                })
            },
            async totalPrice(where: DB.ItemWhereUniqueInput): Promise<number | null> {
                const item = await db.item.findUniqueOrThrow({
                    where,
                    include: {
                        currency: true,
                        variants: {
                            select: {
                                price: true,
                                amountValue: true,
                            },
                        },
                    },
                })

                item.currency ??= await db.item.fallbackCurrency(where)

                return calculateItemTotalPrice({
                    ...extendWithRealPrice(item),
                    variants: item.variants.map(v => extendWithRealPrice({
                        ...v,
                        currency: item.currency,
                    })),
                })
            },
        },
    },
})

/// Determine `price` from `realPrice` for creation and update
async function priceDetermined<T extends {
    id?: Item['id']
    realPrice?: RealPrice | null
    currencyId?: Currency['id']
}>(input: T): Promise<T & WithPrice> {
    if (typeof input.realPrice !== 'number') {
        return {
            ...input,
            price: null,
        }
    }

    let currency: Currency | null = null
    if (input.currencyId) {
        currency = await db.currency.findUniqueOrThrow({ where: { id: input.currencyId } })
    } else if (input.id) {
        const result = await db.item.findUniqueOrThrow({
            where: { id: input.id },
            select: { currency: true },
        })
        currency = result.currency
    }

    return {
        ...input,
        price: currency ? fromRealValue(input.realPrice, currency) : null,
    }
}

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.get<ItemSearch>('/', { schema: schemas.ItemSearch }, async () => {
        return db.item.findMany({})
    })

    fastify.get<ItemGetById>('/:itemId', { schema: schemas.ItemGetById }, async (req, res) => {
        const data = await db.item.findUniqueOrThrow({
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

        const item: WithRealPrice<Item> = extendWithRealPrice(data)
        item.variants = item.variants?.map(variant => extendWithRealPrice({
            ...variant,
            currency: data.currency,
        }))

        const { _sum: { amountValue: variantsAmountSum } } = await db.itemVariant.aggregate({
            _sum: {
                amountValue: true,
            },
            where: { itemId: item.id },
        })

        item.currency ??= await db.item.fallbackCurrency({ id: item.id })
        item.path = await db.item.path({ id: item.id })
        item.variantsAmountSum = variantsAmountSum
        item.totalPrice = await db.item.totalPrice({ id: item.id })

        return res.code(200).send({
            item,
        })
    })
 
    fastify.post<ItemCreate>('/', { schema: schemas.ItemCreate }, async (req, res) => {
        const {
            variants,
            name,
            uri,
            description,
            inventoryId,
            folderId,
            amountUnitId,
            amountValue,
            price,
        } = await priceDetermined(req.body)

        const item = await db.item.create({
            data: {
                uri: uri ? uri : nameToUri(name),
                name,
                description,
                inventoryId,
                folderId,
                amountUnitId,
                userId: req.user.userId,
                amountValue,
                price,
                ...variants && {
                    variants: {
                        createMany: {
                            data: variants.map((variant) => ({
                                ...variant,
                                uri: nameToUri(variant.name),
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
        const updateParams = await priceDetermined(req.body.item)

        const item: Item = await db.item.update({
            where: { id: itemId },
            select: itemSelectSingleFields,
            data: updateParams,
        })

        item.totalPrice = await db.item.totalPrice({ id: item.id })

        return res.code(200).send({ item })
    })

    fastify.delete<ItemMoveToTrash>('/:itemId', { schema: schemas.ItemMoveToTrash }, async (req, res) => {
        const item = await db.item.moveToTrash({ id: req.params.itemId })

        return res.code(200).send({
            item,
        })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/item',
    api: [image, variant, attr],
})
