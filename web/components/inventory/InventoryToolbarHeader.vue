<template>
    <q-avatar text-color="primary">
        <q-icon name="inventory_2" />
    </q-avatar>

    <q-toolbar-title class="text-h6 q-pa-none">
        Inventory
    </q-toolbar-title>

    <q-space />

    <ClientOnly>
        <InventorySearch v-if="currentPath" class="q-pr-sm" :path="currentPath" style="width: 250px;" />
    </ClientOnly>

    <q-btn
        flat
        icon="add"
        padding="sm"
        size="md"
        dense
    >
        <!-- <q-tooltip>
            Add item
        </q-tooltip> -->

        <q-menu>
            <q-list style="min-width: 150px" dense>
                <q-item
                    v-if="currentPath"
                    v-close-popup
                    clickable
                    @click="showCreateItemModal = true"
                >
                    <q-item-section side class="q-pr-sm">
                        <q-icon name="category" size="xs" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            New item
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-if="currentPath" v-close-popup clickable @click="showCreateFolderModal = true">
                    <q-item-section side class="q-pr-sm">
                        <q-icon name="create_new_folder" size="xs" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            New folder
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="showCreateInventoryModal = true">
                    <q-item-section side class="q-pr-sm">
                        <q-icon name="inventory_2" size="xs" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            New inventory
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>

    <InventoryItemCreateModal v-if="currentPath" v-model="showCreateItemModal" :path="currentPath" />
    <InventoryFolderCreateModal v-if="currentPath" v-model="showCreateFolderModal" :path="currentPath" />
    <InventoryCreateModal v-model="showCreateInventoryModal" />
</template>

<script lang="ts" setup>
const showCreateItemModal = ref<boolean>(false)
const showCreateFolderModal = ref<boolean>(false)
const showCreateInventoryModal = ref<boolean>(false)
const inventoryStore = useInventoryStore()
const currentPath = computed(() => inventoryStore.pathSegments)
</script>
