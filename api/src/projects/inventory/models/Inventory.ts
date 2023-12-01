import { FolderTree, TreePath } from '@/modules/prisma'
import { Folder } from './Folder'
import { UBigInt } from './common'

export interface Inventory {
    id: number
    uri: string
    userId: UBigInt
    name: string
    description: string | null

    // Extended //
    stats?: InventoryStats
    path?: TreePath
    tree?: FolderTree
    rootFolderId?: Folder['id']
}

export interface InventoryStats {
    itemsCount: number
    variantsCount: number
    foldersCount: number
    priceValue: number
}
