<template>
    <q-select
        v-model="selected"
        label="Search for items..."
        :options="foundItems"
        :option-label="item => item.name"
        use-input
        autofocus
        :loading="loading"
        hide-dropdown-icon
        rounded
        clearable
        @filter="search"
        @new-value="newValue"
    >
        <template #option="{ opt, selected, toggleOption }">
            <q-item class="search-item" :class="selected ? 'selected' : ''">
                <q-item-section avatar class="q-pr-md col-auto">
                    <q-img v-if="opt.avatar" :src="opt.avatar?.src" />
                    <q-icon v-else-if="opt.kind === 'custom'" name="box_new" />
                    <q-icon v-else name="category" color="grey" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="item-name" @click="toggleOption(opt)">
                        {{ opt.name }}
                    </q-item-label>
                    <q-item-label v-if="opt.caption" caption class="item-caption">
                        {{ opt.caption }}
                    </q-item-label>
                </q-item-section>
                <q-item-section side class="item-goto">
                    <q-btn
                        color="grey"
                        icon="open_in_new"
                        flat
                        dense
                        @click="navigateTo(opt.url, {open: {target: '_blank'}})"
                    />
                </q-item-section>
            </q-item>
        </template>

        <template #selected-item="{ opt }">
            <q-item dense class="q-pa-none">
                <q-item-section avatar class="q-pr-md col-auto">
                    <q-img v-if="opt.avatar" :src="opt.avatar?.src" height="50%" ratio="1/1" />
                    <q-icon v-else name="category" color="grey" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        {{ opt.name }}
                    </q-item-label>
                    <q-item-label v-if="opt.caption" caption>
                        {{ opt.caption }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>

        <template #no-option="{inputValue}">
            <div class="text-caption text-center q-pa-sm">
                Nothing found for "{{ inputValue }}"
            </div>
        </template>
    </q-select>
</template>

<script setup lang="ts">
import type { QSelect } from 'quasar'
import type { Image } from '~/models/Image'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { Item } from '~/models/inventory/Item'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

export interface ItemQuickSearchOption {
    kind: 'custom' | 'item' | 'variant'
    name: string
    caption?: string
    itemId?: Item['id']
    itemVariantId?: ItemVariant['id']
    amountUnit: AmountUnit
    avatar?: Image
    url?: string
}

const props = defineProps<{
    modelValue: ItemQuickSearchOption | null
    allowCreate?: boolean
    excludeItems?: Item['id'][]
    excludeItemVariants?: ItemVariant['id'][]
}>()

const emit = defineEmits<{
    'update:modelValue': [selected: ItemQuickSearchOption | null]
}>()

const selected = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})

// const searchCache = {}

const { $apiFetch, $apiUseFetch } = useNuxtApp()

const loading = ref<boolean>(false)
const foundItems = ref<ItemQuickSearchOption[]>([])

const search: QSelect['onFilter'] = async (val, update) => {
    const q = val.trim()
    if (!q.length) {
        update(() => {})
        return
    }

    loading.value = true
    try {
        console.log('exclude', props.excludeItems, props.excludeItemVariants)

        const { items } = await $apiFetch<{
            items: Item[]
        }>('inventory/item/search', {
            query: {
                q,
                excludeItems: props.excludeItems,
                excludeItemVariants: props.excludeItemVariants,
            },
        })

        update(() => {
            foundItems.value = items.reduce((options: ItemQuickSearchOption[], item) => {
                if (item.variants?.length) {
                    const variants: ItemQuickSearchOption[] = item.variants.map(variant => ({
                        kind: 'variant',
                        name: variant.name,
                        caption: item.name,
                        itemId: item.id,
                        itemVariantId: variant.id,
                        amountUnit: item.amountUnit,
                        url: `/inventory/item/${variant.itemId}`,
                        avatar: variant.avatar ?? item.images?.[0]?.image,
                    }))

                    options.push(...variants)
                } else {
                    options.push({
                        kind: 'item',
                        name: item.name,
                        itemId: item.id,
                        amountUnit: item.amountUnit,
                        url: `/inventory/item/${item.id}`,
                        avatar: item.images?.[0]?.image,
                    })
                }
                return options
            }, [])

            console.log('options', foundItems)
        })
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const { data: defaultAmountUnit } = await $apiUseFetch<{
    amountUnit: AmountUnit
}>('/inventory/amount/default')

const newValue: QSelect['onNewValue'] = (name, done) => {
    if (!name.trim().length || !defaultAmountUnit.value) {
        return done()
    }

    return done({
        kind: 'custom',
        name,
        amountUnit: defaultAmountUnit.value.amountUnit,
    } satisfies ItemQuickSearchOption)
}
</script>

<style scoped lang="scss">
.item-name {
    transition: color .2s ease;
    cursor: pointer;
}

.item-name:hover {
    color: $primary;
}

.item-caption {
    transition: .15s ease;
    cursor: pointer;
}

.item-caption:hover {
    color: $primary;
    text-decoration: underline;
}

.item-goto {
    opacity: 0;
    transition: opacity .2s ease;
}

.search-item:hover .item-goto {
    opacity: 1;
}

.search-item {
    box-shadow: 0 1px 1px 0 #f0f0f0;
}

.search-item.selected {
    background-color: #f0f0f0;
}
</style>
