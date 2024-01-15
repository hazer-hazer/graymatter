export { default as schemas } from './schemas.json'
import { BuyList, BuyListItem, BuyListItemCreateFields, BuyListItemUpdateFields } from '@/apps/inventory/models/BuyList'

export interface BuyListItemGet {
    Params: {
        buyListId: BuyList['id']
    }
    Reply: {
        200: {
            buyListItems: BuyListItem[]
        }
    }
}

export interface BuyListItemCreate {
    Params: {
        buyListId: BuyList['id']
    }
    Body: {
        buyListItem: BuyListItemCreateFields
    }
    Reply: {
        200: {
            buyListItem: BuyListItem
        }
    }
}

export interface BuyListItemUpdate {
    Params: {
        buyListId: BuyList['id']
        buyListItemId: BuyListItem['id']
    }
    Body: {
        buyListItem: BuyListItemUpdateFields
    }
    Reply: {
        200: {
            buyListItem: BuyListItem
        }
    }
}

export interface BuyListItemDelete {
    Params: {
        buyListId: BuyList['id']
        buyListItemId: BuyListItem['id']
    }
    Reply: {
        200: {
            buyListItem: BuyListItem
        }
    }
}
