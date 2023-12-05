import { App } from './App'
import { UBigInt } from './common'

export interface User {
    id: UBigInt
    email: string
    uri: string
    createdAt: Date

    apps?: App[]
}
