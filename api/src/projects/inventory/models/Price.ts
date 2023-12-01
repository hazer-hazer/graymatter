/**
 * Client-friendly representation of price
 */

export interface Price {
    currency: {
        symbol: string
    }
    value: number
}
