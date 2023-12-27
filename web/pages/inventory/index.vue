<template>
    <DefaultPage>
        <q-separator spaced />
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
            <CheckedFetch :fetched="inventories" class="col">
                <q-list v-if="inventories.data.value?.inventories.length" bordered>
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
            </CheckedFetch>
        </div>
    </DefaultPage>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

const { $apiUseFetch } = useNuxtApp()

const inventories = await $apiUseFetch<{
    inventories: Inventory[]
}>('/inventory')

definePageMeta({
    middleware: ['auth'],
})

</script>
