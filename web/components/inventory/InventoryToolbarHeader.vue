<template>
    <q-avatar text-color="primary">
        <!-- <img src="/logo.svg"/> -->
        <q-icon name="inventory_2" />
    </q-avatar>

    <q-toolbar-title class="text-h6 q-pa-none">
        Inventory
    </q-toolbar-title>

    <q-space />

    <InventorySearch v-if="isInventorySpecified" ref="inventorySearch" class="q-pr-sm" />

    <q-btn
        v-if="isInventorySpecified"
        flat
        icon="add"
        padding="sm"
        size="md"
        dense
        @click="showCreateItemModal().value = true"
    >
        <q-tooltip>
            Add item
        </q-tooltip>
    </q-btn>
</template>

<script lang="ts" setup>
const inventorySearch = ref()
const isInventorySpecified = useIsInventorySpecified()
</script>
