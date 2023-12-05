import { Prisma, PrismaClient } from '@prisma/client'
import crypt from '../modules/crypt'
import assert from 'assert'
import { DB } from '@/modules/prisma'
import { formatUri } from '@/utils/names-format'
import sourceMapSupport from 'source-map-support'

sourceMapSupport.install()

async function main(tx: Prisma.TransactionClient) {
    const inventoryApp = await tx.app.upsert({
        where: { uri: 'inventory' },
        create: {
            uri: 'inventory',
            name: 'Inventory',
        },
        update: {},
    })


    const testUser = await tx.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            uri: 'teat',
            password: crypt.password.crypt('superKEK'),
            apps: {
                create: {
                    appId: inventoryApp.id,
                },
            },
        },
    })

    const testImage = await tx.image.upsert({
        where: { id: 1 },
        create: {
            src: 'https://random.imagecdn.app/500/150',
        },
        update: {},
    })

    const quantityAmountUnit = await tx.amountUnit.upsert({
        where: { symbol: 'pcs' },
        update: {},
        create: {
            name: 'pcs',
            symbol: 'pcs',
            powerPrefixes: {
                createMany: {
                    data: [
                        { power: 24, name: 'yotta', prefix: 'Y' },
                        { power: 21, name: 'zetta', prefix: 'Z' },
                        { power: 18, name: 'exa', prefix: 'E' },
                        { power: 15, name: 'peta', prefix: 'P' },
                        { power: 12, name: 'tera', prefix: 'T' },
                        { power: 9, name: 'giga', prefix: 'G' },
                        { power: 6, name: 'mega', prefix: 'M' },
                        { power: 3, name: 'kilo', prefix: 'k' },
                        { power: 2, name: 'hecto', prefix: 'h' },
                        { power: -1, name: 'deci', prefix: 'd' },
                        { power: -2, name: 'centi', prefix: 'c' },
                        { power: -3, name: 'milli', prefix: 'm' },
                        { power: -6, name: 'micro', prefix: 'mu' },
                        { power: -9, name: 'nano', prefix: 'n' },
                        { power: -12, name: 'pico', prefix: 'p' },
                        { power: -15, name: 'femto', prefix: 'f' },
                        { power: -18, name: 'atto', prefix: 'a' },
                        { power: -21, name: 'zepto', prefix: 'z' },
                        { power: -24, name: 'yotto', prefix: 'y' },
                    ],
                },
            },
        },
    })

    const testInventory = await tx.inventory.upsert({
        where: { userId_uri: { userId: testUser.id, uri: 'my-inventory' } },
        update: {},
        create: {
            uri: 'my-inventory',
            name: 'My inventory',
            description: 'My test inventory',
            userId: testUser.id,
        },
        include: {
            folders: {
                select: {
                    id: true,
                },
            },
        },
    })

    const rootFolder = await tx.folder.upsert({
        where: { inventoryId_kind: { inventoryId: testInventory.id, kind: 'Root' } },
        create: {
            uri: '',
            kind: 'Root',
            name: 'Root',
            inventory: { connect: { id: testInventory.id } },
        },
        update: {},
    })

    // const superNestedFolderInput = new Array(10).fill(0).reduce((parent: Prisma.FolderCreateNestedOneWithoutChildrenInput, _, level): Prisma.FolderCreateNestedOneWithoutChildrenInput => ({
    //     create: {
    //         uri: new Array(level + 1).fill('super').join('-'),
    //         name: `${new Array(level + 1).fill('super').join('-')} nested folder`,
    //         inventory: {
    //             connect: { id: testInventory.id },
    //         },
    //         parent,
    //         images: {
    //             create: {
    //                 imageId: testImage.id,
    //             },
    //         },
    //     },
    // }), { connect: { id: rootFolder.id } })

    const superNestedFolderInput = new Array(10).fill(0).reduce((child: Prisma.FolderCreateNestedManyWithoutParentInput, _, level, { length }): Prisma.FolderCreateNestedManyWithoutParentInput => ({
        create: {
            uri: new Array(length - level).fill('super').join('-'),
            name: `${new Array(length - level).fill('super').join('-')} nested folder`,
            inventory: {
                connect: { id: testInventory.id },
            },
            images: {
                create: {
                    imageId: testImage.id,
                },
            },
            children: child,
        },
    }), {})

    assert(superNestedFolderInput.create && !Array.isArray(superNestedFolderInput.create))

    const superNestedFolder = await tx.folder.upsert({
        where: { parentId_uri: { parentId: rootFolder.id, uri: superNestedFolderInput.create.uri } },
        update: {},
        create: superNestedFolderInput.create,
    })

    const testNestedItem = await tx.item.upsert({
        where: { folderId_uri: { folderId: superNestedFolder.id, uri: 'super-nested-item' } },
        update: {},
        create: {
            uri: 'super-nested-item',
            name: 'Super nested test item',
            description: 'My super nested test item',
            amountUnitId: quantityAmountUnit.id,
            inventoryId: testInventory.id,

            folderId: superNestedFolder.id,
            userId: testUser.id,

            images: {
                create: {
                    imageId: testImage.id,
                },
            },
        },
    })

    const testRootItem = await tx.item.upsert({
        where: { folderId_uri: { folderId: rootFolder.id, uri: 'root-item' } },
        create: {
            uri: 'root-item',
            name: 'Root item',
            description: 'Just some item in the root of inventory',
            inventoryId: testInventory.id,
            folderId: rootFolder.id,
            userId: testUser.id,
            amountUnitId: quantityAmountUnit.id,
        },
        update: {},
    })

    // Kind real data
    // TODO: Values as names for variants, e.g. shoe size
    const resistorValues = [
        '1.5K','100K','100R','10K','10M','120K','12K','150K','15K','1K','1M','1R','2.2K','2.2M','2.2R','2.7K','200K','200R','20K','220K','220R','22K','22R','270K','270R','27K','2K','3.3K','3.3R','300K','330K','330R','33K','33R','4.7K','4.7R','470K','470R','47K','47R','5.6K','560K','560R','56K','6.8K','680K','680R','68K','8.2K','820K','820R','82K',
    ]

    const resistorItem = await tx.item.upsert({
        where: { folderId_uri: { folderId: rootFolder.id, uri: 'resistor-1-4' } },
        create: {
            uri: 'resistor-1-4',
            name: 'Resistor 1/4W',
            description: 'Resistor 1/4W',
            inventoryId: testInventory.id,
            folderId: rootFolder.id,
            userId: testUser.id,
            amountUnitId: quantityAmountUnit.id,
            variants: {
                createMany: {
                    data: resistorValues.map((value: string): DB.ItemVariantCreateManyItemInput => ({
                        uri: formatUri(value),
                        name: value,
                        description: `Resistance of ${value}`,
                    })),
                },
            },
        },
        update: {},
    })
}

const prisma = new PrismaClient()
void prisma.$transaction(async (tx) => {
    await main(tx)
})
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
