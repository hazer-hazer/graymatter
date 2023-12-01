import { User } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance<
    // HttpServer = Server,
    // HttpRequest = IncomingMessage,
    // HttpResponse = ServerResponse
  > {
    verifyJWT(): void
    registerRoutes(routes: Record<string, FastifyPluginAsync>): this
    getMe(): Promise<FastifyRequest['user']>
    auth(req: FastifyRequest, res: FastifyReply): void
  }

  export interface FastifyRequest {
    user: {
      id: bigint
    }
  }
}
