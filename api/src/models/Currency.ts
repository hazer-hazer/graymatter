export interface Currency {
    id: number
    name: string
    /**
     * @pattern [A-Z]{3}
     */
    code: string
    symbol: string
    /**
     * @type integer
     */
    decimals: number
}

export type RealPrice = number
export type WithPrice<T = unknown> = T & { price: bigint | null }
export type WithCurrency<T = unknown> = T & { currency: Currency | null }
export type WithRealPrice<T = unknown> = T & { realPrice: RealPrice | null }
export type WithDisplayPrice<T = unknown> = T & { displayPrice: string | null }

// FIXME: Does not take into account bigint to number formatting
export const toDisplayValue = (value: bigint, { decimals, code }: Currency, locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        minimumIntegerDigits: 1,
        notation: 'compact',
    }).format(Number(value) / 10 ** decimals)
}

// FIXME: Not accurate, string might be used
export const toRealValue = (value: bigint, currency: Currency): number => {
    const { decimals } = currency

    return Number(value) / 10 ** decimals
}

// FIXME: Value should be string
export const fromRealValue = (value: number, currency: Currency): bigint => {
    const { decimals } = currency

    return BigInt(value * 10 ** decimals)
}

export function extendWithRealPrice<
    T extends WithPrice & { currency: Currency },
>(
    entity: T,
    addDisplay = true,
): WithRealPrice<T> {
    const realPrice = entity.price ? toRealValue(entity.price, entity.currency) : null
    const displayPrice = addDisplay && entity.price ? toDisplayValue(entity.price, entity.currency) : null

    return {
        ...entity,
        realPrice,
        displayPrice,
    }
}
