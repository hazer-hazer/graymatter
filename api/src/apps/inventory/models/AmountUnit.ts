import { UBigInt } from '@/models/common'

export interface AmountUnitPowerPrefix {
    power: number
    prefix: string
    name: string | null
    amountUnitId: number
    amountUnit?: AmountUnit
}

export type AmountUnitPowerPrefixCreateFields =
    Required<Pick<AmountUnitPowerPrefix, 
        | 'power'
        | 'prefix'
    >>
    & Partial<Pick<AmountUnitPowerPrefix, 
        | 'name'
    >>

export interface AmountUnit {
    id: number
    name: string
    symbol: string

    userId: UBigInt | null

    powerPrefixes?: AmountUnitPowerPrefix[]
}

export type AmountUnitCreateFields =
    Required<Pick<AmountUnit, 
        | 'name'
        | 'symbol'
    >>
    & {
        powerPrefixes?: AmountUnitPowerPrefixCreateFields[]
    }
