import { Tag } from '@/apps/inventory/models/Tag'

export { default as schemas } from './schemas.json'

export interface TagCreate {
    Body: Pick<Tag, 'name' | 'description' | 'forms'>
    response: {
        200: Tag
    }
}

export interface TagSearch {
    Params: void
}

export interface TagGetById {
    Params: {
        id: string
    }
    response: {
        200: Tag
    }
}
