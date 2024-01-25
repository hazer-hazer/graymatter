import { FolderTree, TreePath } from '@/modules/prisma'
import { Folder } from './Folder'
import { UBigInt } from '../../../models/common'
import { Image } from '@/models/Image'
import { Currency } from '@/models/Currency'
import { User } from '@/models/User'

export interface Inventory {
    id: number
    uri: string
    userId: User['id']
    name: string
    description: string | null

    avatar?: Image | null
    avatarImageId?: UBigInt | null

    currencyId: Currency['id'] | null
    currency?: Currency

    stars?: InventoryStar[]

    // Extended //
    stats?: InventoryStats
    path?: TreePath
    tree?: FolderTree
    rootFolderId?: Folder['id']
    trashFolderId?: Folder['id']
    starred?: boolean
}

export interface InventoryStats {
    itemsCount: number
    variantsCount: number
    foldersCount: number
    totalPrice: number | null
    itemsInTrashFolderCount: UBigInt
}

export type InventoryCreateFields =
    Required<Pick<Inventory,
        | 'name'
        | 'description'
    >>
    & Partial<Pick<Inventory,
        | 'uri'
    >>

export interface InventoryStar {
    userId: User['id']
    user?: User
    inventoryId: Inventory['id']
    inventory?: Inventory

    createdAt: Date
}
