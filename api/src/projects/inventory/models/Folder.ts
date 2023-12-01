import { Image } from '../../../models/Image'
import { UBigInt } from './common'

export interface Folder {
    id: UBigInt
    uri: string
    inventoryId: number
    name: string
    description: string | null
    parentId: UBigInt | null
    images?: { image: Image }[]
}
