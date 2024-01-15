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
                        icon="more_vert"
                        flat
                        class="absolute-top-right q-ma-md q-pa-sm"
                    >
                        <q-menu>
                            <q-list dense>
                                <DialogAreYouSure v-model="showMoveToTrashConfirmation" :message="`Move ${item.name} to trash?`" @yes="moveToTrash" />
                                <q-item v-close-popup clickable @click="showMoveToTrashConfirmation = true">
                                    <q-item-section side>
                                        <q-icon name="delete" size="xs" />
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label lines="1">
                                            Move to trash
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

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
                        <div v-if="!price.total && !price.perUnit" class="col text-h6 text-grey-6 text-center">
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

                    <q-popup-edit
                        v-slot="scope"
                        v-model="item.realPrice"
                        class="q-pa-xs"
                        @save="val => updateAndSaveItem('realPrice', val)"
                    >
                        <InventoryPriceInput
                            v-model="scope.value"
                            :currency="item.currency"
                            autofocus
                            @keyup.enter="scope.set"
                        />
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
                        <div v-else class="col">
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
                        class="row column q-pa-xs"
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
                            outlined
                            @keyup.enter="scope.set"
                        />
                    </q-popup-edit>
                </q-card>

                <q-card
                    v-if="displayBuyLists?.length"
                    bordered
                    flat
                    class="row item-prop-card justify-center"
                >
                    <q-card-section class="col row items-center q-pa-none q-px-md">
                        <div class="text-body1">
                            Appears in {{ displayBuyLists?.length }} buy lists
                        </div>
                        <q-popup-proxy class="column" max-width="13rem">
                            <q-list dense class="col">
                                <q-item
                                    v-for="(buyList, index) in displayBuyLists"
                                    :key="index"
                                    v-ripple
                                    clickable
                                    @click="navigateTo(buyList.buyListUrl)"
                                >
                                    <q-item-section>
                                        <q-item-label class="ellipsis">
                                            <span class="text-bold">{{ buyList.need }}{{ item.amountUnit.symbol }}</span>
                                            <span>
                                                in {{ buyList.name }}
                                            </span>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-popup-proxy>
                    </q-card-section>
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

                    <InventoryAttrBindModal v-model="showAddAttributeModal" :existing="Object.keys(item.attrMap)" @save="addItemAttribute" />
                </div>

                <div v-if="item.attrMap.length" class="col">
                    <q-list bordered separator class="rounded-borders">
                        <q-item v-for="(attr, id) in item.attrMap" :key="id" class="q-pr-sm item-attr-list-el">
                            <q-item-section class="col">
                                <q-item-label class="text-body1" lines="1">
                                    {{ attr.name }}
                                </q-item-label>

                                <q-item-label v-if="attr.description?.length" caption lines="2">
                                    {{ attr.description }}
                                </q-item-label>
                            </q-item-section>

                            <!-- <q-item-section class="col-grow item-attr-list-separator">
                                <q-separator spaced inset />
                            </q-item-section> -->

                            <q-item-section class="col-shrink cursor-pointer editable-cell rounded-borders">
                                <!-- <BadgeTooltip anchor="top start" :offset="[20, 0]" /> -->
                                <BadgeTooltip />

                                <q-item-label class="text-body2 q-px-md" lines="1">
                                    {{ attr.value }}
                                </q-item-label>

                                <q-popup-edit v-slot="scope" v-model="attr.value" auto-save @save="(val) => saveItemAttrValue(attr, val)">
                                    <InventoryAttrValueInput v-model="scope.value" :attr="attr" @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-item-section>

                            <!-- <q-item-section class="col-grow item-attr-list-separator">
                                <q-separator spaced inset />
                            </q-item-section> -->

                            <q-item-section class="col" side>
                                <div class="">
                                    <q-btn
                                        icon="more_horiz"
                                        flat
                                        dense
                                    >
                                        <q-menu auto-close>
                                            <q-list style="min-width: 100px">
                                                <q-item
                                                    v-close-popup
                                                    clickable
                                                    @click="item.attrMap[attr.id].showConfirmDelete = true"
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

                            <DialogAreYouSure
                                v-model="item.attrMap[attr.id].showConfirmDelete"
                                :message="`Are you sure you want to delete attribute '${attr.name}'? It will be deleted for all variants`"
                                @yes="deleteItemAttr(attr)"
                            />
                        </q-item>
                    </q-list>
                </div>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-section ref="variantsSection" class="row q-pt-none">
                <div dense class="col">
                    <InventoryItemVariantTable :item="item" />
                </div>
            </q-card-section>
        </q-card>
    </DefaultPage>
</template>

<script setup lang="ts">
import type { UploadResult } from '~/components/ImageUploader.vue'
import type { Image } from '~/models/Image'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { AttrValue, AttrWithValue, Attribute } from '~/models/inventory/Attribute'
import type { Item, ItemAttr } from '~/models/inventory/Item'

definePageMeta({
    validate: (route) => {
        if (route.name === 'inventory-item-id') {
            return /\d+/.test(route.params.id as string)
        }
        return false
    },
    middleware: ['auth'],
})

interface AmountDynamic {
    unit: AmountUnit
    value: number
}

type ItemDynamic =
    Omit<Item, 'attributes' | 'displayPrice'>
    & {
        attrMap: Record<Attribute['id'], ItemAttrDynamic>
    }

function itemToDynamic (item: Item): ItemDynamic {
    return {
        ...item,
        attrMap: mapIdList(item.attributes ?? [], itemAttr => itemAttr.attr.id, itemAttrToDynamic),
    }
}

const $q = useQuasar()
const { $apiUseFetch, $apiFetch } = useNuxtApp()
const route = useRoute('inventory-item-id')
const imageSlide = ref(0)
const imageGroupSize = 2

const { data, pending, error } = await $apiUseFetch<{
    item: Item
}>(() => `inventory/item/${route.params.id}`)

if (!data.value?.item) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    })
}

const originalItem: ItemDynamic = itemToDynamic({ ...data.value.item })
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

const itemFieldsLoading = reactive(mapValuesToDefault(item, false))
const itemFieldsChanged = computed(() => shallowDiff(pick(item, 'name', 'description', 'realPrice', 'amountUnitId'), pick(originalItem, 'name', 'description', 'realPrice', 'amountUnitId')))

const saveUpdatedItem = async (...fields: (keyof ItemDynamic)[]) => {
    const pickedFields = pick(item, ...fields)

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
            ...itemToDynamic(updated),
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
    }
}

const discardItemChanges = (...fields: (keyof ItemDynamic)[]) => {
    Object.assign(item, {
        ...item,
        ...pick(originalItem, ...fields),
    })
}

const updateAndSaveItem = <K extends keyof ItemDynamic> (field: K, value: ItemDynamic[K]) => {
    item[field] = value
    saveUpdatedItem(field)
}

// Amount //
const useVariantsAmount = computed<boolean>(() => !!item.variants?.length)
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
        await $apiFetch(`/inventory/item/${item.id}`, {
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
    itemDisplayPrice: string | null
    perUnit: string | null
}

const price = computed<DisplayPrice>(() => {
    const formatter = itemPriceFormatter()
    const itemDisplayPrice = item.realPrice ? formatter.format(item.realPrice) : null
    const total = item.totalPrice ? formatter.format(item.totalPrice) : null

    let perUnit: DisplayPrice['perUnit'] = null
    if (item.variants?.length) {
        const variantsPrices = new Set(item.variants.filter(({ realPrice }) => typeof realPrice === 'number').map(({ realPrice }) => realPrice!))
        if (variantsPrices.size > 1) {
            const min = Math.min(...variantsPrices)
            const max = Math.min(...variantsPrices)

            perUnit = formatter.formatRange(min, max)
        } else if (variantsPrices.size === 1) {
            perUnit = formatter.format([...variantsPrices][0])
        }
    }

    if (!perUnit && item.realPrice) {
        perUnit = itemDisplayPrice
    }

    return {
        total,
        itemDisplayPrice,
        perUnit,
    }
})

// Buy link //
// TODO: Preview
const displayBuyLink = computed<string | null>(() => {
    if (!item.buyLink) {
        return null
    }

    try {
        return new URL(item.buyLink).hostname
    } catch (err) {
        return 'Invalid URL'
    }
})

// Buy lists //
interface DisplayBuyList {
    name: string
    need: number
    buyListUrl: string
}

const displayBuyLists = computed<DisplayBuyList[] | null>(() => {
    if (!item.buyLists) {
        return null
    }

    return item.buyLists.reduce((buyLists: DisplayBuyList[], item) => {
        if (item.checked && item.itemVariantId !== null) {
            return buyLists
        }
        buyLists.push({
            name: item.buyList.name,
            need: item.amountValue,
            buyListUrl: `/inventory/buy-list/${item.buyListId}`,
        })
        return buyLists
    }, [])
})

// Attributes //
type ItemAttrDynamic = AttrWithValue & {
    loading: boolean
    showConfirmDelete: boolean
    itemAttrId: ItemAttr['id']
}

function itemAttrToDynamic (itemAttr: ItemAttr): ItemAttrDynamic {
    return {
        ...itemAttr.attr,
        itemAttrId: itemAttr.id,
        value: itemAttr.value,
        loading: false,
        showConfirmDelete: false,
    }
}

const showAddAttributeModal = ref<boolean>(false)
const addItemAttribute = async (addAttr: AttrWithValue) => {
    const { itemAttr } = await $apiFetch<{
        itemAttr: ItemAttr
    }>(`/inventory/item/${item.id}/attr/${addAttr.id}`, {
        method: 'POST',
        body: {
            value: addAttr.value,
        },
    })

    item.attrMap[itemAttr.attr.id] = itemAttrToDynamic(itemAttr)
}

const deleteItemAttr = async (attr: Attribute) => {
    try {
        await $apiFetch(`/inventory/item/${item.id}/attr/${attr.id}`, {
            method: 'DELETE',
        })

        delete item.attrMap[attr.id]
    } catch (err) {
        console.log(err)
    }
}

const saveItemAttrValue = async (attr: Attribute, value: AttrValue) => {
    try {
        item.attrMap[attr.id].loading = true

        const { itemAttr } = await $apiFetch<{
            itemAttr: ItemAttr
        }>(`/inventory/item/${item.id}/attr/${attr.id}`, {
            method: 'PUT',
            body: {
                value,
            },
        })

        item.attrMap[attr.id] = itemAttrToDynamic(itemAttr)
    } catch (err) {
        console.log(err)
    } finally {
        item.attrMap[attr.id].loading = false
    }
}

const variantsSection = ref<ComponentPublicInstance<HTMLDivElement> | null>(null)
const scrollToVariants = () => {
    variantsSection.value?.$el.scrollIntoView({
        behavior: 'smooth',
    })
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

// .item-attr-list-el::before {
//     background-color: grey;
//     width: 100%;
//     height: 2px;
//     content: '';
//     position: absolute;
//     top: 0; left: 0; bottom: 0; right: 0;
//     opacity: 0;
//     margin: auto;

//     transition: opacity .25s ease-in;
// }

// .item-attr-list-el .q-item__section {
//     background: white !important;
// }

// .item-attr-list-el:hover::before {
//     opacity: 0.5;
// }
</style>
