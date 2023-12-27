import { Item, ItemCreateFields, ItemUpdateFields } from '@/apps/inventory/models/Item'
import { UBigInt } from '@/models/common'

export { default as schemas } from './schemas.json'

export interface ItemCreate {
    Body: ItemCreateFields
    Reply: {
        200: {
            item: Item
        }
    }
}

export interface ItemUpdate {
    Params: {
        itemId: UBigInt
    }
    Body: {
        item: ItemUpdateFields
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
        itemId: UBigInt
    }
    Reply: {
        200: {
            item: Item
        }
    }
}

export interface ItemMoveToTrash {
    Params: {
        itemId: UBigInt
    }
    Reply: {
        200: {
            item: Item
        }
    }
}
