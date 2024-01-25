export const ATTR_TYPES: AttrType[] = ['String', 'Enum']
export const DEFAULT_ATTR_TYPE: AttrType = 'String'

export const ATTR_TYPE_ICONS: Record<AttrType, string> = {
    Enum: 'interests',
    String: 'text_fields',
}

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
