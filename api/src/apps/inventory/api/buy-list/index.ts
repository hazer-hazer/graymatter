import { Api } from '@/App'
import { FastifyPluginAsync } from 'fastify'
import { BuyListCheckAll, BuyListClear, BuyListCreate, BuyListDelete, BuyListGetById, BuyListGetMy, BuyListUpdate, schemas } from './schemas'
import db, { DB } from '@/modules/prisma'
import item, { buyListItemClientResInclude } from './item'
import { nameToUri } from '@/utils/names-format'

export const buyListClientResInclude = {
    items: {
        include: buyListItemClientResInclude,
    },
} satisfies DB.BuyListInclude

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.get<BuyListGetById>('/:id', { schema: schemas.BuyListGetById }, async (req, res) => {
        const buyList = await db.buyList.findUniqueOrThrow({
            where: { id: req.params.id, userId: req.user.userId },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })

    fastify.post<BuyListCreate>('/', { schema: schemas.BuyListCreate }, async (req, res) => {
        const {
            name,
            description,
            watch,        
        } = req.body.buyList

        const uri = req.body.buyList.uri ?? nameToUri(name)

        const buyList = await db.buyList.create({
            data: {
                userId: req.user.userId,
                uri,
                name,
                description,
                watch,
            },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })

    fastify.put<BuyListUpdate>('/:id', { schema: schemas.BuyListUpdate }, async (req, res) => {
        const buyList = await db.buyList.update({
            where: { id: req.params.id, userId: req.user.userId },
            data: req.body.buyList,
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })
    
    fastify.delete<BuyListDelete>('/:id', { schema: schemas.BuyListDelete }, async (req, res) => {
        const buyList = await db.buyList.delete({
            where: { id: req.params.id, userId: req.user.userId },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })

    fastify.get<BuyListGetMy>('/', { schema: schemas.BuyListGetMy }, async (req, res) => {
        const buyLists = await db.buyList.findMany({
            where: { userId: req.user.userId },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyLists,
        })
    })

    fastify.post<BuyListCheckAll>('/:id/check-all', { schema: schemas.BuyListCheckAll }, async (req, res) => {
        await db.buyListItem.updateMany({
            where: {
                buyListId: req.params.id,
                userId: req.user.userId,
            },
            data: {
                checked: req.body.checked,
            },
        })

        const buyList = await db.buyList.findUniqueOrThrow({
            where: { id: req.params.id },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })

    fastify.post<BuyListClear>('/:id/clear', { schema: schemas.BuyListClear }, async (req, res) => {
        await db.buyListItem.deleteMany({
            where: {
                buyListId: req.params.id,
                userId: req.user.userId,
            },
        })

        const buyList = await db.buyList.findUniqueOrThrow({
            where: { id: req.params.id },
            include: buyListClientResInclude,
        })

        return res.code(200).send({
            buyList,
        })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/buy-list',
    api: [item],
})
