<template>
    <div class="col">
        <q-input v-if="search" ref="filterRef" v-model="filter" label="Filter items">
            <template #append>
                <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
            </template>
        </q-input>

        <q-tree
            :nodes="(nodes as QTreeNode[])"
            node-key="label"
            accordion
            :filter="filter"
        >
            <template #header-item="prop">
                <q-icon :name="prop.node.icon || 'star'" color="grey" class="q-mr-sm" />
                <div :class="prop.node.current ? 'text-primary' : ''">
                    {{ prop.node.label }}
                </div>
                <q-btn flat dense label="go to" class="q-ma-auto on-right text-caption" @click="navigateTo(prop.node.url)" />
            </template>
            <!-- <template #body-link="prop">
            </template> -->
        </q-tree>
    </div>
</template>

<script lang="ts" setup>
import type { QInput, QTreeNode } from 'quasar'
import type { Tree } from '~/models/inventory/Tree'
// const expanded = ref([])

const { tree } = withDefaults(defineProps<{
    search?: boolean
    splitLookup?: boolean
    tree: Tree & {kind: 'inventory' | 'folder'}
}>(), {
    splitLookup: false,
    search: false,
})

type NavQTreeNode = QTreeNode<{
    url: string
    current?: boolean
}>

const convertTreeToQ = (tree: Tree): NavQTreeNode => {
    const route = useRoute()
    // const handler = (node: NavQTreeNode) => navigateTo(node.url)
    if (tree.kind === 'item') {
        return {
            label: tree.name,
            // handler,
            url: `/inventory/item/${tree.id}`,
            current: route.fullPath === `/inventory/item/${tree.id}`,
            header: 'item',
            icon: 'description',
        }
    } else if (tree.kind === 'folder') {
        return {
            label: tree.name,
            icon: 'folder',
            url: `/inventory/folder/${tree.id}`,
            current: route.fullPath === `/inventory/folder/${tree.id}`,
            header: 'folder',
            children: tree.children.map(convertTreeToQ),
        }
    } else if (tree.kind === 'inventory') {
        // Inventory is never used btw
        return {
            label: tree.name,
            icon: 'inventory_2',
            url: `/inventory/${tree.uri}`,
            children: tree.children.map(convertTreeToQ),
        }
    }
    throw new Error('Unhandled tree kind')
}

const nodes = tree.children.map(convertTreeToQ)

const filter: Ref<string> = ref('')
const filterRef: Ref<QInput | null> = ref(null)
const resetFilter = () => {
    filter.value = ''
    filterRef.value?.focus()
}
</script>
