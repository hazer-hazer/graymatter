import {  FastifyPluginAsync } from 'fastify'
import { TreeFolderGet, TreeGetBaseParams, schemas } from './schemas'
import db, { DB } from '@/modules/prisma'
import assert from 'assert'

import { Folder } from '@prisma/client'
import { Inventory } from '../../models/Inventory'
import { Api } from '@/App'

/// `/path/to/some/folder/tree-name/` reduced from left to right converted to tree search
const getTargetFolder = async (params: TreeGetBaseParams, skipLast: boolean): Promise<{
    targetFolderId: Folder['id']
    target: string | null
    inventoryId: Inventory['id']
    // path: TreePath
}> => {
    const { ['*']: path, inventory: inventoryUri } = params

    const { id: rootFolderId, inventoryId } = await db.folder.findFirstOrThrow({
        where: { kind: 'Root', inventory: { uri: inventoryUri } },
        select: {
            id: true,
            inventoryId: true,
        },
    })

    if (!path.length) {
        return {
            targetFolderId: rootFolderId,
            target: null,
            inventoryId,
        }
    }

    const pathSegments = path.split('/')
    const pathFolders = skipLast ? pathSegments.slice(0, -1) : pathSegments

    const where = pathFolders.reduce((treeSearch: DB.FolderWhereInput, segmentFolder): typeof treeSearch => ({
        uri: segmentFolder,
        ...treeSearch && { parent: treeSearch },
        inventory: { uri: inventoryUri },
    }), {
        id: rootFolderId,
    })

    assert(where)

    const { id: targetFolderId } = await db.folder.findFirstOrThrow({
        select: {
            id: true,
        },
        where,
    })

    const target = pathFolders.at(-1) ?? null

    return {
        targetFolderId,
        target,
        inventoryId,
    }
}

const tree: FastifyPluginAsync = async function (fastify) {
    fastify.get<TreeFolderGet>('/:inventory/tree/*', { schema: schemas.TreeFolderGet }, async (req, res) => {
        const { targetFolderId, inventoryId } = await getTargetFolder(req.params, false)

        const inventory = await db.inventory.findUniqueOrThrow({
            where: { id: inventoryId },
            select: {
                id: true,
                uri: true,
                userId: true,
                name: true,
                description: true,
                currencyId: true,
            },
        })

        const folders = await db.folder.findMany({
            select: {
                id: true,
                uri: true,
                inventoryId: true,
                name: true,
                description: true,
                parentId: true,
                images: {
                    select: {
                        image: true,
                    },
                },
            },
            where: {
                parentId: targetFolderId,
            },
        })

        const items = await db.item.findMany({
            select: {
                id: true,
                uri: true,
                name: true,
                description: true,
                inventoryId: true,
                folderId: true,
                createdAt: true,
                updatedAt: true,
                amountValue: true,
                buyLink: true,
                price: true,
                currencyId: true,
                images: {
                    select: {
                        image: true,
                    },
                },
                inventory: {
                    select: {
                        uri: true,
                    },
                },
                amountUnitId: true,
                amountUnit: {
                    select: {
                        id: true,
                        name: true,
                        symbol: true,
                        userId: true,
                        powerPrefixes: {
                            select: {
                                power: true,
                                prefix: true,
                                name: true,
                                amountUnitId: true,
                            },
                            orderBy: {
                                power: 'asc',
                            },
                        },
                    },
                },
            },
            where: {
                folderId: targetFolderId,
            },
        })

        const targetFolderPath = await db.folder.path({ id: targetFolderId })

        return res.code(200).send({
            inventory,
            targetFolderId,
            targetFolderPath,
            folders,
            items,
        })
    })
}


export default new Api({
    fastifyPlugin: tree,
})
