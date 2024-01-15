// import defu from 'defu'

// export interface NumFormatOptions {
//     round?: 'ceil' | 'floor' | 'trunc'
//     display?: 'short' | 'narrow' | 'long'
//     minIntDigits?: number
//     minFracDigits?: number
//     maxFracDigits?: number
//     powerPrefixes?: PowerPrefixMap,
//     inputPower?: number
// }

// type NumFormatOptionsRequired = NumFormatOptions & Required<Pick<NumFormatOptions, 'powerPrefixes'>>

// export type PowerPrefixMap = Record<number, {
//     prefix: string
//     symbol: string
// }>

// export class NumFormat {
//     static readonly DEFAULT_POWER_PREFIXES = {
//         24: { prefix: 'yotta', symbol: 'Y' },
//         21: { prefix: 'zetta', symbol: 'Z' },
//         18: { prefix: 'exa', symbol: 'E' },
//         15: { prefix: 'peta', symbol: 'P' },
//         12: { prefix: 'tera', symbol: 'T' },
//         9: { prefix: 'giga', symbol: 'G' },
//         6: { prefix: 'mega', symbol: 'M' },
//         3: { prefix: 'kilo', symbol: 'k' },
//         2: { prefix: 'hecto', symbol: 'h' },
//         0: { prefix: 'deca', symbol: 'da' },
//         [-1]: { prefix: 'deci', symbol: 'd' },
//         [-2]: { prefix: 'centi', symbol: 'c' },
//         [-3]: { prefix: 'milli', symbol: 'm' },
//         [-6]: { prefix: 'micro', symbol: 'mu' },
//         [-9]: { prefix: 'nano', symbol: 'n' },
//         [-12]: { prefix: 'pico', symbol: 'p' },
//         [-15]: { prefix: 'femto', symbol: 'f' },
//         [-18]: { prefix: 'atto', symbol: 'a' },
//         [-21]: { prefix: 'zepto', symbol: 'z' },
//         [-24]: { prefix: 'yotto', symbol: 'y' },
//     }

//     static readonly DEFAULT_OPTIONS: NumFormatOptionsRequired = {
//         display: 'narrow',
//         minIntDigits: 1,
//         minFracDigits: 0,
//         maxFracDigits: 2,
//         inputPower: 0,
//         powerPrefixes: this.DEFAULT_POWER_PREFIXES,
//     }

//     public readonly options: NumFormatOptionsRequired

//     constructor (options: NumFormatOptions) {
//         if (options.minFracDigits && options.maxFracDigits && options?.minFracDigits > options?.maxFracDigits) {
//             throw new RangeError('minFracDigits must be <= maxFracDigits')
//         }

//         this.options = {
//             ...NumFormat.DEFAULT_OPTIONS,
//             ...options,
//         }
//     }

//     format (num: number): string {
//         const powerPrefix = null
//         for (const [pow, prefix] of Object.entries(this.options.powerPrefixes)) {

//         }
//     }
// }
