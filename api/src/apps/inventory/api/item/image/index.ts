import { FastifyPluginAsync } from 'fastify'
import { ItemImageCreate } from './schemas'
import db from '@/modules/prisma'
import { Api } from '@/App'

const fastifyPlugin: FastifyPluginAsync = async function (fastify) {
    fastify.post<ItemImageCreate>('/:itemId/image/:imageId', async (req, res) => {
        const { itemId, imageId } = req.params
        const result = await db.itemImage.create({
            data: {
                itemId,
                imageId,
            },
        })

        return res.code(200).send(result)
    })
}

export default new Api({
    fastifyPlugin,
})
