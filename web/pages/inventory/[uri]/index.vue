<template>
    <DefaultPage>
        <span class="text-h4 row">
            <span class="text-weight-medium q-pr-xs">
                {{ data?.inventory.name }}
            </span>
            <span class="text-caption text-uppercase">dashboard</span>
        </span>

        <q-separator spaced />

        <div class="row q-gutter-md justify-center text-h6 vertical-middle">
            <q-card
                v-for="(card, index) in statsCards"
                :key="index"
                class="col-auto"
                bordered
                flat
            >
                <q-card-section horizontal class="q-pa-sm q-pr-md">
                    <q-card-section class="q-pa-none">
                        <q-avatar :icon="card.icon" text-color="accent" />
                    </q-card-section>
                    <q-card-section class="q-pa-none column justify-center items-start self-center">
                        <div>
                            <span v-if="card.text">
                                {{ card.text }}
                            </span>
                            <q-skeleton v-else type="text" />
                        </div>
                        <span v-if="card.subtext" class="text-body2">{{ card.subtext }}</span>
                    </q-card-section>
                </q-card-section>
            </q-card>
        </div>

        <q-separator spaced />

        <div v-if="data?.inventory.tree" class="q-pa-md">
            <div class="row">
                <span class="col text-h6">Lookup for item/folder</span>
            </div>
            <div class="row">
                <inventory-tree :tree="data?.inventory.tree" />
                <!-- <q-splitter
                    v-model="lookupTreeSplitter"
                    class="col"
                    style="height: 400px"
                >
                    <template #before>
                        <inventory-tree :tree="data?.inventory.tree" />
                    </template>

                    <template #separator>
                        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
                    </template>

                    <template #after>
                        Item here
                    </template>
                </q-splitter> -->
            </div>
        </div>
    </DefaultPage>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

const { $apiUseFetch } = useNuxtApp()
const route = useRoute('inventory-uri')
const { data } = await $apiUseFetch<{
    inventory: Inventory & Required<Pick<Inventory, 'stats' | 'currency'>>
}>(() => `inventory/${route.params.uri}`)

if (!data.value?.inventory) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    })
}

const inventory = reactive(data.value.inventory)

if (data.value?.inventory.path) {
    inventoryLocation().value = data.value?.inventory.path.segments
}

const statsCards: ComputedRef<{
    icon: string
    text: string
    subtext?: string
}[]> = computed(() => {
    const stats = inventory.stats
    const cards = [
        { icon: 'category', text: `${stats.itemsCount} items`, subtext: `${stats.variantsCount} variants` },
        { icon: 'folder', text: `${stats.foldersCount} folders` },
        { icon: 'delete', text: `${stats.itemsInTrashFolderCount} items in trash` },
    ]

    const priceFmt = priceFormatter(inventory.currency)

    if (stats.totalPrice !== null) {
        const displayPrice = priceFmt.format(stats.totalPrice)
        cards.push({
            icon: 'payments',
            text: `${displayPrice} in total`,
        })
    }

    return cards
})

// const lookupTreeSplitter = ref(50)

useHead({
    title: `${data.value?.inventory.name} dashboard`,
})

definePageMeta({
    middleware: ['auth'],
})
</script>
