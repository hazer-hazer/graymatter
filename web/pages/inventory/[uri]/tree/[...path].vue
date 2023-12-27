<template>
    <DefaultPage>
        <div class="row q-pb-md">
            <InventoryCreateEntry />
        </div>
        <div v-if="data" class="row q-gutter-sm">
            <InventoryFolderCard v-for="folder in data.folders" :key="folder.id" class="card col" :folder="folder" />
            <InventoryItemCard
                v-for="item in data.items"
                :key="item.id"
                class="card col"
                flat
                bordered
                :item="item"
            />
        </div>
        <div v-else-if="pending">
            <q-spinner-gears
                color="primary"
                size="3rem"
                :thickness="5"
            />
        </div>
        <div v-else-if="error">
            <span class="text-h2">{{ error.message }}</span>
        </div>
    </DefaultPage>
</template>

<script setup lang="ts">
import type { Folder } from '~/models/inventory/Folder'
import type { Inventory } from '~/models/inventory/Inventory'
import type { Item } from '~/models/inventory/Item'
import { TreePath } from '~/models/inventory/Tree'

definePageMeta({
    validate: (route) => {
        if (route.name === 'inventory-uri-tree-path') {
            return /^[/-a-zA-z]*$/.test(route.params.path.join('/'))
        }
        return true
    },
    middleware: ['auth'],
})

const { $apiUseFetch } = useNuxtApp()

const route = useRoute('inventory-uri-tree-path')

const path = computed(() => route.params.path.join('/'))

const { data, pending, error } = await $apiUseFetch<{
    inventory: Inventory
    targetFolderId: Folder['id']
    targetFolderPath: TreePath
    folders: any[],
    items: Item[]
}>(() => `inventory/${route.params.uri}/tree/${path.value}`)

if (data.value?.targetFolderPath) {
    inventoryLocation().value = data.value?.targetFolderPath.segments
}

const title = computed(() => {
    if (path.value.length > 0) {
        return path
    }
    return `${data.value?.inventory.name}`
})

useHead({
    title: title.value,
})

</script>

<style lang="scss" scoped>
.card {
    min-width: 250px;
    min-height: 250px;
}
</style>
