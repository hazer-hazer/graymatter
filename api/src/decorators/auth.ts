import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'

const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.decorate('auth', async (req: FastifyRequest, res: FastifyReply) => {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).send('Unauthorized')
        }

        const cookie = req.unsignCookie(token)
        if (!cookie.valid) {
            return res.status(401).send('Invalid cookie')
        }

        const user = await fastify.getMe()

        fastify.decorateRequest('user', user)
    })
}

export default auth
