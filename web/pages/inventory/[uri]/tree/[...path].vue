<template>
    <q-page padding class="justify-center full-width" style="max-width: 1400px;">
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
    </q-page>
</template>

<script setup lang="ts">
import type { Folder } from '~/models/inventory/Folder'
import type { Inventory } from '~/models/inventory/Inventory'
import type { Item } from '~/models/inventory/Item'
import { TreePath } from '~/models/inventory/Tree'

definePageMeta({
    validate: (route) => {
        let path = route.params.path
        if (Array.isArray(path)) {
            path = path.join('/')
        }
        return /^[/-a-zA-z]*$/.test(path)
    },
})

const { $apiUseFetch } = useNuxtApp()

// const formattedPath = Array.isArray(path) ? path.join('/') : path.split('/').filter(seg => !!seg.length).join('/')

const route = useRoute()

const path = computed(() => {
    if (Array.isArray(route.params.path)) {
        return route.params.path.join('/')
    }
    return route.params.path
})

const { data, pending, error } = await $apiUseFetch<{
    inventory: Inventory
    targetFolderId: Folder['id']
    targetFolderPath: TreePath
    folders: any[],
    items: Item[]
}>(() => `inventory/${route.params.uri}/tree/${path.value}`)

console.log(data.value?.targetFolderPath.segments)

// inventoryLocation().value = new TreePath([])

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
