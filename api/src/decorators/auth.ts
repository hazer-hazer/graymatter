// import { UserPayload } from '@/types/auth'
// import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'

// const jwtAuth: FastifyInstance['jwtAuth'] = async (req: FastifyRequest, res: FastifyReply) => {
//     const { jwt } = req.cookies

//     if (!jwt) {
//         return res.status(401).send('Unauthorized')
//     }

//     const cookie = req.unsignCookie(jwt)
//     if (!cookie.valid || !cookie.value) {
//         return res.status(401).send('Invalid cookie')
//     }

//     const user = req.jwtVerify<UserPayload>(cookie.value)

//     req.user = user
// }

// export default {
//     jwtAuth,
// }
