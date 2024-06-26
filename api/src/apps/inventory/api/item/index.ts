import { FastifyPluginAsync } from 'fastify'
import { default as baseDb, DB } from '@/modules/prisma'
import { ExtendedItemClientRes, ItemCreate, ItemGetById, ItemMoveToTrash, ItemSearch, ItemUpdate, schemas  } from './schemas'
import { nameToUri } from '@/utils/names-format'
import { getAvatar, Item } from '@/apps/inventory/models/Item'
import image from './image'
import { Api } from '@/App'
import variant, { itemVariantClientResInclude } from './variant'
import { Currency, extendWithRealPrice, fromRealValue, RealPrice, toRealValue, WithPrice } from '@/models/Currency'
import attr from './attr'
import { Inventory } from '../../models/Inventory'
import { ItemVariant } from '../../models/ItemVariant'
import { Prisma } from '@prisma/client'
import { buyListClientResInclude } from '../buy-list'

export const itemClientResInclude = {
    currency: true,
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
            createdAt: 'desc',
        },
    },
    variants: {
        include: itemVariantClientResInclude,
        orderBy: [{
            updatedAt: 'desc',
        }, {
            createdAt: 'desc',
        }],
    },
    buyLists: {
        include: {
            buyList: {
                include: buyListClientResInclude,
            },
        },
    },
    attributes: {
        include: {
            attr: true,
        },
    },
} satisfies DB.ItemInclude

// type CalculateTotalPriceInput =
//     Required<Pick<Item, 'realPrice' | 'amountValue'>>
//     & {
//         variants?: Pick<ItemVariant, 'realPrice' | 'amountValue'>[]
//     }

// const calculateItemTotalPrice = ({
//     realPrice: itemRealPrice,
//     amountValue: itemAmountValue,
//     variants,
// }: CalculateTotalPriceInput): RealPrice | null => {
//     if (variants?.length) {
//         // TODO: Maybe if some variant's price is null then total price is null too?
//         return variants.reduce((total: RealPrice | null, { realPrice, amountValue }) => {
//             const useRealPrice = realPrice ?? itemRealPrice
//             if (typeof useRealPrice !== 'number') {
//                 return total
//             }

//             return (total ?? 0.0) + useRealPrice * amountValue
//         }, null)
//     } else if (itemRealPrice) {
//         return itemRealPrice * itemAmountValue
//     }

//     return null
// }

const watchBuyLists = async (itemId: Item['id'], updatedAmountValue?: number) => {
    const stockAmount = updatedAmountValue ?? ((await db.item.findUniqueOrThrow({ where: { id: itemId }, select: { amountValue: true } })).amountValue)
    await db.buyListItem.updateMany({
        where: {
            itemId,
            amountValue: {
                lte: stockAmount,
            },
            buyList: {
                watch: true,
            },
        },
        data: {
            checked: true,
        },
    })
}

const db = baseDb.$extends({
    model: {
        item: {
            async moveToTrash(where: DB.ItemWhereUniqueInput): Promise<Item> {
                const { inventoryId } = await db.item.findUniqueOrThrow({ where, select: { inventoryId: true } })
                const { id: trashFolderId } = await db.folder.findUniqueOrThrow({
                    where: { inventoryId_kind: { inventoryId, kind: 'Trash' } },
                })

                return db.item.update({
                    where,
                    include: itemClientResInclude,
                    data: {
                        folderId: trashFolderId,
                    },
                })
            },
        },
    },
})

/// Determine `price` from `realPrice` for creation and update
async function priceDetermined<T extends {
    realPrice?: RealPrice | null
    currencyId?: Currency['id']
}>(input: T, where: { id: Item['id'] } | { inventoryId: Inventory['id'] }): Promise<Omit<T, 'realPrice'> & WithPrice> {
    if (typeof input.realPrice !== 'number') {
        return {
            ...input,
            price: null,
        }
    }

    let currency: Currency
    if (typeof input.currencyId === 'number') {
        currency = await db.currency.findUniqueOrThrow({ where: { id: input.currencyId } })
    } else if ('id' in where) {
        currency = await db.item.fallbackCurrency(where)
    } else {
        currency = await db.inventory.fallbackCurrency({ id: where.inventoryId })
    }

    return {
        ...input,
        realPrice: undefined,
        price: fromRealValue(input.realPrice, currency),
    }
}

async function extendItem(
    item: Item & Required<Pick<Item,
        | 'amountUnit'
        | 'images' 
        | 'variants' 
        | 'attributes' 
        | 'buyLists'
    >>,
): Promise<ExtendedItemClientRes> {
    const where = { id: item.id }
    const currency = item.currency ?? await db.item.fallbackCurrency(where)
    const realPrice = item.price ? toRealValue(item.price, currency) : null
    const totalPrice = await db.item.totalPrice(where)
    const path = await db.item.path(where)
    const avatar = getAvatar(item)

    const { _sum: { amountValue: variantsAmountSum } } = await db.itemVariant.aggregate({
        _sum: { 
            amountValue: true,
        },
        where: { itemId: item.id },
    })

    const variants = item.variants?.map(variant => extendWithRealPrice({
        ...variant,
        currency,
    }))

    return {
        ...item,
        currency,
        realPrice,
        totalPrice,
        path,
        avatar,
        variantsAmountSum,
        variants,
    }
}

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.get<ItemGetById>('/:itemId', { schema: schemas.ItemGetById }, async (req, res) => {
        const data = await db.item.findUniqueOrThrow({
            include: itemClientResInclude,
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
            where: { id: req.params.itemId, userId: req.user.userId },
        })

        const item = await extendItem(data)

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
        } = await priceDetermined(req.body.item, { inventoryId: req.body.item.inventoryId })

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
            include: itemClientResInclude,
        })

        return res.code(200).send({
            item: await extendItem(item),
        })
    })

    fastify.put<ItemUpdate>('/:itemId', { schema: schemas.ItemUpdate }, async (req, res) => {
        const { itemId } = req.params
        const updateParams = await priceDetermined(req.body.item, { id: itemId })

        const item = await db.item.update({
            where: { id: itemId, userId: req.user.userId },
            include: itemClientResInclude,
            data: updateParams,
        })

        if (typeof updateParams.amountValue === 'number') {
            await watchBuyLists(itemId, updateParams.amountValue)
        }

        return res.code(200).send({
            item: await extendItem(item),
        })
    })

    fastify.delete<ItemMoveToTrash>('/:itemId', { schema: schemas.ItemMoveToTrash }, async (req, res) => {
        const item = await db.item.moveToTrash({ id: req.params.itemId, userId: req.user.userId })

        return res.code(200).send({
            item,
        })
    })

    fastify.get<ItemSearch>('/search', { schema: schemas.ItemSearch }, async (req, res) => {
        const { q, limit, excludeItems, excludeItemVariants } = req.query

        // const search = q.split(/\W+/).map(w => w.trim()).filter(w => !!w.length).join(' | ')

        const foundItems = await db.$queryRaw<{
            itemId: Item['id']
            itemVariantId: ItemVariant['id']
            similarity: number
        }[]>`
            SELECT
                COALESCE(v_sim, sim) AS similarity
                ,i.id AS "itemId"
                ,iv.id AS "itemVariantId"
            FROM
                public.items AS i
                LEFT JOIN public.item_variants AS iv ON i.id = iv.item_id
                ,similarity(i.name, ${q}) AS sim
                ,similarity(iv.name, ${q}) AS v_sim
            WHERE
                (sim >= 0.1 OR v_sim >= 0.1)
                ${excludeItems ? Prisma.sql`AND i.id NOT IN (${Prisma.join(excludeItems.map(BigInt))})` : Prisma.empty}
                ${excludeItemVariants ? Prisma.sql`AND iv.id NOT IN (${Prisma.join(excludeItemVariants.map(BigInt))})` : Prisma.empty}
            ORDER BY
                v_sim DESC
                ,sim DESC
                ,i.updated_at DESC
                ,iv.updated_at DESC
            LIMIT ${limit ?? 10}
        `

        if (!foundItems) {
            return res.code(200).send({ items: [] })
        }

        const items = await db.item.findMany({
            where: {
                id: { 
                    in: foundItems.map(({ itemId }) => itemId), 
                },
            },
            include: {
                amountUnit: true,
                images: {
                    include: {
                        image: true,
                    },
                },
                variants: {
                    include: {
                        avatar: true,
                        item: {
                            include: {
                                images: {
                                    include: {
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                    where: {
                        id: {
                            in: foundItems.filter(({ itemVariantId }) => itemVariantId !== null).map(({ itemVariantId }) => itemVariantId),
                        },
                    },
                },
            },
        })

        return res.code(200).send({
            items,
        })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/item',
    api: [image, variant, attr],
})
