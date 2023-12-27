export { default as schemas } from './schemas.json'
import { User } from '@/models/User'
import { Email, UriPath } from '@/models/common'

export interface Signup {
    Body: {
        email: Email
        password: string
        uri?: UriPath
    }
    Reply: {
        200: {
            user: User
        }
    }
}

export interface Login {
    Body: {
        email: Email
        password: string
        /**
         * @description Store cookie for a longer time
         */
        rememberMe?: boolean
    }
    Reply: {
        200: {
            user: User
            jwt: string
        }
        401: void
    }
}

export interface Logout {
    Reply: {
        200: void
    }
}
