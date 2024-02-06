import { defineStore } from 'pinia'
import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'

interface InventoryState {
    pathSegments: TreePathSegment[] | null
}

export const useInventoryStore = defineStore('inventory', {
    state (): InventoryState {
        return {
            pathSegments: null,
        }
    },
    actions: {
        relocate (path: TreePathSegment[]) {
            this.pathSegments = path.length ? path : null
        },
    },
    getters: {
        path (): TreePath | null {
            if (this.pathSegments) {
                return new TreePath(this.pathSegments)
            }
            return null
        },
    },
})
