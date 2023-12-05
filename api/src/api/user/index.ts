import { Api } from '@/App'
import { FastifyPluginAsync } from 'fastify'
import { UserGetById } from './schemas'
import db from '@/modules/prisma'

const user: FastifyPluginAsync = async (fastify) => {
    fastify.get<UserGetById>('/:userId', async (req, res) => {
        const { userId } = req.params
        const user = await db.user.findUniqueOrThrow({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                uri: true,
                createdAt: true,
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
