import type { Currency } from '~/models/Currency'
import type { AmountUnit } from '~/models/inventory/AmountUnit'

export const nameToUri = (name: string) => {
    return name.replaceAll(/[\W]/g, '-')
}

export const formatNumberWithPrefix = (n: bigint, _prefixes: AmountUnit['powerPrefixes']): string => {
    // todo
    return n.toString()
}

const DEFAULT_LOCALE = 'en-US'
const BASE_NUMBER_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 1,
    notation: 'compact',
}

export const priceFormatter = ({ code }: Currency, locale = DEFAULT_LOCALE): Intl.NumberFormat =>
    new Intl.NumberFormat(locale, {
        ...BASE_NUMBER_FORMAT_OPTIONS,
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: code,
    })

export const listFormatter = (locale = DEFAULT_LOCALE): Intl.ListFormat =>
    new Intl.ListFormat(locale, {
        style: 'long',
        type: 'disjunction',
    })
