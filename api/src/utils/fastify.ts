import { Api } from '@/App'
import { FastifyContextConfig, FastifyInstance } from 'fastify'

export const registerApi = async function (fastify: FastifyInstance, routes: Api[], defaultConfig: FastifyContextConfig = {}) {
    for await (const { fastifyPlugin, prefix, api, config } of routes) {
        await fastify.register(async (fastify) => {
            fastify.addHook('onRoute', function (route) {
                if (route.method === 'HEAD') {
                    return
                }

                route.config = {
                    ...defaultConfig,
                    ...config,
                    ...route.config,
                }

                this.log.info(`Added route ${Array.isArray(route.method) ? route.method.join(', ') : route.method} ${route.url}; config=${JSON.stringify(route.config)}`)
            })

            if (fastifyPlugin) {
                await fastify.register(fastifyPlugin)
            }

            if (api) {
                await registerApi(fastify, api)
            }
        }, {
            prefix,
        })
    }
}
