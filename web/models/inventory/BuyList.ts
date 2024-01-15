import type { Item } from './Item'
import type { ItemVariant } from './ItemVariant'

export interface BuyList {
    id: string

    name: string

    description: string | null

    createdAt: Date
    updatedAt: Date

    watch: boolean

    items: BuyListItem[]
}

export interface BuyListItem {
    id: string

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
