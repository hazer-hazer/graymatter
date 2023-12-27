import 'dotenv'
import Fastify, { FastifyInstance, onRequestHookHandler } from 'fastify'
import config from 'config'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { registerApi as registerApi } from './utils/fastify'
import projects from './apps'
import api from './api'
import fastifyHealthcheck from 'fastify-healthcheck'
import refSchema from './ref-schema.json'
import loggerConfig from './modules/log'
import sourceMapSupport from 'source-map-support'
import fastifyBearerAuth from '@fastify/bearer-auth'
import fastifyAuth from '@fastify/auth'
import decorators from './decorators'
import db, { DB } from './modules/prisma'
import fastifyJwt from '@fastify/jwt'
import plugins from './plugins'
import { readFileSync } from 'fs'
import path from 'path'
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

sourceMapSupport.install()

const fastify = Fastify({
    logger: loggerConfig.dev,
    // https: {
    //     key: readFileSync(path.join(__dirname, '..', '..', 'ssl', 'gm.key')),
    //     cert: readFileSync(path.join(__dirname, '..', '..', 'ssl', 'gm.cert')),
    // },
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

    await fastify.register(cors, {
        origin: true,
        credentials: true,
    })
    await fastify.register(fastifyHealthcheck, {})
    // await fastify.register(fastifyCookie)
    // await fastify.register(fastifyAuth)
    // await fastify.register(fastifyBearerAuth, {
    //     keys: new Set(['superKek']),
    // })
    await Promise.all(plugins.map(pl => fastify.register(pl)))

    fastify.addHook('onRequest', async (req, res) => {
        req.log.info({ headers: req.headers }, 'Headers')
    })

    fastify.addHook('preHandler', function (req, _res, done) {
        if (req.body) {
            req.log.info({ body: req.body }, 'parsed body')
        }
        done()
    })

    // Ref schema logic //
    fastify.addSchema(refSchema)

    // Routes
    await registerApi(fastify, [
        api,
        projects,
    ], {
        auth: true,
    })

    // // !Note: Add this hook after registering API 
    // fastify.addHook('onRoute', (route) => {
    //     if (route.config?.auth) {
    //         const onRequest = Array.isArray(route.onRequest) ? route.onRequest : route.onRequest ? [route.onRequest] : []
    //         route.onRequest = [
    //             ...onRequest,
    //             fastify.auth([fastify.jwtAuth.bind(fastify)]),
    //         ]
    //     }

    //     console.log(`Added route ${Array.isArray(route.method) ? route.method.join(', ') : route.method} ${route.url}; [auth=${route.config?.auth}]`)
    // })

    fastify.addHook('onRequest', async function (req, res) {
        if (req.routeOptions.config.auth) {
            await this.jwtAuth(req, res)
        }
    })

    try {
        await fastify.listen({ port: config.get('http.port'), host: 'localhost' })
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
})()
