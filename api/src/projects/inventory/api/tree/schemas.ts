import { Folder } from '#inventory/models/Folder'
import { Item } from '#inventory/models/Item'
import { UBigInt, UriPath } from '#inventory/models/common'
import { DB, TreePath } from '@/modules/prisma'
import { Inventory } from '#inventory/models/Inventory'

export { default as schemas } from './schemas.json'
// import type { Folder } from '@prisma/client'

// export interface FolderResult {
//     id: string;
//     uri: string;
//     inventoryId: 
// }

export interface TreeGetBaseParams {
    'inventory': string
    '*': UriPath
}

export interface TreeFolderGet {
    Params: TreeGetBaseParams

    Reply: {
        200: {
            inventory: Inventory
            targetFolderId: Folder['id']
            targetFolderPath: TreePath
            folders: Folder[]
            items: (Omit<Item, 'inventory'> & {
                inventory: Pick<Inventory, 'uri'>
            })[]
        }
    }
}

export interface TreeItemGet {
    Params: TreeGetBaseParams
}
