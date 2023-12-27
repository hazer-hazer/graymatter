import { Api } from '@/App'
import fastifyMultipart from '@fastify/multipart'
import { FastifyPluginAsync } from 'fastify'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { createWriteStream } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import fastifyStatic from '@fastify/static'
import db, { DB } from '@/modules/prisma'
import { ImageUpload, schemas } from './schemas'
import { UploadClient, UploadcareFile } from '@uploadcare/upload-client'
import config from 'config'

// const IMG_FOLDER = './img'
// const IMG_FOLDER_URI = '/img'

// const pump = promisify(pipeline)

const uploadcare = new UploadClient({
    publicKey: config.get('img.uploadcare.publicKey'),
})

const img: FastifyPluginAsync = async function (fastify) {
    await fastify.register(fastifyMultipart, {
        throwFileSizeLimit: true,
        limits: {
            fileSize: 2 ** 21,
        },
    })

    // fastify.post<ImageUpload>('/', {schema: schemas.ImageUpload}, async (req, res) => {
    //     const filenames = []
    //     for await (const part of req.files()) {
    //         const filename = `${randomUUID()}.${part.filename}`
    //         await pump(part.file, createWriteStream(path.join(IMG_FOLDER, filename)))
    //         filenames.push(filename)
    //     }

    //     const imagesUrls = filenames.map((filename): DB.ImageCreateInput => ({
    //         src: `${IMG_FOLDER_URI}/${filename}`
    //     }))

    //     await db.image.createMany({
    //         data: imagesUrls
    //     })

    //     return res.code(200).send({
    //         images: imagesUrls,
    //     })
    // })
    // await fastify.register(fastifyStatic, {
    //     root: path.join(appRootPath, IMG_FOLDER),
    // })

    fastify.post<ImageUpload>('/', { schema: schemas.ImageUpload }, async (req, res) => {
        const images = []
        for await (const file of req.files()) {
            const result = await uploadcare.uploadFile(await file.toBuffer())
            if (!result.cdnUrl) {
                // FIXME
                throw new Error('No cdnUrl in result')
            }
            images.push(await db.image.create({
                data: {
                    src: result.cdnUrl,
                    userId: req.user.userId,
                },
            }))
        }

        return res.code(200).send({
            images,
        })
    })
}

export default new Api({
    fastifyPlugin: img,
    prefix: '/img',
})
