export { default as schemas } from './schemas.json'
import { ItemVariant, ItemVariantCreateFields, ItemVariantUpdateFields } from '@/apps/inventory/models/ItemVariant'
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
            variants: ItemVariant[]
        }
    }
}

export interface ItemVariantCreate {
    Params: {
        itemId: UBigInt
    }
    Body: {
        variant: ItemVariantCreateFields
    }
    Reply: {
        200: {
            variant: ItemVariant
        }
    }
}

export interface ItemVariantUpdate {
    Params: {
        variantId: UBigInt
    }
    Body: {
        variant: ItemVariantUpdateFields
    }
    Reply: {
        200: {
            variant: ItemVariant
        }
    }
}

export interface ItemVariantDeleteBatch {
    Body: {
        variants: ItemVariant['id'][]
    }
    Reply: {
        200: void
    }
}
