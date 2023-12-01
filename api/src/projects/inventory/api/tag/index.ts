import {  FastifyPluginAsync } from 'fastify'
import db from '@/modules/prisma'
import { TagCreate, TagGetById, TagSearch, schemas } from './schemas'
import { Api } from '@/Project'

const tag: FastifyPluginAsync = async function(fastify) {
    fastify.get<TagSearch>('/', async () => {
        return db.tag.findMany({})
    })

    fastify.post<TagCreate>('/', { schema: schemas.TagCreate }, async (req) => {
        return db.tag.create({
            data: {
                ...req.body,
            },
        })
    })

    fastify.get<TagGetById>('/:id', { schema: schemas.TagGetById }, async (req) => {
        return db.tag.findUnique({ where: { id: Number(req.params.id) } })
    })
}

export default new Api({
    fastifyPlugin: tag,
    prefix: '/tag',
})
