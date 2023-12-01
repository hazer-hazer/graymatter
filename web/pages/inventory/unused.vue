<template>
    <q-page padding class="q-gutter-md row full-width" style="max-width: 1400px;">
        <div class="col-2 col-sm-2 order-first">
            <span class="text-h5">Inventory tree</span>
            <Tree :tree="tree" />
        </div>
        <div class="col row wrap q-gutter-md">
            <div class="row justify-start text-h6">
                <span class="col-auto">Folders: {{ foldersCount }}</span>
                <q-separator vertical spaced />
                <span class="col-auto">Items in this folder: {{ itemsInThisFolderCount }}</span>
            </div>
            <div class="row fit q-gutter-sm">
                <Item v-for="n in 100" :key="n" :item="genItem(n)" />
            </div>
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import Tree from '~/components/inventory/Tree.vue'
import Item from '~/components/inventory/item/Item.vue'

const randInt = (min: number, max: number) => Math.floor(Math.random() * max) + min

const genItem = (n: number) => ({
    id: n.toString(),
    realId: randInt(1, 10000000000).toString(),
    name: 'Resistor 1/4W',
    description: 'Somewhat common resistor component',
    images: [{
        id: '123',
        src: 'https://source.unsplash.com/random/200x200',
    }],
    amount: {
        unit: {
            id: 123,
            name: 'Pieces (quantity)',
            symbol: 'pcs',
            power_prefixes: {},
        },
        value: randInt(0, 1000),
    },

    variants: [],

    price: {
        currency: {
            symbol: '$',
        },
        value: 0.5,
    },
})

const tree = {
    nodes: [{
        label: 'Kek',
        children: [{
            label: 'Bottom kek',
        }],
    }],
}

const foldersCount = 12
const itemsInThisFolderCount = 19

</script>
