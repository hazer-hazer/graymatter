import { UserData, UserPayload } from '../auth'
import '@fastify/jwt'
import 'fastify'

declare module 'fastify' {
  export interface FastifyInstance<
    // HttpServer = Server,
    // HttpRequest = IncomingMessage,
    // HttpResponse = ServerResponse
  > {
    jwtAuth(req: FastifyRequest, res: FastifyReply): Promise<void>
  }

  export interface FastifyContextConfig {
    auth?: boolean
  }

  // export interface FastifyRequest {
  //   user?: UserPayload
  // }
}


declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: UserPayload
    user: UserData
  }
}
