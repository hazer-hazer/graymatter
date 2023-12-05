import { FastifyContextConfig, FastifyPluginAsync } from 'fastify'

export class Api {
    fastifyPlugin?: FastifyPluginAsync
    prefix?: string
    api?: Api[]
    config?: FastifyContextConfig

    constructor({ fastifyPlugin, prefix, api, config }: {
        fastifyPlugin?: FastifyPluginAsync
        prefix?: string
        api?: Api[]
        config?: FastifyContextConfig
    }) {
        this.fastifyPlugin = fastifyPlugin
        this.prefix = prefix
        this.api = api
        this.config = config
    }
}
