import { Email, UBigInt, UriPath } from '@/models/common'

export interface UserPayload {
    userId: UBigInt
    uri: UriPath
    email: Email
}
