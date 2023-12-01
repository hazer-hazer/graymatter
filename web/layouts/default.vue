<template>
    <q-layout view="hHh Lpr fFf">
        <NuxtLoadingIndicator />
        <q-header class="header text-dark">
            <q-toolbar>
                <q-btn
                    dense
                    flat
                    round
                    icon="menu"
                    @click="toggleLeftDrawer"
                />

                <q-avatar text-color="primary">
                    <!-- <img src="/logo.svg"/> -->
                    <q-icon name="inventory_2" />
                </q-avatar>

                <q-toolbar-title class="text-h6 q-pa-none">
                    Inventory
                </q-toolbar-title>

                <q-space />

                <InventorySearch ref="inventorySearch" class="q-pr-sm" />

                <q-btn
                    flat
                    icon="add"
                    padding="sm"
                    size="md"
                    dense
                    @click="openCreateItemModal().value = true"
                >
                    <q-tooltip>
                        Add item
                    </q-tooltip>
                </q-btn>
                <q-separator spaced inset vertical />
                <q-btn flat round color="dark">
                    <q-avatar icon="account_circle" />
                    <q-menu anchor="bottom start" self="top start">
                        <q-list style="min-width: 100px">
                            <q-item v-close-popup clickable>
                                <q-item-section>Profile</q-item-section>
                            </q-item>
                            <q-separator spaced />
                            <q-item v-close-popup clickable>
                                <q-item-section>
                                    Logout
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <!-- <q-btn-dropdown icon="add" color="white">
                    <q-list>
                        <q-item v-close-popup clickable @click="openItemCreateModal = true">
                            <q-item-section>
                                <q-item-label>Photos</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown> -->
            </q-toolbar>
        </q-header>

        <q-page-container class="row justify-center">
            <NuxtPage />
        </q-page-container>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            side="left"
            bordered
            overlay
        />

        <InventoryItemCreateModal v-model="openCreateItemModal().value" />
        <InventoryFolderCreateModal v-model="openCreateFolderModal().value" />
    </q-layout>
</template>

<script lang="ts" setup>
const leftDrawerOpen = ref(false)
const inventorySearch = ref()

const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value }

// onMounted(() => {
//     document.addEventListener('keydown', (e) => {
//         if (inventorySearch.value.focused) {
//             return
//         }

//         e.preventDefault()

//         if (e.ctrlKey && e.key === 'k') {
//             inventorySearch.value.focus()
//         }
//     }, false)
// })
</script>

<style scoped lang="scss">
@use 'sass:color';

.header {
    box-shadow: 0 2px 5px #dfdfdf;
    background-color: #fffa;
    // background-color: color.adjust($primary, $alpha: -0.4);
    backdrop-filter: blur(6px);
}

</style>
