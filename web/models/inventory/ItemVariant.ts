import type { Image } from './Image'

export interface ItemVariant {
    id: string
    uri: string
    name: string
    description: string | null
    itemId: string
    reasonablePrice?: number | null
    images?: {image: Image}[]
}
