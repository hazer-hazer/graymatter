import { Api } from '@/Project'
import { FastifyInstance } from 'fastify'

export const registerRoutes = async function (fastify: FastifyInstance, routes: Api[]) {
    routes.map(async ({ fastifyPlugin, prefix, api }) => {
        await fastify.register(async (instance) => {
            if (fastifyPlugin) {
                await instance.register(fastifyPlugin)
            }
    
            if (api) {
                await registerRoutes(instance, api)
            }
        }, {
            prefix,
        })
    })
}
