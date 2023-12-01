import type { AmountUnit } from './AmountUnit'
import type { Image } from './Image'
import type { Inventory } from './Inventory'
import type { ItemVariant } from './ItemVariant'
import type { TreePath } from './Tree'

export interface Item {
    id: string

    uri: string

    name: string
    description: string | null

    inventoryId: number
    inventory: Pick<Inventory, 'uri'>

    // folder?: Folder
    folderId: string

    rawAmountValue: bigint

    itemLocationId?: number | null
    itemLocationNotes?: string | null

    buyLink?: string | null
    reasonablePrice?: number | null

    createdAt: Date
    updatedAt: Date

    amountUnitId: number
    amountUnit: AmountUnit

    images?: { image: Image }[]

    variants?: ItemVariant[]

    path?: TreePath
}

export interface ItemGetByIdParams {
    id: string
}

export interface ItemGetByIdResult {
    item: Item
}
