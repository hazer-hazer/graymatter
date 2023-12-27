import { Folder } from '@/apps/inventory/models/Folder'
import { Inventory } from '@/apps/inventory/models/Inventory'
import { Item } from '@/apps/inventory/models/Item'
import { Currency, RealPrice, WithPrice } from '@/models/Currency'
import { UBigInt } from '@/models/common'
import { AmountUnit, PrismaClient } from '@prisma/client'
import { Prisma as DB } from '@prisma/client'
import assert from 'assert'

// TODO: Move to inventory project

export type TreeNodeKind = 'inventory' | 'item' | 'folder'

export interface Tree {
    id: string | UBigInt | number
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

export class TreePath {
    constructor(
        public segments: [TreePathSegment, ...TreePathSegment[]],
    ) {}

    public target(): TreePathSegment {
        return this.segments.at(-1)!
    }

    public merged(other: TreePath): TreePath {
        return new TreePath([...this.segments, ...other.segments])
    }

    public extendWithTarget(target: TreePathSegment): TreePath {
        return new TreePath([...this.segments, target])
    }
}

// TODO: Add names to all extensions
const db = new PrismaClient()
// .$extends({
//     result: {
//         inventory: {
//             // Path of inventory can just be computed without additional query
//             path: {
//                 needs: {
//                     id: true,
//                     uri: true,
//                     name: true,
//                 },
//                 compute({ id, uri, name }): TreePath {
//                     return new TreePath([{
//                         kind: 'inventory',
//                         uri,
//                         name,
//                         id,
//                     }])
//                 },
//             },
//         },
//     },
// })
// .$extends({
//     model: {
//         user: {
//             async withPassword() {

    //             }
    //         }
    //     },
    //     result: {
    //         user: {
    //             password: {
    //                 needs: {
    //                     password: true,
    //                 },
    //                 compute() {
    //                     return null
    //                 },
    //             },
    //         },
    //     },
    // })
    .$extends({
        model: {
            inventory: {
                async path(where: DB.InventoryWhereUniqueInput): Promise<TreePath> {
                    const inventory = await db.inventory.findUniqueOrThrow({
                        where,
                    })
                    const rootFolder = await db.folder.findUniqueOrThrow({
                        where: { inventoryId_kind: { inventoryId: inventory.id, kind: 'Root' } },
                    })

                    return new TreePath([{
                        kind: 'inventory',
                        name: inventory.name,
                        uri: inventory.uri,
                        id: inventory.id,
                        rootFolderId: rootFolder.id,
                    }])
                },
            },
        },
    })
    .$extends({
        model: {
            folder: {
                async path(where: DB.FolderWhereUniqueInput): Promise<TreePath> {
                    const { id, kind, parentId, name, uri, inventoryId } = await db.folder.findUniqueOrThrow({
                        where,
                        select: {
                            id: true,
                            name: true,
                            parentId: true,
                            uri: true,
                            kind: true,
                            inventoryId: true,
                        },
                    })

                    // The root directory is ignored in path
                    if (kind === 'Root') {
                        return db.inventory.path({ id: inventoryId })
                    }

                    assert(parentId)

                    const selfSegment: TreePathSegment = {
                        kind: 'folder',
                        id,
                        uri,
                        name,
                    }

                    const parentPath = await db.folder.path({ id: parentId })

                    return parentPath.extendWithTarget(selfSegment)
                },
            },
        },
    })
    .$extends({
        model: {
            item: {
                async path(where: DB.ItemWhereUniqueInput): Promise<TreePath> {
                    const { id, name, uri, folderId } = await db.item.findUniqueOrThrow({
                        where,
                        select: {
                            id: true,
                            name: true,
                            uri: true,
                            folderId: true,
                        },
                    })

                    const folderPath = await db.folder.path({ id: folderId })

                    return folderPath.extendWithTarget({
                        kind: 'item',
                        uri,
                        id,
                        name,
                    })
                },
            },
        },
    })
    .$extends({
        model: {
            inventory: {
                async tree(where: DB.InventoryWhereUniqueInput): Promise<FolderTree> {
                    const { name, id, uri } = await db.inventory.findUniqueOrThrow({
                        select: {
                            id: true,
                            uri: true,
                            name: true,
                        },
                        where,
                    })

                    const path = await db.inventory.path(where)

                    const rootFolder = await db.folder.tree({
                        inventoryId_kind: { inventoryId: id, kind: 'Root' },
                    })

                    return {
                        id,
                        uri,
                        kind: 'inventory',
                        name,
                        path,
                        children: rootFolder.children,
                    }
                },
            },
        },
    })
    .$extends({
        model: {
            folder: {
                async tree(where: DB.FolderWhereUniqueInput): Promise<FolderTree> {
                    const path = await db.folder.path(where)
                    const { id, uri, items: childrenItems, children: childrenFolders, name } = await db.folder.findUniqueOrThrow({
                        where,
                        select: {
                            id: true,
                            uri: true,
                            name: true,
                            items: {
                                select: {
                                    id: true,
                                },
                            },
                            children: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    })

                    const children = await Promise.all([
                        ...childrenFolders.map(where => db.folder.tree(where)),
                        ...childrenItems.map(where => db.item.tree(where)),
                    ])

                    return {
                        id,
                        uri,
                        kind: 'folder',
                        path,
                        name,
                        children,
                    }
                },
            },
        },
    })
    .$extends({
        model: {
            item: {
                async tree(where: DB.ItemWhereUniqueInput): Promise<Tree> {
                    const path = await db.item.path(where)

                    return {
                        ...path.target(),
                        kind: 'item',
                        path,
                    }
                },
                async fallbackCurrency(where: DB.ItemWhereUniqueInput): Promise<Currency> {
                    const { currency, inventoryId } = await db.item.findUniqueOrThrow({ where, select: { currency: true, inventoryId: true } })
    
                    if (currency) {
                        return currency
                    }
    
                    const { currency: inventoryCurrency, userId } = await db.inventory.findUniqueOrThrow({
                        where: { id: inventoryId },
                        select: { userId: true, currency: true },
                    })
    
                    if (inventoryCurrency) {
                        return inventoryCurrency
                    }
    
                    const { currency: userCurrency } = await db.user.findUniqueOrThrow({
                        where: { id: userId },
                        select: { currency: true },
                    })
    
                    return userCurrency
                },
            },
        },
    })

export default db

export type { Prisma as DB } from '@prisma/client'
export * as Entities from '@prisma/client'
