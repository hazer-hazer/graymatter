import { Item } from '#inventory/models/Item'
import { ItemVariant } from '#inventory/models/ItemVariant'

export { default as schemas } from './schemas.json'

export interface ItemCreate {
    Body: Pick<Item, 'name' | 'description' | 'inventoryId' | 'folderId' | 'amountUnitId'> & {
        variants?: Pick<ItemVariant, 'name' | 'description' | 'reasonablePrice'>[]
    }
    Reply: {
        200: {
            item: Item
        }
    }
}

export interface ItemUpdate {
    Params: {
        itemId: bigint
    }
    Body: {
        item: Partial<Pick<Item, 'name' | 'description' | 'uri'>>
    }
    Reply: {
        200: {
            item: Item
        }
    }
}

export interface ItemSearch {
    Params: void
}

export interface ItemGetById {
    Params: {
        itemId: bigint
    }
    Reply: {
        200: {
            item: Item
        }
    }
}
