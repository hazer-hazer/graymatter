import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'

export const inventoryLocation = () => useState<TreePathSegment[] | null>('inventoryLocation', () => null)

export const useInventoryLocation = (): TreePath => {
    const location = inventoryLocation().value
    if (!location) {
        throw new Error('inventoryLocation is expected to be set at this point')
    }
    return new TreePath(location)
}

export const showCreateItemModal = () => useState<boolean>('showCreateItemModal', () => false)
export const showCreateFolderModal = () => useState<boolean>('showCreateFolderModal', () => false)
export const showInventoryCreateModal = () => useState<boolean>('showInventoryCreateModal', () => false)
