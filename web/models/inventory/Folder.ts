import type { Image } from '../Image'

export interface Folder {
    id: string
    uri: string
    inventoryId: number
    name: string
    description: string | null
    parentId: string | null
    images?: { image: Image }[]
}
