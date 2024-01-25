import { Folder } from '@/apps/inventory/models/Folder'
import { Inventory } from '@/apps/inventory/models/Inventory'
import { Item } from '@/apps/inventory/models/Item'
import { Currency, RealPrice, toRealValue } from '@/models/Currency'
import { Image } from '@/models/Image'
import { UBigInt } from '@/models/common'
import { PrismaClient } from '@prisma/client'
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
    avatar: Image | null
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
const db = new PrismaClient({
    log: ['query'],
})
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
                        avatar: null,
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
                    const { id, uri, images, items: childrenItems, children: childrenFolders, name } = await db.folder.findUniqueOrThrow({
                        where,
                        select: {
                            id: true,
                            uri: true,
                            name: true,
                            images: {
                                include: {
                                    image: true,
                                },
                            },
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
                        avatar: images[0]?.image ?? null,
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
                    const { images } = await db.item.findUniqueOrThrow({ where, include: { images: { include: { image: true } } } })

                    return {
                        ...path.target(),
                        kind: 'item',
                        path,
                        avatar: images[0]?.image ?? null,
                    }
                },
                async fallbackCurrency(where: DB.ItemWhereUniqueInput): Promise<Currency> {
                    const { currency, inventoryId } = await db.item.findUniqueOrThrow({ where, select: { currency: true, inventoryId: true } })
    
                    if (currency) {
                        return currency
                    }
    
                    return db.inventory.fallbackCurrency({ id: inventoryId })
                },
            },
        },
    })
    .$extends({
        model: {
            inventory: {
                async fallbackCurrency(where: DB.InventoryWhereUniqueInput): Promise<Currency> {
                    const { currency: inventoryCurrency, userId } = await db.inventory.findUniqueOrThrow({
                        where,
                        select: { currency: true, userId: true },
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
    // Price //
    .$extends({
        model: {
            item: {
                /// Returns null only in case when `item.price`, `item.amountValue` and all variants `amountValue` is null
                async totalPrice(where: DB.ItemWhereUniqueInput): Promise<RealPrice | null> {
                    const item = await db.item.findUniqueOrThrow({
                        where,
                        include: {
                            currency: true,
                            variants: {
                                select: {
                                    price: true,
                                    amountValue: true,
                                },
                            },
                        },
                    })

                    item.currency ??= await db.item.fallbackCurrency(where)

                    const itemRealPrice = item.price ? toRealValue(item.price, item.currency) : null

                    if (item.variants?.length) {
                        // TODO: Maybe if some variant's price is null then total price is null too?
                        return item.variants.reduce((total: RealPrice | null, { price, amountValue }) => {
                            const useRealPrice = price ? toRealValue(price, item.currency) : itemRealPrice
                            if (typeof useRealPrice !== 'number') {
                                return total
                            }

                            return (total ?? 0.0) + useRealPrice * amountValue
                        }, null)
                    } else if (itemRealPrice) {
                        return itemRealPrice * (item.amountValue ?? 0.0)
                    }

                    return null
                },
            },
            folder: {
                async totalPrice(where: DB.FolderWhereUniqueInput): Promise<RealPrice | null> {
                    const folder = await db.folder.findUniqueOrThrow({
                        where,
                        select: {
                            items: true,
                        },
                    })

                    return folder.items.reduce(async (sum_, item): Promise<RealPrice | null> => {
                        const sum = await sum_

                        const itemTotalPrice = await db.item.totalPrice({ id: item.id })
                        if (typeof itemTotalPrice !== 'number') {
                            return sum
                        }

                        return (sum ?? 0.0) + itemTotalPrice
                    }, Promise.resolve<RealPrice | null>(null))
                },
            },
        },
    })
    .$extends({
        model: {
            inventory: {
                async totalPrice(where: Pick<Inventory, 'id'>): Promise<RealPrice | null> {
                    return db.folder.totalPrice({
                        inventoryId_kind: {
                            inventoryId: where.id,
                            kind: 'Root',
                        },
                    })
                },
            },
        },
    })
    // .$extends({
    //     model: {
    //         buyList: {
    //             async autocheck(id: BuyList['id']) {
    //                 await db.$queryRaw`
    //                     UPDATE
    //                         public.buy_list_items AS bli
    //                     SET
    //                         checked = TRUE
    //                     FROM
    //                         public.buy_lists AS bl
    //                         INNER JOIN public.items AS i ON i.id = bli.item_id
    //                         LEFT JOIN public.item_variants AS iv ON iv.id = bli.item_variant_id
    //                     WHERE
    //                         NOT bli.checked
    //                         AND bl.id = bli.buy_list_id
    //                         AND i.id = bli.item_id
    //                         AND (
    //                             bli.item_variant_id IS NULL AND i.amount_value >= bli.amount_value
    //                             OR bli.item_variant_id IS NOT NULL AND iv.amount_value >= bli.amount_value
    //                         )
    //                         AND bli.buy_list_id = ${id}
    //                         AND bl.watch;`
    //             },
    //         },
    //     },
    // })

export default db

export type { Prisma as DB } from '@prisma/client'
export * as Entities from '@prisma/client'
