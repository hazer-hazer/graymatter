export { default as schemas } from './schemas.json'
import { Attribute } from '@/apps/inventory/models/Attribute'
import { Item, ItemAttr } from '@/apps/inventory/models/Item'

export interface ItemAttrCreate {
    Params: {
        itemId: Item['id']
        attrId: Attribute['id']
    }
    Body: {
        value: ItemAttr['value']
    }
    Reply: {
        200: {
            itemAttr: ItemAttr
        }
    }
}

export interface ItemAttrUpdate {
    Params: {
        itemId: Item['id']
        attrId: Attribute['id']
    }
    Body: {
        value: ItemAttr['value']
    }
    Reply: {
        200: {
            itemAttr: ItemAttr
        }
    }
}

export interface ItemAttrDelete {
    Params: {
        itemId: Item['id']
        attrId: Attribute['id']
    }
    Reply: {
        200: void
    }
}
