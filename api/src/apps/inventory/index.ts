import { FastifyInstance } from 'fastify'
import api from './api'
import { Api } from '@/App'

export default new Api({
    fastifyPlugin: async (fastify: FastifyInstance) => {
        fastify.log.info('Inventory plugin registered')
    },
    prefix: '/inventory',
    api,
})
