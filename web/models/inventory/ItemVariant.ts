import type { Image } from '../Image'
import type { AttrValue } from './Attribute'
import type { ItemAttr } from './Item'

export interface ItemVariantAttr {
    itemAttr: ItemAttr
    value: AttrValue
}

export interface ItemVariant {
    id: string
    uri: string
    name: string
    description: string | null
    avatar: Image | null
    itemId: string
    // price: number | null
    amountValue: number

    realPrice: number | null

    attributes?: ItemVariantAttr[]
}
