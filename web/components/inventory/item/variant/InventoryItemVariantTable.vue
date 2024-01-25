<template>
    <q-table
        v-model:selected="variantsSelected"
        title="Variants"
        :columns="variantsTableColumns"
        :rows="Object.values(variants)"
        row-key="id"
        flat
        bordered
        selection="multiple"
        :loading="variantsTableLoading"
        style="max-height: 500px;"
        table-class="scroll-shadows-horizontal"
        class="variants-table"
        :pagination="{rowsPerPage: 0}"
        :filter="variantsTableFilter"
        hide-pagination
        wrap-cells
    >
        <template #top-right>
            <div v-if="variantsSelected.length > 0" class="row q-gutter-sm">
                <q-btn
                    color="primary"
                    icon="delete"
                    outline
                    @click="deleteSelectedVariants"
                />
            </div>
            <div v-else class="row q-gutter-xs">
                <q-input
                    v-model="variantsTableFilter"
                    type="text"
                    label="Search"
                    dense
                    outlined
                    class="col"
                />

                <q-btn
                    color="dark"
                    icon="auto_awesome"
                    label="Quickly add variants"
                    outline
                    dense
                    class="q-px-md"
                    :loading="quickVariantAddLoading"
                >
                    <q-popup-edit
                        v-slot="scope"
                        v-model="quickVariantAdd"
                        buttons
                        persistent
                        label-set="Add variants"
                        max-width="400px"
                        :validate="quickAdd => !!quickAdd?.names?.length"
                        @save="saveQuickVariantAdd"
                    >
                        <InventoryItemVariantQuickAddList v-model="scope.value" :amount-unit="item.amountUnit" :currency="item.currency" />
                    </q-popup-edit>
                </q-btn>
                <q-btn
                    color="primary q-px-md"
                    outline
                    icon="add_box"
                    label="Add variant"
                    dense
                    @click="showVariantCreateModal = true"
                />
                <InventoryItemVariantCreateModal v-model="showVariantCreateModal" :item="item" @save="upsertVariants" />
            </div>
        </template>

        <template #no-data>
            <span class="text-italic text-caption">This item does not have variants</span>
        </template>

        <template #body="body">
            <q-tr :props="body">
                <q-td>
                    <q-checkbox
                        :model-value="body.selected"
                        @update:model-value="(val) => {
                            const selected = Object.getOwnPropertyDescriptor(body, 'selected')
                            if (selected?.set) {
                                selected.set(val)
                            }
                        }"
                    />
                </q-td>

                <q-td
                    key="avatar"
                    v-ripple
                    :props="body"
                    auto-width
                    class="editable-cell"
                    @click="body.row.showImageUploader = true"
                >
                    <BadgeTooltip />
                    <q-avatar v-if="body.row?.avatar?.src" rounded>
                        <q-img
                            :src="body.row.avatar.src"
                            spinner-color="primary"
                            spinner-size="20px"
                            height="90%"
                            class="rounded-borders"
                        />
                    </q-avatar>
                    <q-avatar v-else icon="image" text-color="grey" />
                    <ImageUploader v-model="body.row.showImageUploader" :multiple="false" @uploaded="res => variantImageChanged(body.row.id, res)" />
                </q-td>

                <q-td
                    key="name"
                    v-ripple
                    :props="body"
                    class="editable-cell"
                >
                    <BadgeTooltip />
                    <q-badge v-if="body.row.isNew" color="primary" label="new" />
                    <span class="text-body2">{{ body.row.name }}</span>
                    <q-popup-edit
                        v-slot="scope"
                        v-model="body.row.name"
                        class="q-pa-xs"
                    >
                        <q-input
                            v-model="scope.value"
                            label="Name"
                            autofocus
                            outlined
                            @keyup.enter="scope.set"
                        />
                    </q-popup-edit>
                </q-td>

                <q-td
                    key="description"
                    v-ripple
                    :props="body"
                    class="editable-cell"
                >
                    <BadgeTooltip />
                    <div class="row">
                        <span v-if="body.row?.description?.length" class="ellipsis" style="max-width: 400px; overflow: hidden; display: inline-block;">
                            {{ body.row.description }}
                        </span>
                        <span v-else class="text-italic text-grey">No description</span>
                        <q-tooltip v-if="body.row?.description?.length > 20" max-width="400px" style=" overflow-wrap: anywhere; word-break: normal;">
                            {{ body.row.description }}
                        </q-tooltip>
                    </div>

                    <q-popup-edit
                        v-slot="scope"
                        v-model="body.row.description"
                        class="q-pa-xs"
                        max-width="30rem"
                        buttons
                        @save="description => updateItemVariant(body.row.id, {description})"
                    >
                        <q-input
                            v-model="scope.value"
                            type="textarea"
                            outlined
                            autogrow
                            autofocus
                            input-style="padding: none !important"
                        />
                    </q-popup-edit>
                </q-td>

                <q-td
                    key="amountValue"
                    v-ripple
                    :props="body"
                    class="editable-cell"
                >
                    <BadgeTooltip />
                    <span class="text-subtitle1">{{ body.row.amountValue }}</span>

                    <q-popup-edit
                        v-slot="scope"
                        v-model="body.row.amountValue"
                        class="q-pa-xs"
                        @save="set => updateItemVariant(body.row.id, {amountValue: set})"
                    >
                        <InventoryAmountInput v-model="scope.value" :amount-unit="item.amountUnit" autofocus @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>

                <q-td
                    key="displayPrice"
                    v-ripple
                    :props="body"
                    class="editable-cell"
                >
                    <BadgeTooltip />
                    <span v-if="body.row.displayPrice" class="text-subtitle1">{{ body.row.displayPrice }}</span>
                    <div v-else-if="item.price !== null">
                        <span class="text-subtitle1">{{ itemDisplayPrice }}</span>
                        <span class="text-grey"> (from item)</span>
                    </div>
                    <span v-else class="text-italic text-grey">
                        Price is not set
                    </span>

                    <q-popup-edit
                        v-slot="scope"
                        v-model="body.row.realPrice"
                        class="q-pa-xs"
                        @save="set => updateItemVariant(body.row.id, {realPrice: set})"
                    >
                        <InventoryPriceInput
                            v-model="scope.value"
                            :currency="item.currency"
                            autofocus
                            @keyup.enter="scope.set"
                        />
                    </q-popup-edit>
                </q-td>

                <q-td
                    v-for="(itemAttr) in item.attributes"
                    :key="attrKey(itemAttr.attr)"
                    v-ripple
                    :props="body"
                    class="editable-cell"
                >
                    <BadgeTooltip />

                    <span v-if="body.row.attrMap[itemAttr.attr.id]" class="text-subtitle1">{{ body.row.attrMap[itemAttr.attr.id].value }}</span>
                    <div v-else class="row inline items-center no-wrap q-gutter-xs">
                        <span class="text-subtitle1">{{ itemAttr.value }}</span>
                        <span class="text-grey text-caption"> (from item)</span>
                    </div>

                    <q-popup-edit
                        v-slot="scope"
                        v-model="body.row.attrMap[itemAttr.attr.id]"
                        class="q-pa-xs"
                        @save="value => updateVariantAttr(body.row.id, itemAttr.attr.id, value)"
                    >
                        <InventoryAttrValueInput v-model="scope.value" :attr="itemAttr.attr" autofocus @keyup.stop.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import type { ItemVariantQuickAddList } from './InventoryItemVariantQuickAddList.vue'
import type { UploadResult } from '~/components/ImageUploader.vue'
import type { Attribute, AttrValue } from '~/models/inventory/Attribute'
import type { Item } from '~/models/inventory/Item'
import type { ItemVariant, ItemVariantAttr } from '~/models/inventory/ItemVariant'

const props = defineProps<{
    item: Item
}>()

const item = props.item
const variants = reactive(mapIdList(props.item.variants ?? [], 'id', variantToDynamic))

type ItemVariantAttrDynamic = Attribute & {
    value: AttrValue | null
}

type ItemVariantDynamic = Omit<ItemVariant, 'attributes'> & {
    isNew?: boolean
    displayPrice?: string | null
    loading: boolean
    attrMap: Record<Attribute['id'], ItemVariantAttrDynamic>
    showImageUploader: boolean
}

const $q = useQuasar()
const { $apiFetch } = useNuxtApp()

const showVariantCreateModal = ref<boolean>(false)

const itemDisplayPrice = computed(() => item.realPrice !== null ? itemPriceFormatter().format(item.realPrice) : null)
function itemPriceFormatter () {
    return priceFormatter(item.currency)
}

function itemVariantAttrToDynamic (attr: ItemVariantAttr): ItemVariantAttrDynamic {
    return {
        ...attr.itemAttr.attr,
        value: attr.value,
    }
}

function variantToDynamic (variant: ItemVariant): ItemVariantDynamic {
    return {
        ...variant,
        isNew: false,
        displayPrice: variant.realPrice ? itemPriceFormatter().format(variant.realPrice) : null,
        loading: false,
        attrMap: mapIdList(variant.attributes ?? [], ({ itemAttr: { attr } }) => attr.id, itemVariantAttrToDynamic),
        showImageUploader: false,
    }
}

const updateItemVariant = async (variantId: ItemVariant['id'], updated: Partial<ItemVariantDynamic>) => {
    try {
        variants[variantId].loading = true
        const { itemVariant } = await $apiFetch<{
            itemVariant: ItemVariant
        }>(`/inventory/item/variant/${variantId}`, {
            method: 'PUT',
            body: {
                itemVariant: updated,
            },
        })

        upsertVariants(itemVariant)
    } catch (err) {
        $q.notify({
            message: err instanceof Error ? err.message : 'Unknown error',
        })
    } finally {
        variants[variantId].loading = false
    }
}

/// Must be called every time new variant added
const upsertVariants = (...add: ItemVariant[]) => {
    add.forEach((variant) => {
        variants[variant.id] = variantToDynamic(variant)
    })
}

type TableColumn = QTableColumn<ItemVariantDynamic, keyof ItemVariantDynamic>

const variantsSelected = ref<ItemVariantDynamic[]>([])
const variantsTableLoading = ref<boolean>(false)
const variantsTableFilter = ref<string>('')

const attrKey = (attr: Attribute) => `attr_${attr.id}`
const baseVariantsTableColumns: TableColumn[] = [
    {
        name: 'avatar',
        label: '',
        field: 'avatar',
        align: 'left',
        sortable: false,
    },
    {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left',
        sortable: true,
    },
    {
        name: 'description',
        label: 'Description',
        field: 'description',
        align: 'left',
    },
    {
        name: 'amountValue',
        label: 'Amount',
        field: 'amountValue',
        align: 'left',
        sortable: true,
    },
    {
        name: 'displayPrice',
        label: 'Price',
        field: 'displayPrice',
        align: 'left',
        sortable: true,
    },
]

const variantsTableColumns = computed<TableColumn[]>(() => {
    const columns = [...baseVariantsTableColumns]

    columns.push(...item.attributes?.map((itemAttr): TableColumn => ({
        name: attrKey(itemAttr.attr),
        label: itemAttr.attr.name,
        field: (row: ItemVariantDynamic) => row.attrMap?.[itemAttr.attr.id],
        align: 'left',
        sortable: true,
    })) ?? [])

    return columns
})

const deleteSelectedVariants = async () => {
    const variantsIds = variantsSelected.value.map(({ id }: ItemVariantDynamic) => id)
    variantsTableLoading.value = true
    try {
        await $apiFetch('/inventory/item/variant', {
            method: 'DELETE',
            body: {
                itemVariantIds: variantsIds,
            },
        })

        variantsIds.forEach((variantId) => {
            delete variants[variantId]
        })
        variantsSelected.value = []
    } catch (err) {
        console.log(err)
    } finally {
        variantsTableLoading.value = false
    }
}

const updateVariantAttr = async (variantId: ItemVariant['id'], attrId: Attribute['id'], value: AttrValue) => {
    try {
        const { itemVariantAttr } = await $apiFetch<{
            itemVariantAttr: ItemVariantAttr
        }>(`/inventory/item/variant/${variantId}/attr/${attrId}`, {
            method: 'PUT',
            body: {
                value,
            },
        })
        variants[variantId].attrMap[attrId] = itemVariantAttrToDynamic(itemVariantAttr)
    } catch (err) {
        console.log(err)
    }
}

const quickVariantAdd = ref<ItemVariantQuickAddList>({})
const quickVariantAddLoading = ref<boolean>(false)
const saveQuickVariantAdd = async (add: ItemVariantQuickAddList) => {
    quickVariantAddLoading.value = true

    try {
        const result = await $apiFetch<{
            itemVariants: ItemVariant[]
        }>(`/inventory/item/${item.id}/variant/quick`, {
            method: 'POST',
            body: {
                names: add.names,
                amountValueEach: add.amountValueEach,
                realPriceEach: add.realPriceEach,
            },
        })

        // result.itemVariants.forEach((variant) => {
        //     console.log('add variant', variant)
        //     variants[variant.id] = variantToDynamic(variant)
        // })

        upsertVariants(...result.itemVariants)

        quickVariantAdd.value = {}
    } catch (err) {
        console.log(err)
    } finally {
        quickVariantAddLoading.value = false
    }
}

const variantImageChanged = async (variantId: ItemVariantDynamic['id'], res: UploadResult) => {
    if (!res.res.images.length) {
        return
    }
    const { itemVariant: result } = await $apiFetch<{
        itemVariant: ItemVariant
    }>(`/inventory/item/variant/${variantId}`, {
        method: 'PUT',
        body: {
            itemVariantId: {
                avatarImageId: res.res.images[0].id,
            },
        },
    })

    variants[variantId] = variantToDynamic(result)
}
</script>

<style lang="scss">
.q-table__top {
    padding-right: 10px;
}

.editable-cell {
    transition: all .2s;
}

.editable-cell:hover {
    cursor: pointer;
    box-shadow: inset 0 5px 10px #ddd !important;
    color: $primary;
    // border-radius: 5px;
}
</style>
