export { default as schemas } from './schemas.json'
import { Currency } from '@/models/Currency'

export interface CurrencyGet {
    Reply: {
        200: {
            currencies: Currency[]
        }
    }
}
