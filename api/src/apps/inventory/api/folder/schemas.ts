export { default as schemas } from './schemas.json'
import { Folder, FolderCreateFields } from '../../models/Folder'

export interface FolderCreate {
    Body: {
        folder: FolderCreateFields
    }
    Reply: {
        200: {
            folder: Folder
        }
    }
}
