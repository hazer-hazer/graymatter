import { UBigInt } from '@/models/common'
import { Item } from './Item'
import { ItemVariant } from './ItemVariant'
import { User } from '@/models/User'

export interface BuyList {
    id: UBigInt

    uri: string

    name: string

    description: string | null
    
    userId: User['id']
    user?: User

    createdAt: Date
    updatedAt: Date

    watch: boolean

    items?: BuyListItem[]
}

export type BuyListCreateFields =
    Required<Pick<BuyList,
        | 'name'
        | 'watch'
    >>
    & Partial<Pick<BuyList,
        | 'description'
        | 'uri'
    >>

export type BuyListUpdateFields =
    Partial<Pick<BuyList,
        | 'name'
        | 'description'
        | 'watch'
        | 'uri'
    >>

export interface BuyListItem {
    id: UBigInt

    name: string | null
    description: string | null

    itemId: Item['id'] | null
    item?: Item | null
    itemVariantId: ItemVariant['id'] | null
    itemVariant?: ItemVariant | null

    amountValue: number

    checked: boolean

    buyListId: BuyList['id']
    buyList?: BuyList
}

export type BuyListItemCreateFields =
    Required<Pick<BuyListItem,
        | 'name'
        | 'itemId'
        | 'itemVariantId'
        | 'amountValue'
    >>
    & Partial<Pick<BuyListItem, 'description'>>

export type BuyListItemUpdateFields =
    Partial<Pick<BuyListItem,
        | 'name'
        | 'description'
        | 'amountValue'
        | 'checked'
    >>
