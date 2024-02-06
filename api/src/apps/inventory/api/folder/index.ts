import db from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { Api } from '@/App'
import { FolderCreate, schemas } from './schemas'
import { nameToUri } from '@/utils/names-format'

const folder: FastifyPluginAsync = async function (fastify) {
    fastify.get<FolderCreate>('/', { schema: schemas.FolderCreate }, async (req, res) => {
        const { folder: data } = req.body
        const folder = await db.folder.create({
            data: {
                uri: data.uri ?? nameToUri(data.name),
                ...data,
            },
        })

        return res.code(200).send({
            folder,
        })
    })
}

export default new Api({
    fastifyPlugin: folder,
    prefix: '/folder',
})
