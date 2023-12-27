import type { Folder } from './Folder'
import type { Inventory } from './Inventory'
import type { Item } from './Item'

export type TreeNodeKind = 'inventory' | 'item' | 'folder'

export interface Tree {
    id: string | bigint | number
    uri: string
    kind: TreeNodeKind
    name: string
    path: TreePath
}

export interface FolderTree extends Tree {
    kind: 'inventory' | 'folder'
    children: Tree[]
}

interface TreePathInventorySegment {
    kind: Extract<TreeNodeKind, 'inventory'>
    id: Inventory['id']
    uri: string
    name: string
    rootFolderId: Folder['id']
}

interface TreePathFolderSegment {
    kind: Extract<TreeNodeKind, 'folder'>
    id: Folder['id']
    uri: string
    name: string
}

interface TreePathItemSegment {
    kind: Extract<TreeNodeKind, 'item'>
    id: Item['id']
    uri: string
    name: string
}

export type TreePathSegment = TreePathInventorySegment | TreePathFolderSegment | TreePathItemSegment

export class InvalidPathError extends Error {
    constructor (path: TreePath) {
        super(`Invalid path '${path.toUri()}'`)
    }
}

export class TreePath {
    constructor (public segments: TreePathSegment[]) {}

    public target (): TreePathSegment {
        return this.segments.at(-1)!
    }

    public targetItemId (): Item['id'] | null {
        const target = this.target()
        if (target.kind === 'item') {
            return target.id
        }
        return null
    }

    public rootFolderId (): Folder['id'] | null {
        if (this.segments[0]?.kind === 'inventory') {
            return this.segments[0].rootFolderId
        }
        return null
    }

    public inventoryUri (): Inventory['uri'] | null {
        if (this.segments[0]?.kind === 'inventory') {
            return this.segments[0].uri
        }
        return null
    }

    public slice (from?: number, to?: number): TreePath {
        return new TreePath(this.segments.slice(from, to))
    }

    public targetFolderPath (): TreePath {
        const target = this.target()

        if (target.kind === 'item') {
            const preTarget = this.segments.at(-2)
            if (preTarget) {
                if (preTarget.kind === 'folder') {
                    return this.slice(0, -1)
                } else if (preTarget.kind === 'inventory') {
                    return this.slice(0, 1)
                }
            }
            throw new InvalidPathError(this)
        }

        if (target.kind === 'folder') {
            return this.slice(0, -1)
        }

        if (target.kind === 'inventory') {
            return this.slice(0, 1)
        }

        throw new InvalidPathError(this)
    }

    public targetFolderId (): Folder['id'] {
        const target = this.target()

        if (target.kind === 'item') {
            const preTarget = this.segments.at(-2)
            if (preTarget) {
                if (preTarget.kind === 'folder') {
                    return preTarget.id
                } else if (preTarget.kind === 'inventory') {
                    return preTarget.rootFolderId
                }
            }
            throw new InvalidPathError(this)
        }

        if (target.kind === 'folder') {
            return target.id
        }

        if (target.kind === 'inventory') {
            return target.rootFolderId
        }

        throw new InvalidPathError(this)
    }

    public inventoryId (): Inventory['id'] | null {
        if (this.segments[0]?.kind === 'inventory') {
            return this.segments[0].id
        }
        return null
    }

    public toUri (): string {
        return this.segments.map(seg => seg.uri).join('/')
    }

    public toUserPath (): string {
        return this.segments.map(seg => seg.name).join('/')
    }

    public toJSON (): Object {
        return { ...this }
    }
}
