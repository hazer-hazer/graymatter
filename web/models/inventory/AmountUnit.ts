export interface AmountUnitPowerPrefix {
    power: number
    prefix: string
    name: string | null
    amountUnitId: number
    amountUnit?: AmountUnit
}

export interface AmountUnit {
    id: number
    name: string
    symbol: string

    userId: string | null

    powerPrefixes: AmountUnitPowerPrefix[]

    default: boolean
}
