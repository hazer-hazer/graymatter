import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'

// export const inventoryLocation = () => useState<{
//     // folder?: Pick<Folder, 'id'>
//     // inventory?: Pick<Inventory, 'id' | 'uri'>
//     path?: TreePath
// }>('inventoryLocation', () => ({}))

export const inventoryLocation = () => useState<TreePathSegment[] | null>('inventoryLocation', () => null)
export const useInventoryLocation = (): TreePath => {
    const location = inventoryLocation().value
    if (!location) {
        throw new Error('inventoryLocation is expected to be set at this point')
    }
    return new TreePath(location)
}

export const openCreateItemModal = () => useState<boolean>('openCreateItemModal', () => false)
export const openCreateFolderModal = () => useState<boolean>('openCreateFolderModal', () => false)
export const openImageUploaderModal = () => useState<boolean>('openImageUploaderModal', () => false)
