import { UserData } from '@/types/auth'
import fastifyJwt from '@fastify/jwt'
import config from 'config'
import fp from 'fastify-plugin'

export default fp(async (fastify) => {
    await fastify.register(fastifyJwt, {
        secret: config.get<string>('auth.jwt.secret'),
        // cookie: {
        //     cookieName: config.get<string>('auth.jwt.cookieName'),
        //     signed: true,
        // },
        formatUser(payload): UserData {
            return {
                ...payload,
                userId: BigInt(payload.userId),
            }
        },
    })
 
    fastify.decorate('jwtAuth', async (req, res) => {
        try {
            await req.jwtVerify()
        } catch (err) {
            return res.code(401).send(err)
        }
    })    
})
