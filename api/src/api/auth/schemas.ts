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
    }
    Reply: {
        200: {
            user: User
        }
        401: void
    }
}

export interface Logout {
    Reply: {
        200: void
    }
}
