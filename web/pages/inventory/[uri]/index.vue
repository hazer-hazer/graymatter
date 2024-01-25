<template>
    <DefaultPage>
        <div class="row items-center justify-between">
            <div class="col row items-center">
                <div class="text-h5 text-weight-medium q-pr-xs">
                    {{ data?.inventory.name }}
                </div>
                <div class="text-overline text-grey-7 text-uppercase self-start">
                    dashboard
                </div>
            </div>

            <div class="col-auto self-end q-px-xs">
                <StarFavorite v-model="starred" />
            </div>
        </div>

        <q-separator spaced />

        <div class="row q-gutter-sm justify-center text-h6 vertical-middle">
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

        <div v-if="data?.inventory.tree">
            <q-card class="my-card" flat bordered>
                <q-card-section class="row justify-between items-center q-pb-none">
                    <div class="col-auto text-h6">
                        Inventory structure
                    </div>

                    <div class="col-4">
                        <q-input
                            v-model="treeFilter"
                            type="text"
                            :label="`Search in ${data.inventory.name} tree`"
                            dense
                            outlined
                        />
                    </div>
                </q-card-section>
                <q-card-section>
                    <q-separator />
                    <inventory-tree :tree="data?.inventory.tree" :filter="treeFilter" />
                </q-card-section>
            </q-card>
        </div>
    </DefaultPage>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

definePageMeta({
    middleware: ['auth'],
})

const { $apiUseFetch, $apiFetch } = useNuxtApp()
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

useHead({
    title: `${inventory.name} dashboard`,
})

if (inventory.path) {
    inventoryLocation().value = inventory.path.segments
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

const treeFilter = ref<string>('')

const starred = computed({
    get () {
        return inventory.starred ?? false
    },
    async set (val: boolean) {
        const { star } = await $apiFetch<{
            star: boolean
        }>(`/inventory/${inventory.id}/star`, {
            method: 'POST',
            body: {
                star: val,
            },
        })

        inventory.starred = star
    },
})
</script>
