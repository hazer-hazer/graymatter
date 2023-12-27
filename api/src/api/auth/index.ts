import { Api } from '@/App'
import db from '@/modules/prisma'
import { FastifyPluginAsync } from 'fastify'
import { Login, Logout, Signup, schemas } from './schemas'
import { emailToUri } from '@/utils/names-format'
import crypt from '@/modules/crypt'
import config from 'config'

const JWT_EXPIRES_IN = config.get<number>('auth.jwt.expiresIn')
const JWT_REMEMBER_ME_EXPIRES_IN = config.get<number>('auth.jwt.rememberMeExpiresIn')

const auth: FastifyPluginAsync = async (fastify) => {
    fastify.post<Logout>('/logout', { schema: schemas.Logout }, async (req, res) => {
        const { userId } = req.user

        await db.user.update({
            where: { id: userId },
            data: {
                online: false,
            },
        })

        return res.code(200).send({})
    })

    fastify.post<Signup>('/signup', { schema: schemas.Signup, config: { auth: false } }, async (req, res) => {
        const { email, password, uri } = req.body

        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        const encryptedPassword = crypt.password.crypt(password)

        const user = await db.user.create({
            data: {
                email,
                password: encryptedPassword,
                uri: uri ?? emailToUri(email),
            },
            include: {
                avatar: true,
            },
        })

        return res.code(200).send({
            user,
        })
    })

    fastify.post<Login>('/login', { schema: schemas.Login, config: { auth: false } }, async (req, res) => {
        const { email, password, rememberMe } = req.body

        const user = await db.user.findUniqueOrThrow({
            where: {
                email,
            },
            include: {
                avatar: true,
            },
        })

        if (!crypt.password.check(password, user.password)) {
            // TODO: Invalid password error
            return res.code(401).send({
                message: 'Invalid password',
            })
        }

        const expiresIn = rememberMe ? JWT_REMEMBER_ME_EXPIRES_IN : JWT_EXPIRES_IN

        const jwt = await res.jwtSign({
            userId: user.id.toString(),
            email: user.email,
            uri: user.uri,
        }, {
            expiresIn,
        })

        return res
            .code(200)
            .send({
                user,
                jwt,
            })
    })
}

export default new Api({
    fastifyPlugin: auth,
    prefix: '/auth',
})
