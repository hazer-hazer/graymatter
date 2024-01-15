import { Image } from '@/models/Image'
import { UBigInt } from '../../../models/common'
import { RealPrice } from '@/models/Currency'
import { Item, ItemAttr } from './Item'
import { AttrValue } from './Attribute'

export interface ItemVariantAttr {
    itemAttr: ItemAttr
    value: AttrValue
}

export interface ItemVariant {
    id: UBigInt
    uri: string
    name: string
    description: string | null
    avatar?: Image | null
    avatarImageId: Image['id'] | null
    itemId: Item['id']
    amountValue: number

    price: UBigInt | null
    attributes?: ItemVariantAttr[]

    // Extended //
    realPrice?: RealPrice | null
    displayPrice?: string | null
}

export type ItemVariantCreateFields =
    Required<Pick<ItemVariant,
        | 'name'
    >>
    & Partial<Pick<ItemVariant,
        | 'description'
        | 'realPrice'
        | 'amountValue'
        | 'uri'
    >>

export type ItemVariantUpdateFields =
    Partial<Pick<ItemVariant,
        | 'uri'
        | 'name'
        | 'description'
        | 'avatarImageId'
        | 'amountValue'
        | 'realPrice'
    >>
