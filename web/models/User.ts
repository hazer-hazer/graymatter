import type { App } from './App'
import type { Image } from './Image'

export interface User {
    id: bigint
    email: string
    uri: string
    createdAt: Date
    avatar?: Image | null

    apps?: App[]
}
