import { Item, ItemCreateFields, ItemUpdateFields } from '@/apps/inventory/models/Item'
import { ItemVariant } from '../../models/ItemVariant'

export { default as schemas } from './schemas.json'

export type ExtendedItemClientRes =
    Item
    & Required<Pick<Item,
        | 'amountUnit'
        | 'currency'
        | 'images'
        | 'attributes'
        | 'variants'
        | 'buyLists'
        | 'avatar'
        | 'path'
        | 'variantsAmountSum'
        | 'totalPrice'
        | 'realPrice'
    >>


export interface ItemCreate {
    Body: {
        item: ItemCreateFields
    }
    Reply: {
        200: {
            item: ExtendedItemClientRes
        }
    }
}

export interface ItemUpdate {
    Params: {
        itemId: Item['id']
    }
    Body: {
        item: ItemUpdateFields
    }
    Reply: {
        200: {
            item: ExtendedItemClientRes
        }
    }
}

export interface ItemGetById {
    Params: {
        itemId: Item['id']
    }
    Reply: {
        200: {
            item: ExtendedItemClientRes
        }
    }
}

export interface ItemMoveToTrash {
    Params: {
        itemId: Item['id']
    }
    Reply: {
        200: {
            item: Item
        }
    }
}

export interface ItemSearch {
    Querystring: {
        q: string
        limit?: number
        excludeItems?: Item['id'][]
        excludeItemVariants?: ItemVariant['id'][]
    }
    Reply: {
        200: {
            items: Item[]
        }
    }
}
