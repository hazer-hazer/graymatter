import { Prisma } from '@prisma/client'
import currencies from './data/currencies.json'
import { Currency } from '@/models/Currency'

export default async function(tx: Prisma.TransactionClient) {
    await Promise.all([Object.entries(currencies).map(async ([code, {
        ISOnum: id,
        name,
        symbol,
        decimals,
    }]): Promise<Currency | null> => {
        if (!id) {
            return null
        }

        const data = {
            name,
            symbol,
            code,
            decimals,
        }

        return tx.currency.upsert({
            where: { id },
            create: { ...data, id },
            update: data,
        })
    })])
}
