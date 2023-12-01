import { FastifyPluginAsync } from 'fastify'

export class Api {
    fastifyPlugin?: FastifyPluginAsync
    prefix?: string
    api?: Api[]
    
    constructor({ fastifyPlugin, prefix, api }: {
        fastifyPlugin?: FastifyPluginAsync
        prefix?: string
        api?: Api[]
    }) {
        this.fastifyPlugin = fastifyPlugin
        this.prefix = prefix
        this.api = api
    }
}
