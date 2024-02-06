import db from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { Api } from '@/App'
import { CurrencyGet, schemas } from './schemas'

const currency: FastifyPluginAsync = async function (fastify) {
    fastify.get<CurrencyGet>('/', { schema: schemas.CurrencyGet }, async (_req, res) => {
        const currencies = await db.currency.findMany()

        return res.code(200).send({
            currencies,
        })
    })
}

export default new Api({
    fastifyPlugin: currency,
    prefix: '/currency',
})
