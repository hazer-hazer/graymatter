export { default as schemas } from './schemas.json'
import { AmountUnit, AmountUnitCreateFields } from '@/apps/inventory/models/AmountUnit'

export interface AmountUnitCreate {
    Body: {
        amountUnit: AmountUnitCreateFields
    }
    Reply: {
        200: {
            amountUnit: AmountUnit
        }
    }
}

export interface AmountUnitSearch {
    Reply: {
        200: {
            amountUnits: AmountUnit[]
        }
    }
}

export interface AmountUnitGetById {
    Params: {
        amountId: string
    }
    Reply: {
        200: {
            amountUnit: AmountUnit
        }
    }
}

export interface AmountUnitGetDefault {
    Reply: {
        200: {
            amountUnit: AmountUnit
        }
    }
}
