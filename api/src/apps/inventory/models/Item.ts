import { TreePath } from '@/modules/prisma'
import { AmountUnit } from './AmountUnit'
import { Folder } from './Folder'
import { Image } from '../../../models/Image'
import { Inventory } from './Inventory'
import { ItemVariant, ItemVariantCreateFields } from './ItemVariant'
import { UBigInt } from '../../../models/common'
import { Currency, RealPrice } from '@/models/Currency'
import { AttrValue, Attribute } from './Attribute'
import { BuyListItem } from './BuyList'

export interface ItemAttr {
    id: UBigInt
    attr: Attribute
    value: AttrValue
}

export interface Item {
    id: UBigInt

    uri: string

    name: string
    description?: string | null

    inventoryId: number
    inventory?: Inventory

    folder?: Folder
    folderId: UBigInt

    /**
     * @type integer
     */
    itemLocationId?: number | null
    itemLocationNotes?: string | null

    /**
     * @format url
     */
    buyLink: string | null
    // Note: Never accept from clients
    price: UBigInt | null
    currencyId: Currency['id']
    currency?: Currency

    createdAt: Date
    updatedAt: Date

    /**
     * @type integer
     */
    amountUnitId: number
    amountUnit?: AmountUnit
    amountValue: number

    images?: { image: Image }[]

    variants?: ItemVariant[]

    attributes?: ItemAttr[]

    buyLists?: (Omit<BuyListItem, 'buyList'> & Required<Pick<BuyListItem, 'buyList'>>)[]

    // Extended //

    /// Image picked from `images` by some logic (e.g. first image)
    avatar?: Image | null
    
    path?: TreePath

    variantsAmountSum?: number | null
    totalPrice?: number | null

    realPrice?: RealPrice | null
    // Remove, done on client
    displayPrice?: string | null
}

export type ItemCreateFields =
    Required<Pick<Item,
        | 'name'
        | 'inventoryId'
        | 'folderId'
        | 'amountUnitId'
    >>
    & Partial<Pick<Item,
        | 'uri'
        | 'description'
        | 'amountValue'
        | 'realPrice'
        | 'currencyId'
    >>
    & {
        variants?: ItemVariantCreateFields[]
    }

export type ItemUpdateFields =
    Partial<Pick<Item,
        | 'uri'
        | 'name'
        | 'description'
        | 'buyLink'
        | 'realPrice'
        | 'currencyId'
        | 'amountUnitId'
        | 'amountValue'
    >>

export const extendWithAvatar = (item: Item): Item => {
    return {
        ...item,
        avatar: getAvatar(item),
    }
}

export const getAvatar = (item: Item): Image | null  => {
    if (item.images?.length) {
        return item.images[0].image
    }

    return null
}
