import { AppEnvironment } from '@/types/common'
import { FastifyLoggerOptions } from 'fastify'
import { PinoLoggerOptions } from 'fastify/types/logger'

const config: Record<AppEnvironment, FastifyLoggerOptions & PinoLoggerOptions | boolean> = {
    dev: {
        serializers: {
            res (res) {
                return {
                    statusCode: res.statusCode,
                }
            },
            req (req) {
                return {
                    method: req.method,
                    url: req.routeOptions.url,
                    parameters: req.params,
                    body: req.body,
                }
            },
        },
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    prod: true,
}

export default config
