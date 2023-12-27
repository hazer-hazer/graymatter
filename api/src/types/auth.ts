import { Email, UBigInt, UriPath } from '@/models/common'

export interface UserData {
    userId: UBigInt
    uri: UriPath
    email: Email
}

export interface UserPayload {
    userId: string
    uri: UriPath
    email: Email
}
