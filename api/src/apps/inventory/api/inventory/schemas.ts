import { Inventory } from '@/apps/inventory/models/Inventory'
import { Folder } from '../../models/Folder'
import { Item } from '../../models/Item'

export { default as schemas } from './schemas.json'

export interface InventoryGetByUri {
    Params: {
        inventoryUri: string
    }
    Reply: {
        200: {
            inventory: Inventory
        }
    }
}

export type SearchResult = {
    kind: 'item'
    item: Item
} | {
    kind: 'folder'
    folder: Folder
}

export interface InventorySearch {
    Params: {
        inventoryUri: string
    }
    Querystring: {
        q: string
        /**
         * @default 10
         */
        limit: number
    }
    Reply: {
        200: {
            inventory: Inventory
            results: SearchResult[]
        }
    }
}
