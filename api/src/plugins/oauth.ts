import fastifyOauth2 from '@fastify/oauth2'
import fp from 'fastify-plugin'

export default fp(async (fastify) => {
    fastify.register(fastifyOauth2, {
        name: 'googleOAuth2',
        credentials: {
            
        }
    })
})
