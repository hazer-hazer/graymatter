<template>
    <div class="row">
        <q-input
            ref="inputField"
            v-model="input"
            type="search"
            standout
            dense
            input-class="text-right"
            class="q-pa-none"
            clearable
            style="width: 250px"
            :loading="loading"
            debounce="500"
            @focus="focused = true"
            @blur="focused = false"
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
                    <!-- <q-icon v-else name="clear" class="cursor-pointer" @click="input = ''" /> -->
                </div>
            </template>
        </q-input>

        <q-list
            v-show="focused"
            bordered
            separator
            padding
            class="absolute q-mt-xl bg-white shadow-1 scroll overflow-auto rounded-borders"
            style="max-height: 450px; width: 250px;"
            @click="console.log('kek')"
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
</template>

<script lang="ts" setup>
import type { QInput } from 'quasar'
import type { Inventory } from '~/models/inventory/Inventory'
import type { Item } from '~/models/inventory/Item'

type SearchResult = {
    kind: 'item',
    item: Item
    url?: string
}

const input = ref()
const inputField = ref()
const focused = ref()
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)

const { $apiFetch } = useNuxtApp()

const search: QInput['onUpdate:modelValue'] = async (value) => {
    const inventoryUri = useInventoryLocation().inventoryUri()

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
    console.log(searchResults.value)

    loading.value = false
}

defineExpose({
    focus () {
        inputField.value.focus()
    },
    focused,
})
</script>

<style lang="scss">
.kbd {
    font-size: 0.5em;
    border: 1px solid #ddd;
    background-color: transparent;
    padding: 1px 2px;
}
</style>
