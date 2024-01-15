import type { Currency } from '../Currency'
import type { Image } from '../Image'
import type { AmountUnit } from './AmountUnit'
import type { AttrValue, Attribute } from './Attribute'
import type { BuyListItem } from './BuyList'
import type { Inventory } from './Inventory'
import type { ItemVariant } from './ItemVariant'
import type { TreePath } from './Tree'
import type { Refine } from '~/utils/types'

export interface ItemAttr {
    id: string
    attr: Attribute
    value: AttrValue
}

export interface Item {
    id: string

    uri: string

    name: string
    description: string | null

    inventoryId: number
    inventory: Pick<Inventory, 'uri'>

    // folder?: Folder
    folderId: string

    itemLocationId?: number | null
    itemLocationNotes?: string | null

    buyLink: string | null
    price: string | null
    currencyId: Currency['id']
    currency: Currency

    createdAt: Date
    updatedAt: Date

    amountUnitId: number
    amountUnit: AmountUnit
    amountValue: number

    images?: { image: Image }[]
    variants?: ItemVariant[]
    attributes?: ItemAttr[]
    buyLists?: Refine<BuyListItem, 'buyList'>[]

    // Extended //
    path?: TreePath
    variantsAmountSum?: number | null
    totalPrice?: number | null
    realPrice: number | null
    displayPrice?: string | null
}

export interface ItemGetByIdParams {
    id: string
}

export interface ItemGetByIdResult {
    item: Item
}
