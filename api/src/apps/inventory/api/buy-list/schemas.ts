export { default as schemas } from './schemas.json'
import { BuyList, BuyListCreateFields, BuyListUpdateFields } from '../../models/BuyList'

export type BuyListClientRes =
    BuyList
    & Required<Pick<BuyList,
        | 'items'
    >>

export interface BuyListGetById {
    Params: {
        id: BuyList['id']
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}

export interface BuyListCreate {
    Body: {
        buyList: BuyListCreateFields
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}

export interface BuyListUpdate {
    Params: {
        id: BuyList['id']
    }
    Body: {
        buyList: BuyListUpdateFields
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}

export interface BuyListDelete {
    Params: {
        id: BuyList['id']
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}

export interface BuyListGetMy {
    Reply: {
        200: {
            buyLists: BuyListClientRes[]
        }
    }
}

export interface BuyListCheckAll {
    Params: {
        id: BuyList['id']
    }
    Body: {
        checked: boolean
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}

export interface BuyListClear {
    Params: {
        id: BuyList['id']
    }
    Reply: {
        200: {
            buyList: BuyListClientRes
        }
    }
}
