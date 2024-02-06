<template>
    <q-select
        v-model="input"
        :options="searchResults"
        :label="label"
        :loading="loading"
        :input-debounce="500"
        use-input
        dense
        outlined
        hide-dropdown-icon
        :option-label="displaySearchResult"
        hide-selected
        @filter="search"
    >
        <template #no-option>
            <q-item v-if="input?.length">
                <q-item-section>
                    <q-item-label caption>
                        Nothing found
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>

        <template #option="{opt, itemProps}">
            <q-item v-bind="itemProps" @click="navigateTo(opt.url)">
                <q-item-section>
                    <q-item-label>{{ opt.item.name }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
    <!--
    <div class="row">
        <q-input
            ref="inputField"
            v-model="input"
            type="search"
            outlined
            dense
            class="text-right q-pa-none"
            clearable
            style="width: 250px"
            :loading="loading"
            debounce="500"
            :label="label"
            @update:model-value="search"
        >
            <template #prepend>
                <q-icon name="search" />
            </template>

            <template #append>
                <div class="row">
                    <div v-if="!focused" class="row">
                        <kbd class="kbd self-center text-body2 rounded-borders">Ctrl+K</kbd>
                    </div>
                </div>
            </template>
        </q-input>

        <q-list
            bordered
            separator
            padding
            class="absolute q-mt-xl bg-white shadow-1 scroll overflow-auto rounded-borders"
            style="max-height: 450px; width: 250px;"
        >
            <q-item-label header class="sticky">
                Search results
            </q-item-label>

            <q-inner-loading :showing="loading">
                <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

            <q-item
                v-for="(result, index) in searchResults"
                :key="index"
                v-ripple
                clickable
                :to="result.url"
                class="bg-white"
            >
                <q-item-section>
                    <q-item-label>{{ result.item.name }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
-->
</template>

<script lang="ts" setup>
import type { QSelect } from 'quasar'
import type { Inventory } from '~/models/inventory/Inventory'
import type { Item } from '~/models/inventory/Item'
import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'

const props = defineProps<{
    path: TreePathSegment[]
}>()

const path = new TreePath(props.path)

type SearchResult = {
    kind: 'item'
    item: Item
    url: string
}

const label = computed(() => `Search in ${path.toUserPath()}`)

const input = ref<string>()
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)

const { $apiFetch } = useNuxtApp()

const search: QSelect['onFilter'] = (value, update) => update(async () => {
    const inventoryUri = path.inventoryUri()

    if (!value) {
        searchResults.value = []
        return
    }

    loading.value = true
    const { results } = await $apiFetch<{
        inventory: Inventory
        results: SearchResult[]
    }>(`inventory/${inventoryUri}/search`, {
        query: {
            q: value,
        },
    })

    searchResults.value = results.map((result: SearchResult): SearchResult => {
        if (result.kind === 'item') {
            return {
                ...result,
                url: `/inventory/item/${result.item.id}`,
            }
        }
        throw new Error(`Unknown search result kind ${result.kind}`)
    })

    loading.value = false
})

const displaySearchResult = (result: SearchResult): string => result.item.name
</script>

<style lang="scss">
.kbd {
    font-size: 0.5em;
    border: 1px solid #ddd;
    background-color: transparent;
    padding: 1px 2px;
}
</style>
