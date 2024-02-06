<template>
    <q-list padding>
        <q-item v-ripple clickable to="/inventory">
            <q-item-section avatar>
                <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section>
                <q-item-label>Home</q-item-label>
            </q-item-section>
        </q-item>

        <q-separator spaced inset />

        <q-item v-ripple clickable to="/inventory/search">
            <q-item-section avatar>
                <q-icon color="primary" name="manage_search" size="sm" />
            </q-item-section>
            <q-item-section>Search</q-item-section>
        </q-item>

        <q-item v-ripple clickable to="/inventory/buy-list">
            <q-item-section avatar>
                <q-icon color="primary" name="shopping_cart" size="sm" />
            </q-item-section>
            <q-item-section>My buy lists</q-item-section>
        </q-item>

        <q-item v-ripple clickable to="/inventory/attr">
            <q-item-section avatar>
                <q-icon color="primary" name="style" size="sm" />
            </q-item-section>
            <q-item-section>My attributes</q-item-section>
        </q-item>

        <q-separator spaced inset />

        <template v-if="myInventories">
            <q-item dense to="/inventory" class="q-mini-drawer-hide">
                <q-item-section side>
                    <q-item-label>
                        My inventories
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item
                v-for="(inventory, index) in myInventories.inventories"
                :key="index"
                v-ripple
                clickable
                class="q-py-xs q-px-sm"
                :to="`/inventory/${inventory.uri}`"
            >
                <q-item-section avatar class="col-auto q-pr-xs">
                    <q-avatar v-if="inventory.avatar" rounded class="">
                        <q-img
                            :src="inventory.avatar.src"
                            spinner-color="primary"
                            spinner-size="10px"
                        />
                    </q-avatar>
                    <q-avatar v-else icon="category" text-color="dark" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ inventory.name }}</q-item-label>
                    <q-item-label lines="2" caption>
                        {{ inventory.description }}
                    </q-item-label>
                </q-item-section>
                <q-item-section v-if="inventory.starred" side top class="col-auto column q-pa-none">
                    <q-icon name="star" color="yellow" size="sm" />
                    <!-- <star-favorite v-model="inventory.starred" size="md" /> -->
                </q-item-section>
            </q-item>
        </template>
        <template v-else>
            <q-skeleton type="rect" />
        </template>
    </q-list>
</template>

<script setup lang="ts">
import type { Inventory } from '~/models/inventory/Inventory'

const { $apiUseFetch } = useNuxtApp()
const { data: myInventories } = await $apiUseFetch<{
    inventories: Inventory[]
}>('/inventory', {
    method: 'GET',
    query: {
        limit: 3,
    },
})

</script>
