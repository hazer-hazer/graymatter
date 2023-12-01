import 'dotenv'
import Fastify from 'fastify'
import config from 'config'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { registerRoutes } from './utils/fastify'
import projects from './projects'
import api from './api'
import fastifyHealthcheck from 'fastify-healthcheck'
import refSchema from './ref-schema.json'
import loggerConfig from './modules/log'
import sourceMapSupport from 'source-map-support'
import fastifyBearerAuth from '@fastify/bearer-auth'
import fastifyAuth from '@fastify/auth'
import decorators from './decorators'
import db from './modules/prisma'

sourceMapSupport.install()

const fastify = Fastify({
    logger: loggerConfig.dev,
})

// ;(BigInt.prototype as any).toJSON = function () {
//     return this.toString();
// };

void (async () => {
    fastify.setReplySerializer((payload) => {
        return JSON.stringify(payload, (_key, val) => {
            if (typeof val === 'bigint') {
                return val.toString()
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return val
        })
    })

    await fastify.register(cors, {})
    await fastify.register(fastifyHealthcheck, {})
    await fastify.register(fastifyCookie, {
        // secret: config.get('cookie.secret'),
    })
    // await fastify.register(fastifyAuth)
    // await fastify.register(fastifyBearerAuth, {
    //     keys: new Set(['superKek']),
    // })

    fastify.addHook('preHandler', function (req, _res, done) {
        if (req.body) {
            req.log.info({ body: req.body }, 'parsed body')
        }
        done()
    })

    // FIXME: Auth, this is stub
    fastify.addHook('onRequest', async (req, res) => {
        const testUser = await db.user.findUniqueOrThrow({
            where: { email: 'test@test.com' },
        })
        req.user = {
            id: testUser.id,
        }
    })

    fastify.addHook('onRoute', (route) => {
        console.log(route.method, route.path)
    })

    // fastify.addHook('onRequest', (req, res, done) => {
    //     const method = req.method.toLowerCase()
    //     if (method === 'get') {
    //         req.log.info(`Got GET request ${req.url}: %o`, req.params)
    //     } else if (method === 'post') {
    //         req.log.info(`Got POST request ${req.url}: %o`, req.body)
    //     }
    //     done()
    // })

    // fastify.addHook('onError', (req, res, error, done) => {
    //     console.log(error);
    //     done()
    // })

    // Ref schema logic //
    fastify.addSchema(refSchema)

    // Routes
    await registerRoutes(fastify, [api, projects])

    try {
        await fastify.listen({ port: config.get('http.port'), host: 'localhost' })
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
})()
