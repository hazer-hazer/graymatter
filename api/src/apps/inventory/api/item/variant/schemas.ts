export { default as schemas } from './schemas.json'
import { AttrValue } from '@/apps/inventory/models/Attribute'
import { Item, ItemAttr } from '@/apps/inventory/models/Item'
import { ItemVariant, ItemVariantAttr, ItemVariantCreateFields, ItemVariantUpdateFields } from '@/apps/inventory/models/ItemVariant'
import { RealPrice } from '@/models/Currency'
import { UBigInt } from '@/models/common'

export interface ItemVariantQuickAdd {
    Params: {
        itemId: UBigInt
    }
    Body: {
        names: ItemVariant['name'][]
        realPriceEach?: RealPrice | null
        amountValueEach?: number | null
    }
    Reply: {
        200: {
            itemVariants: ItemVariant[]
        }
    }
}

export interface ItemVariantCreate {
    Params: {
        itemId: UBigInt
    }
    Body: {
        itemVariant: ItemVariantCreateFields
    }
    Reply: {
        200: {
            itemVariant: ItemVariant
        }
    }
}

export interface ItemVariantUpdate {
    Params: {
        itemVariantId: UBigInt
    }
    Body: {
        itemVariant: ItemVariantUpdateFields
    }
    Reply: {
        200: {
            itemVariant: ItemVariant
        }
    }
}

export interface ItemVariantDeleteBatch {
    Body: {
        itemVariantIds: ItemVariant['id'][]
    }
    Reply: {
        200: void
    }
}

export interface ItemVariantAttrUpsert {
    Params: {
        itemVariantId: ItemVariant['id']
        itemAttrId: ItemAttr['id']
    }
    Body: {
        value: AttrValue
    }
    Reply: {
        200: {
            itemVariantAttr: ItemVariantAttr
        }
    }
}

export interface ItemVariantSearch {
    Params: {
        itemId: Item['id']
    }
    Querystring: {
        q: string
        limit?: number
    }
    Reply: {
        200: {
            itemVariants: ItemVariant[]
        }
    }
}
