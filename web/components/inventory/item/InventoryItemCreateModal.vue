<template>
    <g-modal v-model="confirm" title="Add item" :caption="caption" @submit="onSubmit">
        <template #default>
            <q-input
                v-model="name"
                class="text-h6"
                autofocus
                type="text"
                label="Name"
                maxlength="255"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Name is required',
                    val => val?.length > 0 && val?.length < 255 || 'Name must be <255 characters long'
                ]"
            />

            <q-input
                v-model="description"
                type="textarea"
                autogrow
                label="Description"
                maxlength="1023"
            />

            <q-separator spaced />

            <div class="row q-col-gutter-xs">
                <span class="full-width text-subtitle2">Amount</span>
                <inventory-amount-unit-search v-model="amountUnit" dense class="col-6" />
                <inventory-amount-input v-model="amountValue" dense class="col-6" :amount-unit="amountUnit" />
            </div>

            <q-separator spaced />

            <div class="row q-col-gutter-xs">
                <span class="full-width text-subtitle2">Purchase</span>
                <currency-select v-model="currency" dense class="col-4" />
                <inventory-price-input v-model="realPrice" dense class="col-4" :currency="currency" />
                <q-input
                    v-model="buyLink"
                    dense
                    outlined
                    type="url"
                    class="col-4"
                    label="Buy link"
                />
            </div>

            <div v-if="amountUnit && currency" class="column">
                <q-separator spaced />
                <q-btn
                    label="Add variants?"
                    flat
                    dense
                    class="col q-mb-sm"
                    @click="showVariants = !showVariants"
                />
                <div v-show="showVariants" class="col">
                    <inventory-item-variant-quick-add-list v-model="variants" dense :amount-unit="amountUnit" :currency="currency" />
                </div>
            </div>
        </template>

        <template v-if="createdItems?.length" #bottom>
            <q-separator spaced />
            <div class="text-h6">
                <span>Added items:</span>
            </div>
            <q-list bordered dense>
                <q-item
                    v-for="(item, index) in createdItems"
                    :key="index"
                    v-ripple
                    clickable
                    dense
                    class="q-pa-md"
                    :to="`/inventory/item/${item.id}`"
                >
                    <q-item-section class="text-body1">
                        <div class="text-grey-4 text-caption">
                            <span>open</span>
                        </div>
                        {{ item.name }}
                    </q-item-section>
                </q-item>
            </q-list>
        </template>
    </g-modal>
</template>

<script lang="ts" setup>
import type { QInput } from 'quasar'
import type { ItemVariantQuickAddList } from './variant/InventoryItemVariantQuickAddList.vue'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { Item } from '~/models/inventory/Item'
import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'
import type { Currency } from '~/models/Currency'

const props = defineProps<{
    modelValue: boolean
    path: TreePathSegment[]
}>()

const path = new TreePath(props.path)

const caption = computed(() => `in ${path.targetFolderPath().toUserPath()}`)

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
}>()

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})

const { $apiFetch, $apiUseFetch } = useNuxtApp()

const showVariants = ref(false)

const name = ref<string>()
const description = ref<string>()
const realPrice = ref<number | null>(null)
const buyLink = ref<string>()
const amountUnit = ref<AmountUnit | null>(null)
const amountValue = ref<number>()
const variants = ref<ItemVariantQuickAddList>({})
const { data: inventoryCurrency } = await $apiUseFetch<{currency: Currency}>(`/inventory/${path.inventoryId()}/currency`)
const currency = ref<Currency | null>(null)
watchEffect(() => { currency.value = inventoryCurrency.value?.currency ?? null })

const $q = useQuasar()

const loading = ref(false)
const createdItems: Ref<Item[]> = ref([])
const onSubmit = async () => {
    loading.value = true

    const folderId = path.targetFolderId()
    const inventoryId = path.inventoryId()

    try {
        if (!folderId || !inventoryId) {
            throw new Error('Cannot determine folder and inventory to save item to')
        }

        const { item } = await $apiFetch<{item: Item}>('inventory/item', {
            method: 'POST',
            body: {
                item: {
                    name: name.value,
                    description: description.value,
                    inventoryId,
                    folderId,
                    amountUnitId: amountUnit.value?.id,
                    rawAmountValue: amountValue.value,
                    realPrice: realPrice.value,
                    currencyId: currency.value?.id,
                },
            },
        })

        await $apiFetch(`/inventory/item/${item.id}/variant/quick`, {
            method: 'POST',
            body: {
                names: variants.value.names,
                realPriceEach: variants.value.realPriceEach,
                amountValueEach: variants.value.amountValueEach,
            },
        })

        createdItems.value.push(item)

        const itemUrl = `/inventory/item/${item.id}`

        $q.notify({
            type: 'positive',
            message: `Item ${item.name} created successfully`,
            timeout: 5000,
            actions: [
                {
                    label: 'Open',
                    color: 'white',
                    handler: () => navigateTo(itemUrl),
                },
                {
                    label: 'Open in new tab',
                    color: 'white',
                    handler: () => navigateTo(itemUrl, {
                        open: {
                            target: '_blank',
                        },
                    }),
                },
            ],
        })
    } catch (err) {
        if (err instanceof Error) {
            $q.notify({
                type: 'negative',
                message: err.message,
            })
        }
    } finally {
        loading.value = false
    }
}

</script>

<style lang="scss" scoped>
.inventory-item-create-modal {
    width: 700px;
    max-width: 80vw;
}
</style>
