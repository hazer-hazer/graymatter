import db, { DB } from '@/modules/prisma'
import { AmountUnitCreate, AmountUnitGetById, AmountUnitSearch, ItemAmountGet, schemas } from './schemas'
import { FastifyPluginAsync } from 'fastify'
import { Api } from '@/Project'


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
        const { powerPrefixes, ...amountUnit } = req.body

        const unit = await db.amountUnit.create({
            include: {
                powerPrefixes: true,
            },
            data: {
                ...amountUnit,
                userId: req.user.id,
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
            unit,
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

    /// Get amount of items available
    fastify.get<ItemAmountGet>('/item/:itemId', { schema: schemas.ItemAmountGet }, async (req, res) => {
        const itemId = BigInt(req.params.itemId)
        // const { _sum: value } = await db.arrivalItems.aggregate({
        //     where: {
        //         itemId,
        //         item: {
        //             userId: req.user.id,
        //         },
        //     },
        //     _sum: {
        //         value: true,
        //     },
        // })

        // TODO: For now, this route is useless cause uses rawAmountValue but is
        // intended to make complex calculation of amount value, including
        // arrivals, usages, returns, etc.

        const { amountUnit, rawAmountValue } = await db.item.findUniqueOrThrow({
            select: {
                rawAmountValue: true,
                amountUnit: {
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
                },
            },
            where: {
                id: itemId,
                userId: req.user.id,
            },
        })

        return res.code(200).send({
            amount: {
                unit: amountUnit,
                value: rawAmountValue,
            },
        })
    })
}

export default new Api({
    fastifyPlugin: amount,
    prefix: '/amount',
})
