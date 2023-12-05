import { Folder } from '@/apps/inventory/models/Folder'
import { Item } from '@/apps/inventory/models/Item'
import { TreePath } from '@/modules/prisma'
import { Inventory } from '@/apps/inventory/models/Inventory'
import { UriPath } from '@/models/common'

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
