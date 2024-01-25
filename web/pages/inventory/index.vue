<template>
    <DefaultPage>
        <div class="col items-center">
            <div class="col row">
                <q-btn
                    outline
                    class="col-auto"
                    label="Create new inventory"
                    no-caps
                    @click="showInventoryCreateModal().value = true"
                />
            </div>
            <q-separator spaced />
            <q-list v-if="inventories.data.value?.inventories.length" bordered class="rounded-borders">
                <q-item
                    v-for="(inv, index) in inventories.data.value?.inventories"
                    :key="index"
                    v-ripple
                    clickable
                    :to="`/inventory/${inv.uri}`"
                >
                    <q-item-section>
                        <q-item-label>{{ inv.name }}</q-item-label>
                        <q-item-label caption>
                            {{ inv.uri }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <div v-else class="row justify-center">
                <span class="text-h6">You have no inventories</span>
            </div>
        </div>
    </DefaultPage>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

useHead({
    title: 'My inventories',
})

definePageMeta({
    middleware: ['auth'],
})

const { $apiUseFetch } = useNuxtApp()

const inventories = await $apiUseFetch<{
    inventories: Inventory[]
}>('/inventory', {
    method: 'GET',
})

</script>
