import { User } from '@/models/User'
import { UBigInt } from '@/models/common'

export type AttrType = 'String' | 'Enum'
export type AttrValue = string

export interface Attribute {
    id: UBigInt
    name: string
    description: string | null
    type: AttrType

    allowedValues: string[]

    userId: User['id']
}

export type AttributeCreateFields =
    Required<Pick<Attribute, 'name' | 'type'>>
    & Partial<Pick<Attribute, 'description'>>
    & ({
        type: 'String'
    } | {
        type: 'Enum'
    } & Required<Pick<Attribute, 'allowedValues'>>)

export type AttributeUpdateFields =
    Partial<Pick<Attribute, 'name' | 'type' | 'description' | 'allowedValues'>>
