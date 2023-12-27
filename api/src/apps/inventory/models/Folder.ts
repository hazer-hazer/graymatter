import { Image } from '../../../models/Image'
import { UBigInt } from '../../../models/common'

export type FolderKind = 'Root' | 'Trash'

export interface Folder {
    id: UBigInt
    uri: string
    inventoryId: number
    name: string
    description: string | null
    parentId: UBigInt | null
    images?: { image: Image }[]

    kind?: FolderKind | null
}
