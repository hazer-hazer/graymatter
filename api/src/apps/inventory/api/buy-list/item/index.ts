import { Api } from '@/App'
import db, { DB } from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { BuyListItemCreate, BuyListItemDelete, BuyListItemGet, BuyListItemUpdate, schemas } from './schemas'
import { BuyListItem } from '@/apps/inventory/models/BuyList'

export const buyListItemClientResInclude = {
    buyList: true,
    item: {
        include: {
            images: {
                include: {
                    image: true,
                },
            },
            amountUnit: true,
            currency: true,
        },
    },
    itemVariant: {
        include: {
            avatar: true,
        },
    },
} satisfies DB.BuyListItemInclude

const applyWatching = async (item: BuyListItem & Required<Pick<BuyListItem, 'item'>>): Promise<boolean> => {
    if (item.checked) {
        return true
    }

    const stockAmount = item.itemVariant?.amountValue ?? item.item?.amountValue ?? -1

    if (stockAmount >= item.amountValue) {
        await db.buyListItem.update({
            where: { id: item.id },
            data: {
                checked: true,
            },
            include: buyListItemClientResInclude,
        })

        return true
    }

    return false
}

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.get<BuyListItemGet>('/', { schema: schemas.BuyListItemGet }, async (req, res) => {
        const buyListItems = await db.buyListItem.findMany({
            where: { buyListId: req.params.buyListId },
            include: buyListItemClientResInclude,
        })

        return res.code(200).send({
            buyListItems,
        })
    })

    fastify.post<BuyListItemCreate>('/', { schema: schemas.BuyListItemCreate }, async (req, res) => {
        const buyListItem = await db.buyListItem.create({
            data: {
                ...req.body.buyListItem, 
                userId: req.user.userId,
                buyListId: req.params.buyListId,
            },
            include: buyListItemClientResInclude,
        })

        return res.code(200).send({
            buyListItem,
        })
    })

    fastify.put<BuyListItemUpdate>('/:buyListItemId', { schema: schemas.BuyListItemUpdate }, async (req, res) => {
        const buyListItem = await db.buyListItem.update({
            where: {
                buyListId: req.params.buyListId,
                id: req.params.buyListItemId,
            },
            data: req.body.buyListItem,
            include: buyListItemClientResInclude,
        })

        if (buyListItem.buyList.watch) {
            buyListItem.checked = await applyWatching(buyListItem)
        }

        return res.code(200).send({
            buyListItem,
        })
    })

    fastify.delete<BuyListItemDelete>('/:buyListItemId', { schema: schemas.BuyListItemDelete }, async (req, res) => {
        const buyListItem = await db.buyListItem.delete({
            where: {
                buyListId: req.params.buyListId,
                id: req.params.buyListItemId,
            },
            include: buyListItemClientResInclude,
        })

        return res.code(200).send({
            buyListItem,
        })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/:buyListId/item',
    api: [],
})
