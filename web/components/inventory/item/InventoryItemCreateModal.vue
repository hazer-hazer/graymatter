<template>
    <q-dialog v-model="open" transition-hide="slide-down" transition-show="slide-down">
        <div class="bg-white q-pa-md inventory-item-create-modal">
            <span class="text-h5">Add item</span>
            <q-space />
            <span class="text-caption text-italic">in {{ path }}</span>
            <q-separator spaced />
            <q-form
                ref="form"
                class="q-gutter-md col"
                @submit="onSubmit"
                @reset="onReset"
            >
                <div class="row">
                    <div class="col">
                        <q-input
                            v-model="name"
                            class="row text-h6"
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
                            class="row"
                            type="textarea"
                            autogrow
                            label="Description"
                            maxlength="1023"
                        />

                        <q-input v-model="buyLink" type="url" label="Buy link" />
                        <!-- TODO: Price -->

                        <div class="row">
                            <div class="col">
                                <inventory-amount-unit-search ref="amountUnit" />
                            </div>
                            <div class="col">
                                <q-input
                                    v-model="rawAmountValue"
                                    :readonly="!amountUnit?.selected"
                                    type="number"
                                    label="Amount"
                                    :suffix="amountUnit?.selected?.symbol"
                                    lazy-rules
                                    :rules="[
                                        val => !!val || 'Amount unit is required'
                                    ]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <q-btn
                        label="Add variants?"
                        flat
                        dense
                        class="full-width row"
                        @click="showVariants = !showVariants"
                    />
                    <div v-show="showVariants" class="row full-width">
                        <inventory-variant-create ref="variants" class="col" />
                    </div>
                </div>

                <div class="row justify-end q-gutter-sm">
                    <q-btn
                        outline
                        label="Reset"
                        type="reset"
                        color="primary"
                        class="q-ml-sm"
                    />
                    <q-btn label="Create item" type="submit" color="primary" :loading="loading" />
                </div>
            </q-form>

            <div v-if="createdItems?.length" class="row column q-pa-sm">
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
            </div>
        </div>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { QForm, QInput } from 'quasar'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { Item } from '~/models/inventory/Item'

export interface IInventoryItemCreateModal {
    modelValue: boolean
}

const props = defineProps<IInventoryItemCreateModal>()
const emit = defineEmits<{(event: 'update:modelValue', payload: boolean): void}>()

const form = ref<QForm>()
const showVariants = ref(false)
const path = computed(() => useInventoryLocation().targetFolderPath().toUserPath())

const name = ref()
const description = ref()
const buyLink = ref()
const amountUnit = ref<{selected: AmountUnit}>()
const rawAmountValue = ref()
const variants = ref<{variants: string[]}>()

const open = computed({
    get () {
        return props.modelValue
    },
    set (value: boolean) {
        emit('update:modelValue', value)
    },
})

const $q = useQuasar()

const { $apiFetch } = useNuxtApp()

const loading = ref(false)
const createdItems: Ref<Item[]> = ref([])
const onSubmit = async () => {
    loading.value = true
    const inventoryLocation = useInventoryLocation()
    const targetFolderId = inventoryLocation.targetFolderId()
    const inventoryId = inventoryLocation.inventoryId()
    try {
        if (!targetFolderId || !inventoryId) {
            throw new Error('Cannot determine folder and inventory to save item to')
        }

        const { item } = await $apiFetch<{item: Item}>('inventory/item', {
            method: 'POST',
            body: {
                name: name.value,
                description: description.value ?? null,
                inventoryId,
                folderId: targetFolderId,
                amountUnitId: amountUnit.value?.selected.id,
                rawAmountValue,
                variants: variants.value?.variants?.map(name => ({
                    name,
                    description: null,
                    reasonablePrice: null,
                })),
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

        form.value?.reset()
    } catch (err) {
        console.error(err)

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

const onReset = () => {}

</script>

<style lang="scss" scoped>
.inventory-item-create-modal {
    width: 700px;
    max-width: 80vw;
}
</style>
