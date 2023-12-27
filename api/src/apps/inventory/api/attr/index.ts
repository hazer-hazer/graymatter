import { Api } from '@/App'
import { FastifyPluginAsync } from 'fastify'
import { AttrCreate, AttrGetById, AttrGetMy, AttrUpdate, schemas } from './schemas'
import db from '@/modules/prisma'
import { Attribute } from '../../models/Attribute'

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.post<AttrCreate>('/', { schema: schemas.AttrCreate }, async (req, res) => {
        const {
            attr: data,
        } = req.body

        const attr: Attribute = await db.attribute.create({
            data: {
                ...data,
                userId: req.user.userId,
            },
        })

        return res.code(200).send({
            attr,
        })
    })

    fastify.put<AttrUpdate>('/:attrId', { schema: schemas.AttrUpdate }, async (req, res) => {
        const { attrId } = req.params
        const { attr: data } = req.body

        const attr: Attribute = await db.attribute.update({
            where: { id: attrId },
            data,
        })

        return res.code(200).send({
            attr,
        })
    })

    fastify.get<AttrGetById>('/:attrId', { schema: schemas.AttrGetById }, async (req, res) => {
        const { attrId } = req.params

        const attr: Attribute = await db.attribute.findUniqueOrThrow({
            where: { id: attrId },
        })

        return res.code(200).send({
            attr,
        })
    })

    fastify.get<AttrGetMy>('/my', { schema: schemas.AttrGetMy }, async (req, res) => {
        const attrs: Attribute[] = await db.attribute.findMany({
            where: { userId: req.user.userId },
        })

        return res.code(200).send({
            attrs,
        })
    })
}

export default new Api({
    fastifyPlugin,
    prefix: '/attr',
})
