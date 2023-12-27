import { FolderTree, TreePath } from '@/modules/prisma'
import { Folder } from './Folder'
import { UBigInt } from '../../../models/common'
import { Image } from '@/models/Image'
import { Currency } from '@/models/Currency'

export interface Inventory {
    id: number
    uri: string
    userId: UBigInt
    name: string
    description: string | null

    avatar?: Image | null
    avatarImageId?: UBigInt | null

    currencyId: Currency['id'] | null
    currency?: Currency

    // Extended //
    stats?: InventoryStats
    path?: TreePath
    tree?: FolderTree
    rootFolderId?: Folder['id']
    trashFolderId?: Folder['id']
}

export interface InventoryStats {
    itemsCount: number
    variantsCount: number
    foldersCount: number
    priceValue: number
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
