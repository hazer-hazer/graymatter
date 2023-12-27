export const ATTR_TYPES: AttrType[] = ['String', 'Enum']

export type AttrType = 'String' | 'Enum'

export interface Attribute {
    id: string
    name: string
    description: string | null
    type: AttrType

    allowedValues: string[]
}

export type AttrValue = string

export type AttrWithValue = Attribute & {
    value: AttrValue
}
