import { UBigInt } from './common'

export interface ItemVariant {
    id: UBigInt
    uri: string
    name: string
    description: string | null
    itemId: UBigInt
    reasonablePrice: number | null
}
