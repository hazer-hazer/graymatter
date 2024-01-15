import type { Currency } from '../Currency'
import type { Image } from '../Image'
import type { Folder } from './Folder'
import type { Tree, TreePath } from './Tree'

export interface Inventory {
    id: number
    uri: string
    userId: string
    name: string
    description?: string

    currency?: Currency

    avatar?: Image | null

    rootFolderId?: Folder['id']
    stats?: {
        itemsCount: number
        variantsCount: number
        foldersCount: number
        totalPrice: number | null
        itemsInTrashFolderCount: number
    }

    tree?: Tree & {kind: 'inventory'}
    path?: TreePath
}
