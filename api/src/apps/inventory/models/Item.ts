import { TreePath } from '@/modules/prisma'
import { AmountUnit } from './AmountUnit'
import { Folder } from './Folder'
import { Image } from '../../../models/Image'
import { Inventory } from './Inventory'
import { ItemVariant } from './ItemVariant'
import { UBigInt } from '../../../models/common'

export interface Item {
    id: UBigInt

    uri: string

    name: string
    description?: string | null

    inventoryId: number
    inventory?: Inventory

    folder?: Folder
    folderId: UBigInt

    rawAmountValue: UBigInt

    /**
     * @type integer
     */
    itemLocationId?: number | null
    itemLocationNotes?: string | null

    buyLink?: string | null
    reasonablePrice?: number | null

    createdAt: Date
    updatedAt: Date

    /**
     * @type integer
     */
    amountUnitId: number
    amountUnit?: AmountUnit

    images?: { image: Image }[]

    variants?: ItemVariant[]

    path?: TreePath
}
