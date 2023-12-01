import type { Folder } from './Folder'
import type { Tree, TreePath } from './Tree'

export interface Inventory {
    id: number
    uri: string
    userId: string
    name: string
    description?: string

    rootFolderId?: Folder['id']
    stats?: {
        itemsCount: number
        variantsCount: number
        foldersCount: number
        priceValue: number
    }

    tree?: Tree & {kind: 'inventory'}
    path?: TreePath
}
