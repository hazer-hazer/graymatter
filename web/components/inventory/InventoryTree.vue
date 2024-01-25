<template>
    <q-tree
        ref="inventoryTree"
        v-model:expanded="expanded"
        v-model:selected="selected"
        :nodes="(nodes as QTreeNode[])"
        node-key="nodeId"
        :filter="filter"
        color="grey-8"
        text-color="grey-8"
        selected-color="primary"
        no-nodes-label="kek"
        no-results-label="No items or folders found"
        :accordion="false"
    >
        <!-- <template #header-item="prop"> -->
        <!-- <div class="row items-center">
                    <q-icon :name="prop.node.icon" />
                    {{ prop.node.label }}
                </div> -->
        <!-- <q-icon :name="prop.node.icon || 'star'" color="grey-8" class="q-mr-sm" />
                <div :class="prop.node.current ? 'text-primary' : ''">
                    {{ prop.node.label }}
                </div>
                <q-btn
                    v-if="prop.node.url"
                    flat
                    dense
                    label="go to"
                    class="q-ma-auto on-right text-caption"
                    @click="navigateTo(prop.node.url)"
                /> -->
        <!-- </template> -->

        <template #body-folder>
            <div class="inventory-tree-actions row items-center q-gutter-sm">
                <div class="row">
                    <q-btn
                        color="primary"
                        dense
                        flat
                        class="col-auto inventory-tree-action-btn"
                        icon="o_create_new_folder"
                    />
                    <q-btn
                        color="primary"
                        dense
                        flat
                        class="col-auto"
                        icon="o_note_add"
                    />

                    <!-- <q-separator spaced inset vertical />
                    <q-btn
                        dense
                        :icon="expanded.length > alwaysExpanded.length ? 'unfold_less' : 'unfold_more'"
                        flat
                        color="yellow"
                        class="col-auto inventory-tree-action-btn"
                        @click="toggleExpandAll()"
                    /> -->
                </div>
                <q-separator class="col" style="position: relative; top: 5px; margin: auto 10px;" />
            </div>
        </template>
    </q-tree>
</template>

<script lang="ts" setup>
import type { QTree, QTreeNode } from 'quasar'
import type { FolderNode, InventoryNode, TreeNode } from '~/models/inventory/Tree'

const props = defineProps<{
    filter?: string
    tree: FolderNode | InventoryNode
}>()

const filter = toRef(props, 'filter')

type NavQTreeNode = QTreeNode<{
    nodeId: string
    url?: string
    current?: boolean
}>

const getNodeId = (tree: Pick<TreeNode, 'kind' | 'id'>) => `${tree.kind}_${tree.id}`

const convertTreeToQ = (tree: TreeNode): NavQTreeNode => {
    const route = useRoute()
    // const handler = (node: NavQTreeNode) => navigateTo(node.url)
    const nodeId = getNodeId(tree)
    const base = {
        nodeId,
        header: tree.kind,
        body: tree.kind,
        label: tree.name,
    } satisfies NavQTreeNode
    if (tree.kind === 'item') {
        return {
            ...base,
            // handler,
            url: `/inventory/item/${tree.id}`,
            current: route.fullPath === `/inventory/item/${tree.id}`,
            icon: 'description',
            handler: self => self.url && navigateTo(self.url),
        }
    } else if (tree.kind === 'folder') {
        return {
            ...base,
            icon: 'folder',
            url: `/inventory/folder/${tree.id}`,
            current: route.fullPath === `/inventory/folder/${tree.id}`,
            children: tree.children.map(convertTreeToQ),
            selectable: false,
        }
    } else if (tree.kind === 'inventory') {
        // Inventory is never used btw
        return {
            ...base,
            icon: 'inventory_2',
            url: `/inventory/${tree.uri}`,
            children: tree.children.map(convertTreeToQ),
            selectable: false,
        }
    }
    throw new Error('Unhandled tree kind')
}

// Note: Selected only needed for quasar to add hoverable effect for items (without children)
const alwaysExpanded = [getNodeId(props.tree)]

const inventoryTree = ref<QTree>()
const selected = ref([])
const expanded = ref(alwaysExpanded)

// TODO: Expand sub tree
// const toggleExpandAll = () => {
//     if (expanded.value.length > alwaysExpanded.length) {
//         inventoryTree.value?.collapseAll()
//         console.log('collapse all')
//     } else {
//         inventoryTree.value?.expandAll()
//         console.log('expand all')
//     }
//     expanded.value.push(...alwaysExpanded)
// }

const nodes = computed<NavQTreeNode[]>(() => {
    // const children = props.tree.children.map(convertTreeToQ)
    // if (props.tree.kind === 'inventory') {
    //     return [{
    //         icon: 'inventory_2',
    //         label: `${props.tree.name} tree`,
    //         nodeId: getNodeId(props.tree),
    //         children,
    //         expandable: false,
    //         selectable: false,
    //     }]
    // }
    // return children
    return [convertTreeToQ(props.tree)]
})
</script>

<style scoped lang="scss">
.inventory-tree-actions {
    margin-left: 10px;
    // &::before {
    //     content: "";
    //     display: inline;
    //     position: absolute;
    //     top: 50%;
    //     left: 13px;
    //     background-color: $grey-5;
    //     height: 1px;
    //     width: 25px;
    //     z-index: 100000;
    // }

    // &::before {
    //     content: "";
    //     position: absolute;
    //     top: calc(50% - 5px);
    //     left: 20px;
    //     background-color: $grey-6;
    //     height: 8px;
    //     width: 8px;
    //     border-radius: 50%;
    // }

    .inventory-tree-action-btn:not(:last-child) {
        margin-right: 30px;
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -25px;
            width: 20px;
            height: 1px;
            background-color: $grey-5;
        }
    }
}
</style>
