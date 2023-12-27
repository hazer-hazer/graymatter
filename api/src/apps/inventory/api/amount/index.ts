import db from '@/modules/prisma'
import { AmountUnitCreate, AmountUnitGetById, AmountUnitSearch, schemas } from './schemas'
import { FastifyPluginAsync } from 'fastify'
import { Api } from '@/App'


const amount: FastifyPluginAsync = async function (fastify) {
    fastify.get<AmountUnitSearch>('/', { schema: schemas.AmountUnitSearch }, async (_req, res) => {
        const amountUnits = await db.amountUnit.findMany({
            where: {},
            include: {
                powerPrefixes: true,
            },
        })

        return res.code(200).send({
            amountUnits,
        })
    })

    fastify.post<AmountUnitCreate>('/', { schema: schemas.AmountUnitCreate }, async (req, res) => {
        const {
            amountUnit: {
                powerPrefixes, ...amountUnit
            },
        } = req.body

        const result = await db.amountUnit.create({
            include: {
                powerPrefixes: true,
            },
            data: {
                ...amountUnit,
                userId: req.user.userId,
                powerPrefixes: {
                    create: powerPrefixes?.map(({ prefix, power, name }) => ({
                        prefix,
                        power,
                        name,
                    })),
                },
            },
        })

        return res.code(200).send({
            amountUnit: result,
        })
    })

    fastify.get<AmountUnitGetById>('/:amountId', { schema: schemas.AmountUnitGetById }, async (req, res) => {
        const unit = await db.amountUnit.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                symbol: true,
                userId: true,
                powerPrefixes: {
                    select: {
                        amountUnitId: true,
                        power: true,
                        prefix: true,
                        name: true,
                    },
                    orderBy: {
                        power: 'asc',
                    },
                },
            },
            where: {
                id: Number(req.params.amountId),
            },
        })

        return res.code(200).send({
            unit,
        })
    })
}

export default new Api({
    fastifyPlugin: amount,
    prefix: '/amount',
})
