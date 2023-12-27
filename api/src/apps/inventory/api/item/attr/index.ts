import { Api } from '@/App'
import { FastifyPluginAsync } from 'fastify'
import { ItemAttrCreate, ItemAttrDelete, ItemAttrUpdate, schemas } from './schemas'
import db from '@/modules/prisma'
import { ItemAttr } from '@/apps/inventory/models/Item'

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.post<ItemAttrCreate>('/:itemId/attr/:attrId', { schema: schemas.ItemAttrCreate }, async (req, res) => {
        const { itemId, attrId } = req.params
        const { value } = req.body

        const itemAttr: ItemAttr = await db.itemAttr.create({
            data: {
                itemId,
                attrId,
                value,
            },
            include: {
                attr: true,
            },
        })

        return res.code(200).send({
            itemAttr,
        })
    })

    fastify.put<ItemAttrUpdate>('/:itemId/attr/:attrId', { schema: schemas.ItemAttrUpdate }, async (req, res) => {
        const { itemId, attrId } = req.params
        const { value } = req.body

        const itemAttr: ItemAttr = await db.itemAttr.update({
            where: { itemId_attrId: { itemId, attrId } },
            data: {
                value,
            },
            include: {
                attr: true,
            },
        })

        return res.code(200).send({
            itemAttr,
        })
    })

    fastify.delete<ItemAttrDelete>('/:itemId/attr/:attrId', { schema: schemas.ItemAttrDelete }, async (req, res) => {
        const { itemId, attrId } = req.params

        await db.itemAttr.delete({
            where: { itemId_attrId: { itemId, attrId } },
        })

        return res.code(200).send({})
    })
}


export default new Api({
    fastifyPlugin,
})
