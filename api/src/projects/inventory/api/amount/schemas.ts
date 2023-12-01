export { default as schemas } from './schemas.json'
import { AmountUnit } from '#inventory/models/AmountUnit'

export interface AmountUnitCreate {
    Body: Omit<AmountUnit, 'id'>
    Reply: {
        200: {
            unit: AmountUnit
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
            unit: AmountUnit
        }
    }
}

export interface ItemAmountGet {
    Params: {
        itemId: string
    }
    Reply: {
        200: {
            amount: {
                unit: AmountUnit
                value: bigint
            }
        }
    }
}
