export { default as schemas } from './schemas.json'
import { UBigInt } from '@/models/common'

export interface ItemImageCreate {
    Params: {
        itemId: UBigInt
        imageId: UBigInt
    }
    Reply: {
        200: {
            itemId: UBigInt
            imageId: UBigInt
        }
    }
}
