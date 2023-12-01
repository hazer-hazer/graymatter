import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify'

const getMe: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.decorateRequest('user', {
        id: 1n,
    })

    fastify.decorate('getMe', async function (): Promise<FastifyRequest['user']> {
        // TODO 

        const user: FastifyRequest['user'] = await new Promise(() => ({
            id: '123',
        }))

        return user
    })
}

export default getMe
