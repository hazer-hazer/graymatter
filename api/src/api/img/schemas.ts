export { default as schemas } from './schemas.json'
import { Image } from '@/models/Image'

export interface ImageUpload {
    consumes: ['multipart/form-data']
    // Body: {
    //     images: unknown[]
    // }
    Reply: {
        200: {
            images: Image[]
        }
    }
}
