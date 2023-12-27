import { Api } from '@/App'
import { FastifyPluginAsync } from 'fastify'
import { UserGetById, UserGetMe, schemas } from './schemas'
import db from '@/modules/prisma'

const userSelectSingleFields = {
    id: true,
    email: true,
    uri: true,
    createdAt: true,
    avatar: true,
    currencyId: true,
}

const user: FastifyPluginAsync = async (fastify) => {
    fastify.get<UserGetById>('/:userId', { schema: schemas.UserGetById }, async (req, res) => {
        const { userId } = req.params
        const user = await db.user.findUniqueOrThrow({
            where: { id: userId },
            select: userSelectSingleFields,
        })

        return res.code(200).send({
            user,
        })
    })

    fastify.addHook('preSerialization', async function (req, res, payload) {
        this.log.info({ payload }, 'Payload')

        return payload
    })

    fastify.get<UserGetMe>('/me', { schema: schemas.UserGetMe }, async (req, res) => {
        const user = await db.user.findUniqueOrThrow({
            where: { id: req.user.userId },
            include: {
                avatar: true,
            },
        })

        return res.code(200).send({
            user,
        })
    })
}

export default new Api({
    fastifyPlugin: user,
    prefix: '/user',
})
