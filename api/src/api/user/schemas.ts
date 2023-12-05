export { default as schemas } from './schemas.json'
import { User } from '@/models/User'
import { UBigInt } from '@/models/common'

export interface UserGetById {
    Params: {
        userId: UBigInt
    }
    Reply: {
        200: {
            user: User
        }
    }
}
