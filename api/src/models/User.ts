import { App } from './App'
import { Currency } from './Currency'
import { Image } from './Image'
import { UBigInt } from './common'

export interface User {
    id: UBigInt
    email: string
    uri: string
    createdAt: Date
    avatar: Image | null

    currencyId: Currency['id'] | null
    currency?: Currency | null

    apps?: App[]
}
