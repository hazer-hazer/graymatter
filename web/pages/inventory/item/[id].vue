<template>
    <DefaultPage>
        <InventoryTreePath v-if="item.path" :path="item.path" class="q-pb-md" />

        <div v-if="pending">
            <q-spinner-gears
                color="primary"
                size="3rem"
                class="absolute-center"
                :thickness="5"
            />
        </div>
        <div v-else-if="error">
            <pre>{{ error.message }}</pre>
        </div>
        <q-card v-else-if="item" class="col" flat bordered>
            <q-card-section class="row q-pa-none">
                <q-card-section class="row col q-pr-none">
                    <q-carousel
                        v-if="imageGroups.length && imageGroups[0]?.length"
                        v-model="imageSlide"
                        class="col"
                        swipeable
                        animated
                        arrows
                        control-color="black"
                        control-type="flat"
                        height="200px"
                    >
                        <q-carousel-slide v-for="(imgGroup, groupIndex) in imageGroups" :key="groupIndex" class="column no-wrap flex-center q-pa-none" :name="groupIndex">
                            <div class="row fit justify-start items-center q-gutter-xs no-wrap">
                                <q-img
                                    v-for="({image}, imgIndex) in imgGroup"
                                    :key="imgIndex"
                                    :src="image.src"
                                    spinner-color="primary"
                                    spinner-size="82px"
                                    class="rounded-borders col full-height"
                                />
                            </div>
                        </q-carousel-slide>
                    </q-carousel>
                    <div v-else class="row col items-center justify-center shadow-1 rounded-borders" style="height: 200px">
                        <q-icon
                            class="col"
                            name="photo_camera"
                            color="grey"
                            size="100px"
                            height="200px"
                        />
                    </div>
                    <!-- <q-file
                        v-model="addedPhotos"
                        class="col-3 full-height"
                        :counter-label="addPhotoCounter"
                        multiple
                        outlined
                        counter
                        use-chips
                        append
                    >
                        <template #prepend>
                            <q-icon name="attach_file" />
                        </template>
                        <template #append>
                            <q-icon v-show="addedPhotos.length > 0" name="close" class="cursor-pointer" @click.stop.prevent="addedPhotos = []" />
                        </template>
                    </q-file> -->
                    <q-btn
                        color="primary"
                        icon="add_photo_alternate"
                        class="absolute-bottom-right q-mr-xs"
                        round
                        @click="showItemImageUploader = true"
                    />
                    <ImageUploader v-model="showItemImageUploader" @uploaded="photoUploaded" />
                </q-card-section>
                <q-separator spaced inset vertical />
                <q-card-section class="col q-pl-none">
                    <q-btn
                        color="dark"
                        icon="more_vert"
                        flat
                        outline
                        class="absolute-top-right q-ma-md q-pa-sm"
                    >
                        <q-menu>
                            <q-list style="min-width: 120px">
                                <q-item v-close-popup clickable @click="showMoveToTrashConfirmation = true">
                                    <q-item-section>Move to trash</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

                    <DialogAreYouSure v-model="showMoveToTrashConfirmation" :message="`Move ${item.name} to trash?`" @yes="moveToTrash" />

                    <div class="row">
                        <span class="text-h5 ellipsis">{{ item.name }}</span>
                        <q-tooltip anchor="bottom start" :offset="[-45, 0]">
                            <span>Edit name</span><q-icon name="edit" class="q-pl-sm" />
                        </q-tooltip>
                        <q-popup-edit v-slot="scope" v-model="item.name" title="Edit item name" auto-save>
                            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </div>
                    <q-separator spaced />
                    <div class="row">
                        <p v-if="item.description?.trim().length" class="text-body2 col" style="white-space: normal; overflow-wrap: break-word;">
                            {{ item.description }}
                        </p>
                        <span v-else class="text-italic col">No description</span>
                        <q-tooltip anchor="bottom start" :offset="[-60, 0]">
                            <span>Edit description</span><q-icon name="edit" class="q-pl-sm" />
                        </q-tooltip>
                        <q-popup-edit v-slot="scope" v-model="item.description" title="Edit item description" auto-save>
                            <q-input
                                v-model="scope.value"
                                type="textarea"
                                dense
                                autofocus
                            />
                        </q-popup-edit>
                    </div>

                    <div v-if="itemFieldsChanged.name || itemFieldsChanged.description" class="row q-gutter-xs justify-end absolute-bottom q-mr-md q-mb-sm">
                        <q-btn
                            color="grey"
                            icon="close"
                            label="Discard changes"
                            outline
                            @click="discardItemChanges('name', 'description')"
                        />
                        <q-btn
                            color="primary"
                            icon="save"
                            label="Save changes"
                            outline
                            :loading="itemFieldsLoading.name || itemFieldsLoading.description"
                            @click="saveUpdatedItem('name', 'description')"
                        />
                    </div>
                </q-card-section>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-section v-if="item" class="q-py-none row q-gutter-sm">
                <q-card bordered flat class="item-prop-card">
                    <BadgeTooltip />

                    <q-card-section>
                        <q-inner-loading :showing="itemFieldsLoading.amountValue">
                            <q-spinner size="40px" color="primary" />
                        </q-inner-loading>

                        <span class="text-h6">{{ displayAmount }}{{ item.amountUnit.symbol }} in stock</span>
                        <q-tooltip :offset="[0, -10]">
                            {{ displayAmount }} {{ item.amountUnit.name }}
                        </q-tooltip>

                        <q-popup-edit
                            v-slot="scope"
                            v-model="amount"
                            max-width="300px"
                            buttons
                        >
                            <div class="column">
                                <InventoryAmountUnitSearch v-model="scope.value.unit" class="col" />
                                <InventoryAmountInput
                                    v-model="scope.value.value"
                                    :disable="useVariantsAmount"
                                    :hint="cannotChangeItemAmountHint"
                                    class="col"
                                    :amount-unit="scope.value.unit"
                                />
                            </div>

                            <!-- <div class="text-left">
                                    <span class="text-body2">Cannot update item amount because it has multiple variants</span>
                                    <q-space />
                                    <span class="text-caption text-weight-bold">You need to update each variant amount individually</span>
                                </div> -->
                        </q-popup-edit>

                        <DialogAreYouSure v-model="showConfirmAmountUnitChange" :message="`Are you sure you want to change amount unit from ${originalItem.amountUnit.name} to ${amount.unit.name}`" @yes="confirmChangeAmountUnit" />
                    </q-card-section>
                </q-card>

                <q-card bordered flat class="row item-prop-card justify-center items-center">
                    <BadgeTooltip />

                    <q-card-section class="col column" style="padding: 0 20px;">
                        <div v-if="item.price === null" class="col text-h6 text-grey-6 text-center">
                            set price
                        </div>

                        <div v-if="price.total !== null" class="col text-h6">
                            <span>{{ price.total }} in total</span>
                        </div>

                        <div v-if="price.perUnit" class="col text-caption text-center">
                            <span>{{ price.perUnit }}</span>
                            <span> each</span>
                        </div>
                    </q-card-section>

                    <q-popup-edit v-slot="scope" v-model="item.realPrice" @save="val => updateAndSaveItem('realPrice', val)">
                        <InventoryPriceInput v-model="scope.value" @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-card>

                <q-card
                    v-if="item.variants?.length"
                    bordered
                    flat
                    class="item-prop-card"
                    @click="scrollToVariants"
                >
                    <BadgeTooltip icon="arrow_downward" />

                    <q-card-section>
                        <span class="text-h6">
                            {{ item.variants.length }} variants
                        </span>
                    </q-card-section>
                </q-card>

                <q-card
                    bordered
                    flat
                    class="row item-prop-card justify-center"
                >
                    <BadgeTooltip />

                    <q-card-section class="col row items-center q-pa-none q-px-md">
                        <div v-if="!item.buyLink" class="text-h6 text-grey-6">
                            set buy link
                        </div>
                        <div class="col">
                            <div class="text-caption text-grey">
                                buy here:
                            </div>
                            <div class="text-body1 ellipsis">
                                {{ displayBuyLink }}
                            </div>
                            <!-- <q-space /> -->
                            <!-- <span class="text-caption text-grey">Ctrl+Click to open</span> -->
                        </div>
                    </q-card-section>

                    <q-popup-edit
                        v-slot="scope"
                        v-model="item.buyLink"
                        class="row column"
                        max-width="250px"
                        @save="val => updateAndSaveItem('buyLink', val)"
                    >
                        <q-btn
                            v-if="item.buyLink?.trim()?.length"
                            class="col row"
                            dense
                            no-caps
                            outline
                            :href="item.buyLink"
                            target="_blank"
                        >
                            <div class="ellipsis">
                                {{ displayBuyLink }}
                            </div>
                            <div class="q-pl-xs">
                                <q-icon name="open_in_new" />
                            </div>
                        </q-btn>

                        <q-input
                            v-model="scope.value"
                            class="col"
                            type="url"
                            label="Edit buy link"
                            autofocus
                            @keyup.enter="scope.set"
                        />
                    </q-popup-edit>
                </q-card>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-section class="q-py-none column q-gutter-sm">
                <div class="col row items-center">
                    <q-btn
                        class="col-auto"
                        icon="style"
                        label="Add attribute"
                        outline
                        @click="showAddAttributeModal = true"
                    />

                    <q-icon class="col-auto q-mx-sm" color="grey-6" size="xs" name="help_outline">
                        <q-tooltip class="text-caption bg-white text-dark shadow-1" max-width="300px">
                            Attributes are custom properties of item and its variants. For example, you can add "size" attribute which will denote the size of your shoe.
                        </q-tooltip>
                    </q-icon>

                    <InventoryAttrBindModal v-model="showAddAttributeModal" @save="addAttribute" />
                </div>

                <div v-if="attributes?.length" class="col">
                    <q-list bordered separator>
                        <q-item v-for="(attr, index) in attributes" :key="index">
                            <q-item-section class="col-6-md">
                                <q-item-label class="text-body1" lines="1">
                                    {{ attr.name }}
                                </q-item-label>
                                <q-item-label v-if="attr.description?.length" caption lines="2">
                                    {{ attr.description }}
                                </q-item-label>
                            </q-item-section>
                            <!-- <q-item-section class="col-grow">
                                <q-separator spaced inset />
                            </q-item-section> -->
                            <q-item-section class="col-auto cursor-pointer editable-cell rounded-borders">
                                <!-- <BadgeTooltip anchor="top start" :offset="[20, 0]" /> -->
                                <BadgeTooltip />

                                <q-item-label class="text-body2 q-px-md" lines="1">
                                    {{ attr.value }}
                                </q-item-label>

                                <q-popup-edit v-slot="scope" v-model="attr.value" auto-save @save="(val) => editItemAttrValue(attr, val)">
                                    <InventoryAttrValueInput v-model="scope.value" :attr="attr" @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-item-section>
                            <q-item-section class="col" side>
                                <div class="">
                                    <q-btn
                                        icon="more_horiz"
                                        flat
                                        dense
                                        round
                                    >
                                        <q-menu auto-close>
                                            <q-list style="min-width: 100px">
                                                <q-item
                                                    v-close-popup
                                                    clickable
                                                    @click="deleteItemAttr(attr)"
                                                >
                                                    <q-item-section class="text-red">
                                                        Delete
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-menu>
                                    </q-btn>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-section ref="variantsSection" class="row q-pt-none">
                <div dense class="col">
                    <q-table
                        v-model:selected="variantsSelected"
                        title="Variants"
                        :columns="variantsTableColumns"
                        :rows="variants ?? undefined"
                        row-key="id"
                        flat
                        bordered
                        selection="multiple"
                        :loading="itemFieldsLoading.variants"
                        style="max-height: 500px;"
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
                            <div v-else class="row q-gutter-sm">
                                <q-btn
                                    color="dark"
                                    icon="auto_awesome"
                                    label="Quickly add variants"
                                    outline
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
                                        <InventoryVariantQuickAddList v-model="scope.value" :amount-unit="item.amountUnit" />
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
                            </div>
                        </template>

                        <template #no-data>
                            <span class="text-italic text-caption">This item does not have variants</span>
                        </template>

                        <template #body="props">
                            <q-tr :props="props">
                                <q-td>
                                    <q-checkbox
                                        :model-value="props.selected"
                                        @update:model-value="(val) => {
                                            const selected = Object.getOwnPropertyDescriptor(props, 'selected')
                                            if (selected?.set) {
                                                selected.set(val)
                                            }
                                        }"
                                    />
                                </q-td>

                                <q-td
                                    key="avatar"
                                    v-ripple
                                    :props="props"
                                    auto-width
                                    class="editable-cell"
                                    @click="showVariantImageUploader[props.row.id] = true"
                                >
                                    <BadgeTooltip />
                                    <q-avatar v-if="props.row?.avatar?.src" rounded>
                                        <q-img
                                            :src="props.row.avatar.src"
                                            spinner-color="primary"
                                            spinner-size="20px"
                                            height="90%"
                                            class="rounded-borders"
                                        />
                                    </q-avatar>
                                    <q-avatar v-else icon="image" text-color="grey" />
                                    <!-- <q-tooltip
                                    anchor="center middle"
                                    self="center middle"
                                    transition-show="fade"
                                    transition-hide="fade"
                                    class="q-pa-md"
                                >
                                    <q-icon name="add_photo_alternate" size="24px" />
                                </q-tooltip> -->
                                    <ImageUploader v-model="showVariantImageUploader[props.row.id]" :multiple="false" @uploaded="res => variantImageChanged(props.row.id, res)" />
                                </q-td>

                                <q-td
                                    key="name"
                                    v-ripple
                                    :props="props"
                                    auto-width
                                    class="editable-cell"
                                >
                                    <BadgeTooltip />
                                    <q-badge v-if="props.row.isNew" color="primary" label="new" />
                                    <span class="text-body2">{{ props.row.name }}</span>
                                    <q-popup-edit v-slot="scope" v-model="props.row.name">
                                        <q-input
                                            v-model="scope.value"
                                            label="Name"
                                            dense
                                            autofocus
                                            @keyup.enter="scope.set"
                                        />
                                    </q-popup-edit>
                                </q-td>

                                <q-td key="description" v-ripple :props="props" class="editable-cell">
                                    <BadgeTooltip />
                                    <div class="row">
                                        <span v-if="props.row?.description?.length" class="ellipsis" style="max-width: 400px; overflow: hidden; display: inline-block;">{{ props.row.description }}</span>
                                        <span v-else class="text-italic">No description</span>
                                        <q-tooltip v-if="props.row?.description?.length > 20" max-width="400px" style=" overflow-wrap: anywhere; word-break: normal;">
                                            {{ props.row.description }}
                                        </q-tooltip>
                                    </div>
                                </q-td>

                                <q-td key="amountValue" v-ripple :props="props" class="editable-cell">
                                    <BadgeTooltip />
                                    <span class="text-subtitle1">{{ props.row.amountValue }}</span>

                                    <q-popup-edit v-slot="scope" v-model="props.row.amountValue">
                                        <InventoryAmountInput v-model="scope.value" :amount-unit="item.amountUnit" @keyup.enter="scope.set" />
                                    </q-popup-edit>
                                </q-td>

                                <q-td key="displayPrice" v-ripple :props="props" class="editable-cell">
                                    <BadgeTooltip />
                                    <span v-if="props.row.displayPrice" class="text-subtitle1">{{ props.row.displayPrice }}</span>
                                    <div v-else class="row items-center q-gutter-xs">
                                        <span class="text-subtitle1">{{ item.displayPrice }}</span>
                                        <span class="text-grey">(from item)</span>
                                    </div>

                                    <q-popup-edit v-slot="scope" v-model="props.row.realPrice">
                                        <InventoryPriceInput v-model="scope.value" @keyup.enter="scope.set" />
                                    </q-popup-edit>
                                </q-td>

                                <q-td
                                    v-for="(attr) in attributes"
                                    :key="attrKey(attr)"
                                    v-ripple
                                    :props="props"
                                    class="editable-cell"
                                >
                                    <BadgeTooltip />

                                    <span v-if="props.row.attrMap?.[attr.id]" class="text-subtitle1">{{ props.row[attr.id].value }}</span>
                                    <div v-else class="row items-center q-gutter-xs">
                                        <span class="text-subtitle1">{{ attr.value }}</span>
                                        <span class="text-grey">(from item)</span>
                                    </div>

                                    <q-popup-edit
                                        v-slot="scope"
                                        :model-value="props.row.attrMap?.[attr.id] ?? null"
                                        @update:model-value="set => {
                                            props.row.attrMap ??= {}
                                            props.row.attrMap[attr.id] = set
                                        }"
                                    >
                                        <InventoryAttrValueInput v-model="scope.value" :attr="attr" @keyup.enter="scope.set" />
                                    </q-popup-edit>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>
            </q-card-section>
        </q-card>

        <InventoryVariantCreateModal v-if="item" v-model="showVariantCreateModal" :item="item" @save="newVariantSaved" />
    </DefaultPage>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import type { ComponentPublicInstance } from 'vue'
import type { UploadResult } from '~/components/ImageUploader.vue'
import type { ItemVariantQuickAddList } from '~/components/inventory/variant/InventoryVariantQuickAddList.vue'
import type { Image } from '~/models/Image'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { AttrValue, AttrWithValue, Attribute } from '~/models/inventory/Attribute'
import type { Item } from '~/models/inventory/Item'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

interface AmountDynamic {
    unit: AmountUnit
    value: number
}

type ItemDynamic = Item & {
    variants?: ItemVariantDynamic[]
}

function itemToDynamic (item: Item): ItemDynamic {
    return {
        ...item,
        variants: item.variants?.map(variantToDynamic),
    }
}

definePageMeta({
    validate: (route) => {
        if (route.name === 'inventory-item-id') {
            return /\d+/.test(route.params.id as string)
        }
        return false
    },
    middleware: ['auth'],
})

const $q = useQuasar()
const route = useRoute('inventory-item-id')
const imageSlide = ref(0)
const imageGroupSize = 2

const { $apiUseFetch, $apiFetch } = useNuxtApp()

const { data, pending, error } = await $apiUseFetch<{
    item: Item
}>(() => `inventory/item/${route.params.id}`)

if (!data.value?.item) {
    throw new Error('kek')
}

const originalItem: Item = { ...data.value.item }
const item = reactive<ItemDynamic>(itemToDynamic(data.value.item))

if (item.path) {
    inventoryLocation().value = item?.path.segments
}

useHead({
    title: `Item ${item.name}`,
})

function itemPriceFormatter () {
    return priceFormatter(data.value!.item.currency)
}

const imageGroups = computed(() => {
    if (item.images?.length) {
        return [
            [item.images?.[0]],
            ...chunk(item?.images?.slice(1) ?? [], imageGroupSize),
        ]
    }
    return []
})

const showItemImageUploader = ref<boolean>(false)
const photoUploaded = async (res: UploadResult) => {
    for await (const image of res.res.images) {
        await $apiFetch<{
            itemId: Item['id']
            imageId: Image['id']
        }>(`/inventory/item/${data.value?.item.id}/image/${image.id}`, {
            method: 'POST',
        })
        item.images?.unshift({
            image,
        })
    }
}

const itemFieldsLoading = reactive(mapValues(item, false))
const itemFieldsChanged = computed(() => shallowDiff(item, originalItem))

const saveUpdatedItem = async (...fields: (keyof Item)[]) => {
    const pickedFields = pick(item, fields)

    console.log('[saveUpdatedItem] updates changes on', fields, pickedFields)

    let success = false
    try {
        assignPicked(itemFieldsLoading, fields, true)
        const { item: updated } = await $apiFetch<{item: Item}>(`/inventory/item/${data.value?.item.id}`, {
            method: 'PUT',
            body: {
                item: pickedFields,
            },
        })

        Object.assign(item, {
            ...item,
            ...updated,
        })
        Object.assign(originalItem, {
            ...item,
        })
        success = true
    } catch (err) {
        if (!success) {
            discardItemChanges(...fields)
        }

        if (err instanceof Error) {
            $q.notify({
                type: 'negative',
                message: err.message,
            })
        }
    } finally {
        assignPicked(itemFieldsLoading, fields, false)
        console.log('changed', itemFieldsChanged.value)
    }
}

const discardItemChanges = (...fields: (keyof Item)[]) => {
    console.log('discard changes on', fields)

    Object.assign(item, {
        ...item,
        ...pick(originalItem, fields),
    })
}

const updateAndSaveItem = <K extends keyof ItemDynamic> (field: K, value: ItemDynamic[K]) => {
    console.log(`set item.${field} = ${value}`, 'from', item[field])

    item[field] = value
    console.log(`item.${field} = ${item[field]}`)

    saveUpdatedItem(field)
}

// Amount //
const useVariantsAmount = computed<boolean>(() => !!variants.value?.length)
const displayAmount = computed<number>(() => useVariantsAmount.value ? item.variantsAmountSum! : item.amountValue)
const cannotChangeItemAmountHint = computed<string | null>(() => useVariantsAmount.value ? 'You need to update each variant amount individually' : null)

const showConfirmAmountUnitChange = ref<boolean>(false)
const confirmChangeAmountUnit = () => {
    saveUpdatedItem('amountUnitId')
}

const amount = computed<AmountDynamic>({
    get () {
        return {
            unit: item.amountUnit,
            value: displayAmount.value,
        }
    },
    set (val: AmountDynamic) {
        console.log('set amount', val)

        item.amountUnit = val.unit
        item.amountUnitId = val.unit.id
        item.amountValue = val.value

        if (originalItem.amountUnitId !== val.unit.id) {
            showConfirmAmountUnitChange.value = true
        }

        if (originalItem.amountValue !== val.value) {
            saveUpdatedItem('amountValue')
        }
    },
})

// Item options menu //
const showMoveToTrashConfirmation = ref<boolean>(false)
const moveToTrash = async () => {
    try {
        await $apiFetch(`/inventory/item/:${item.id}`, {
            method: 'DELETE',
        })
        $q.notify({
            type: 'positive',
            message: `Successfully trashed item ${item.name}`,
        })
    } catch (err) {
        if (err instanceof Error) {
            $q.notify({
                type: 'negative',
                message: err.message,
            })
        } else {
            $q.notify({
                type: 'negative',
                message: 'Something went wrong',
            })
        }
    }
}

// Price //
interface DisplayPrice {
    total: string | null
    perUnit?: string
}

const price = computed<DisplayPrice>({
    get () {
        const formatter = itemPriceFormatter()
        const total = item.totalPrice ? formatter.format(item.totalPrice) : null

        let perUnit: DisplayPrice['perUnit']
        if (item.variants?.length) {
            const variantsPrices = new Set(item.variants.filter(({ realPrice }) => realPrice !== null).map(({ realPrice }) => realPrice!))
            if (variantsPrices.size > 1) {
                const min = Math.min(...variantsPrices)
                const max = Math.min(...variantsPrices)
                perUnit = formatter.formatRange(min, max)
            } else if (variantsPrices.size === 1) {
                perUnit = formatter.format([...variantsPrices][0])
            }
        }

        if (!perUnit && item.realPrice) {
            perUnit = formatter.format(item.realPrice)
        }

        return {
            total,
            perUnit,
        }
    },
    set (_val: DisplayPrice) {
        // Nothing
    },
})

// Buy link //
// TODO: Preview
const displayBuyLink = computed<string | null>(() => {
    if (!item.buyLink) {
        return null
    }

    const url = new URL(item.buyLink)
    return url.hostname
})

// Attributes //
const showAddAttributeModal = ref<boolean>(false)
const attributes = computed<AttrWithValue[] | null>({
    get () {
        return item.attributes?.map(({ attr, value }) => ({
            ...attr,
            value,
            loading: false,
        })) ?? null
    },
    set (attrs) {
        if (attrs) {
            item.attributes = attrs.map(({ value, ...attr }) => ({
                attr,
                value,
            }))
        }
    },
})

const addAttribute = async (addAttr: AttrWithValue) => {
    console.log('add attr', addAttr)

    const { itemAttr } = await $apiFetch<{
        itemAttr: {
            attr: Attribute
            value: AttrValue
        }
    }>(`/inventory/item/${item.id}/attr/${addAttr.id}`, {
        method: 'POST',
        body: {
            value: addAttr.value,
        },
    })

    console.log('response', itemAttr)

    item.attributes ??= []
    item.attributes.push(itemAttr)
}

const deleteItemAttr = async (attr: Attribute) => {
    try {
        await $apiFetch(`/inventory/item/${item.id}/attr/${attr.id}`, {
            method: 'DELETE',
        })
        if (item.attributes) {
            item.attributes = item.attributes.filter(({ attr: { id } }) => id !== attr.id)
        }
    } catch (err) {
        console.log(err)
    }
}

const editItemAttrValue = async (attr: Attribute, value: AttrValue) => {
    try {
        const { itemAttr } = await $apiFetch<{
            itemAttr: {
                attr: Attribute,
                value: AttrValue,
            }
        }>(`/inventory/item/${item.id}/attr/${attr.id}`, {
            method: 'PUT',
            body: {
                value,
            },
        })

        const attrIndex = item.attributes?.findIndex(({ attr: { id } }) => id === attr.id) ?? -1
        if (attrIndex !== -1) {
            item.attributes ??= []
            item.attributes[attrIndex] = itemAttr
        }
    } catch (err) {
        console.log(err)
    }
}

// Variants //
type ItemVariantDynamic = ItemVariant & {
    isNew?: boolean
    displayPrice?: string | null
    attrMap: Record<Attribute['id'], AttrWithValue> | null
}

function variantToDynamic (variant: ItemVariant): ItemVariantDynamic {
    return {
        ...variant,
        isNew: false,
        displayPrice: variant.realPrice ? itemPriceFormatter().format(variant.realPrice) : null,
        attrMap: variant.attributes ? mapIdList(variant.attributes, ({ itemAttr: { attr } }) => attr.id) : null,
    }
}

const showVariantCreateModal = ref<boolean>(false)

const variantsSection = ref<ComponentPublicInstance<HTMLDivElement> | null>(null)
const scrollToVariants = () => {
    variantsSection.value?.$el.scrollIntoView({
        behavior: 'smooth',
    })
}

const variants = computed<ItemVariantDynamic[] | null>({
    get () {
        return item.variants?.map(variantToDynamic) ?? null
    },
    set (val: ItemVariantDynamic[] | null) {
        if (val) {
            item.variants = val
        }
    },
})

/// Must be called every time new variant added
const newVariantSaved = (...variants: ItemVariant[]) => {
    item?.variants?.push(...variants.map(variantToDynamic))
    Object.assign(showVariantImageUploader, mapIdList(item.variants ?? [], 'id', () => false))
}

type TableColumn = QTableColumn<ItemVariantDynamic, keyof ItemVariantDynamic>

const variantsSelected = ref<ItemVariantDynamic[]>([])

const attrKey = (attr: AttrWithValue) => `attr_${attr.id}`
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
    const columns = baseVariantsTableColumns
    if (attributes.value) {
        columns.push(...attributes.value.map((attr): TableColumn => ({
            name: attrKey(attr),
            label: attr.name,
            field: (row: ItemVariantDynamic) => row.attrMap?.[attr.id],
            align: 'left',
            sortable: true,
        })))
    }
    console.log('columns', columns)
    return columns
})

const deleteSelectedVariants = async () => {
    const variantsIds = variantsSelected.value.map(({ id }: ItemVariantDynamic) => id)
    itemFieldsLoading.variants = true
    try {
        await $apiFetch('/inventory/item/variant', {
            method: 'DELETE',
            body: {
                variants: variantsIds,
            },
        })
        item.variants = item.variants?.filter((variant: ItemVariantDynamic) => !variantsIds.includes(variant.id))
        variantsSelected.value = []
    } catch (err) {
        console.log(err)
    } finally {
        itemFieldsLoading.variants = false
    }
}

const updateVariant = async<K extends keyof ItemVariant>(id: ItemVariant['id'], field: K, val: ItemVariant[K]) => {
    console.log('todo updateVariant')
}

const updateVariantAttr = async (id: ItemVariant['id'], attrId: Attribute['id'], val: AttrValue) => {
    try {
        const result = await $apiFetch<>(`/inventory/item/variant/attr`)
    }
}

// TODO: Fix variants saving `computed` cannot be set
const quickVariantAdd = ref<ItemVariantQuickAddList>({})
const quickVariantAddLoading = ref<boolean>(false)
const saveQuickVariantAdd = async (variants: ItemVariantQuickAddList) => {
    console.log('save quick variant add', variants)

    quickVariantAddLoading.value = true

    try {
        const result = await $apiFetch<{
            variants: ItemVariant[]
        }>(`/inventory/item/${item?.id}/variant/quick`, {
            method: 'POST',
            body: {
                names: variants.names,
                amountValueEach: variants.amountValueEach,
                realPriceEach: variants.realPriceEach,
            },
        })

        quickVariantAdd.value = {}
        newVariantSaved(...result.variants)
    } catch (err) {
        console.log(err)
    } finally {
        quickVariantAddLoading.value = false
    }
}

const showVariantImageUploader = reactive<Record<ItemVariant['id'], boolean>>(mapIdList(item.variants ?? [], 'id', false))
const variantImageChanged = async (id: ItemVariantDynamic['id'], res: UploadResult) => {
    if (!item || !item.variants?.length) {
        throw new Error('kek')
    }
    if (!res.res.images.length) {
        return
    }
    const { variant: result } = await $apiFetch<{
        variant: ItemVariant
    }>(`/inventory/item/variant/${id}`, {
        method: 'PUT',
        body: {
            variant: {
                avatarImageId: res.res.images[0].id,
            },
        },
    })

    const index = item.variants.findIndex(variant => variant.id === id)

    item.variants[index] = variantToDynamic(result)
}
</script>

<style lang="scss" scoped>
.thead-sticky tr > * {
    position: sticky;
    z-index: 1;
    background-color: white;
}

.thead-sticky tr:last-child > * {
    top: 0;
}

.item-prop-card {
    max-width: 200px;
    max-height: 70px;
    transition: box-shadow .2s;
}

.item-prop-card:hover {
    cursor: pointer;
    box-shadow: 0 5px 10px #ddd !important;
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
