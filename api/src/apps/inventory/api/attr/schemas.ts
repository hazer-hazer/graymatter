export { default as schemas } from './schemas.json'
import { Attribute, AttributeCreateFields, AttributeUpdateFields } from '../../models/Attribute'

export interface AttrCreate {
    Body: {
        attr: AttributeCreateFields
    }
    Reply: {
        200: {
            attr: Attribute
        }
    }
}

export interface AttrUpdate {
    Params: {
        attrId: Attribute['id']
    }
    Body: {
        attr: AttributeUpdateFields
    }
    Reply: {
        200: {
            attr: Attribute
        }
    }
}

export interface AttrGetById {
    Params: {
        attrId: Attribute['id']
    }
    Reply: {
        200: {
            attr: Attribute
        }
    }
}

export interface AttrDelete {
    Params: {
        attrId: Attribute['id']
    }
    Reply: {
        200: {
            attr: Attribute
        }
    }
}

export interface AttrGetMy {
    Reply: {
        200: {
            attrs: Attribute[]
        }
    }
}
