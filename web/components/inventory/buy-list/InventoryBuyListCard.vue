<template>
    <q-card
        bordered
        flat
    >
        <DialogAreYouSure v-model="buyList.showConfirmDelete" :message="`Are you sure you want to delete buy list '${buyList.name}'?`" @yes="() => deleteBuyList(buyList.id)" />
        <DialogAreYouSure v-model="buyList.showConfirmClear" :message="`Are you sure you want to clear buy list '${buyList.name}'?`" @yes="() => clearBuyList(buyList.id)" />

        <q-card-section class="q-py-sm">
            <div class="absolute-top-right q-ma-sm">
                <q-btn
                    icon="more_vert"
                    flat
                    dense
                    color="grey-8"
                >
                    <q-menu>
                        <q-list style="min-width: 150px" dense>
                            <q-item>
                                <q-item-section>
                                    <q-toggle
                                        v-model="buyList.watch"
                                        color="primary"
                                        label="Watch"
                                        icon="visibility"
                                        dense
                                        @update:model-value="watch => updateBuyList(buyList.id, {watch})"
                                    />
                                    <q-tooltip :delay="400" class="neutral-tooltip" max-width="20rem">
                                        {{ whatIsWatchOptionText }}
                                    </q-tooltip>
                                </q-item-section>
                            </q-item>
                            <template v-if="!buyList.watch">
                                <q-separator />
                                <q-item v-close-popup clickable @click="checkAll(buyList.id, true)">
                                    <q-item-section side>
                                        <q-icon name="check" size="xs" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>
                                            Check all
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-close-popup clickable @click="checkAll(buyList.id, false)">
                                    <q-item-section side>
                                        <q-icon name="check_box_outline_blank" size="xs" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>
                                            Uncheck all
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                            <q-separator />
                            <q-item v-close-popup clickable class="text-red" @click="buyList.showConfirmClear = true">
                                <q-item-section side>
                                    <q-icon name="clear_all" size="xs" color="red" />
                                </q-item-section>
                                <q-item-section>
                                    Clear list
                                </q-item-section>
                            </q-item>
                            <q-item v-close-popup clickable class="text-red" @click="buyList.showConfirmDelete = true">
                                <q-item-section side>
                                    <q-icon name="delete" size="xs" color="red" />
                                </q-item-section>
                                <q-item-section>
                                    Delete
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>

            <div class="text-h6">
                {{ buyList.name }}
            </div>
            <div class="text-body2">
                {{ buyList.description }}
            </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-none column q-pa-sm">
            <q-list
                v-if="Object.values(buyList.items).length"
                bordered
                dense
                class="col rounded-borders"
            >
                <q-item
                    v-for="item in Object.values(buyList.items).toSorted((lhs, rhs) => {
                        if (lhs.checked === rhs.checked) {
                            return 0
                        }
                        return lhs.checked ? 1 : -1
                    })"
                    :key="item.id"
                    class="buy-list-item"
                    :class="item.checked ? 'checked' : ''"
                >
                    <q-item-section avatar>
                        <q-checkbox v-model="item.checked" @update:model-value="checked => updateItem(buyList.id, item.id, {checked})" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="buy-list-item-name" lines="1" @click="navigateTo(item.url, {open: {target: '_blank'}})">
                            {{ item.displayName }}
                            <q-icon
                                class="buy-list-item-goto-icon"
                                name="open_in_new"
                            />
                        </q-item-label>
                        <q-item-label v-if="item.caption" caption>
                            {{ item.caption }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section thumbnail class="no-padding">
                        <q-btn icon="more_horiz" dense flat class="buy-list-item-open-menu">
                            <q-menu>
                                <q-list style="min-width: 100px" dense>
                                    <q-item v-close-popup class="text-red" clickable @click="deleteItem(buyList.id, item.id)">
                                        <q-item-section side>
                                            <q-icon name="delete" size="xs" color="red" />
                                        </q-item-section>
                                        <q-item-section>
                                            Delete from list
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                    </q-item-section>
                    <q-separator inset vertical class="q-ml-xs" />
                    <q-item-section
                        v-if="item.amount"
                        side
                        class="buy-list-item-amount"
                        :class="item.amount.stockValue >= item.amountValue ? 'sufficient' : ''"
                    >
                        {{ item.amount.stockValue }}/{{ item.amountValue }}{{ item.amount.amountUnit.symbol }}

                        <q-popup-edit
                            v-if="!item.checked"
                            v-slot="scope"
                            v-model="item.amountValue"
                            class="q-pa-none"
                            @save="amountValue => updateItem(buyList.id, item.id, {amountValue})"
                        >
                            <InventoryAmountInput
                                v-model="scope.value"
                                :amount-unit="item.amount.amountUnit"
                                autofocus
                                @keyup.enter="scope.set"
                            />
                        </q-popup-edit>
                    </q-item-section>
                </q-item>
            </q-list>
            <div v-else class="col text-italic text-caption text-center q-pa-xs">
                No items
            </div>

            <q-btn
                icon="add"
                outline
                color="grey-7"
                class="col q-mt-sm q-pa-sm"
                dense
            >
                <q-popup-edit
                    v-slot="scope"
                    v-model="buyList.addItem"
                    buttons
                    label-set="Add"
                    @save="item => addItem(buyList.id, item)"
                >
                    <div class="column q-gutter-sm">
                        <InventoryItemQuickSearchSelect
                            v-model="scope.value.item"
                            :exclude-items="buyList.excludeItemSearch"
                            :exclude-item-variants="buyList.excludeItemVariantsSearch"
                        />
                        <InventoryAmountInput v-model="scope.value.amountValue" :amount-unit="scope.value.item?.amountUnit" />
                    </div>
                </q-popup-edit>
            </q-btn>
        </q-card-section>

        <q-icon
            v-if="statusBadge"
            :name="statusBadge.icon"
            :color="statusBadge.color"
            class="buy-list-status-badge"
            size="xs"
        >
            <q-tooltip>
                Amount of all items in list is sufficient
            </q-tooltip>
        </q-icon>
    </q-card>
</template>

<script setup lang="ts">
import type { ItemQuickSearchOption } from '~/components/inventory/item/InventoryItemQuickSearchSelect.vue'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { BuyList, BuyListItem } from '~/models/inventory/BuyList'
import type { Item } from '~/models/inventory/Item'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

// TODO: i18n
const whatIsWatchOptionText = 'When item\'s amount will be sufficient, it will be automatically checked in this list'

const props = defineProps<{
    buyList: BuyList
}>()

const emit = defineEmits<{
    'delete': [buyList: BuyList],
}>()

const { $apiFetch } = useNuxtApp()

const buyList = reactive<BuyListDynamic>(buyListToDynamic(props.buyList))

const applyBuyListChanges = (updated: BuyList) => {
    Object.assign(buyList, buyListToDynamic(updated))
}

type BuyListDynamic = Omit<BuyList, 'items'> & {
    items: Record<BuyListItem['id'], BuyListItemDynamic>
    showConfirmDelete: boolean
    showConfirmClear: boolean
    excludeItemSearch: Item['id'][]
    excludeItemVariantsSearch: ItemVariant['id'][]
    allChecked: boolean
    addItem: {
        item: ItemQuickSearchOption | null
        amountValue: number | null
    }
}

function buyListItemToDynamic (item: BuyListItem): BuyListItemDynamic {
    const amountValueInStock = item.itemVariant?.amountValue ?? item.item?.amountValue ?? null

    return {
        ...item,
        displayName: item.itemVariant?.name ?? item.item?.name ?? item.name ?? 'Unknown',
        caption: item.itemVariant?.name ?? item.item?.name ?? null,
        url: `/inventory/item/${item.itemId}`,
        ...amountValueInStock !== null && item.item
            ? {
                amount: {
                    stockValue: item.itemVariant?.amountValue ?? item.item.amountValue,
                    amountUnit: item.item.amountUnit,
                },
            }
            : { amount: null },
    }
}

type BuyListItemDynamic = Pick<BuyListItem,
    | 'amountValue'
    | 'checked'
    | 'id'
> & {
    displayName: string
    caption: string | null
    url: string | null
    amount: {
        stockValue: number
        amountUnit: AmountUnit
    } | null
}

function buyListToDynamic (buyList: BuyList): BuyListDynamic {
    const excludeItemSearch = [...new Set(buyList.items.reduce((itemsWoVariants: Item['id'][], { itemVariantId, id }) => {
        if (!itemVariantId && id !== null) {
            itemsWoVariants.push(id)
        }
        return itemsWoVariants
    }, []))]

    return {
        ...buyList,
        items: mapIdList(buyList.items, 'id', buyListItemToDynamic),
        showConfirmDelete: false,
        showConfirmClear: false,
        allChecked: buyList.items.every(item => item.checked),
        excludeItemSearch,
        excludeItemVariantsSearch: buyList.items.reduce((ids: ItemVariant['id'][], { itemVariantId }) => {
            if (itemVariantId) {
                ids.push(itemVariantId)
            }
            return ids
        }, []),
        addItem: {
            item: null,
            amountValue: null,
        },
    }
}

// Note: Had some big problems with reactivity and list rending of buyListItems
// const displayBuyLists = computed(() => Object.values(buyLists).map((buyList) => {
//     console.log('computed', buyList)

//     return Object.assign(buyList, {
//         allChecked: Object.values(buyList.items).every(item => item.checked),
//         items: Object.values(buyList.items).map(item => Object.assign(item, {
//             amountValueSufficient: item.amountValueInStock >= item.amountValue,
//         })).toSorted((lhs, rhs) => {
//             if (lhs.checked === rhs.checked) {
//                 return 0
//             }
//             return lhs.checked ? 1 : -1
//         }),
//     })
// }))

// const allItemsChecked = computed(() => {
//     return Object.values(buyList.items).every(item => item.checked)
// })

// const allItemsSufficient = computed(() => {
//     return Object.values(buyList.items).every(item => (item.amount?.stockValue ?? -1) > item.amountValue)
// })

const statusBadge = computed<{icon: string, color: string} | null>(() => {
    const items = Object.values(buyList.items)
    if (items.every(item => item.checked)) {
        return { icon: 'check', color: 'green' }
    }

    if (items.every(item => (item.amount?.stockValue ?? -1) > item.amountValue)) {
        return { icon: 'inventory', color: 'yellow' }
    }

    return null
})

const deleteBuyList = async (id: BuyList['id']) => {
    try {
        const { buyList } = await $apiFetch<{buyList: BuyList}>(`/inventory/buy-list/${id}`, {
            method: 'DELETE',
        })

        emit('delete', buyList)
    } catch (err) {
        console.error(err)
    }
}

const clearBuyList = async (id: BuyList['id']) => {
    try {
        const cleared = await $apiFetch<{
            buyList: BuyList
        }>(`/inventory/buy-list/${id}/clear`, {
            method: 'POST',
        })

        applyBuyListChanges(cleared.buyList)
    } catch (err) {
        console.error(err)
    }
}

const updateBuyList = async (buyListId: BuyList['id'], updated: Partial<BuyListDynamic>) => {
    try {
        const result = await $apiFetch<{
            buyList: BuyList
        }>(`/inventory/buy-list/${buyListId}`, {
            method: 'PUT',
            body: {
                buyList: updated,
            },
        })

        applyBuyListChanges(result.buyList)
    } catch (err) {
        console.error(err)
    }
}

// Items //
const checkAll = async (buyListId: BuyList['id'], checked: boolean) => {
    try {
        const result = await $apiFetch<{
            buyList: BuyList
        }>(`/inventory/buy-list/${buyListId}/check-all`, {
            method: 'POST',
            body: {
                checked,
            },
        })

        applyBuyListChanges(result.buyList)
    } catch (err) {
        console.error(err)
    }
}

const addItem = async (buyListId: BuyList['id'], add: {
    item: ItemQuickSearchOption
    amountValue: number
}) => {
    try {
        const { buyListItem } = await $apiFetch<{
            buyListItem: BuyListItem
        }>(`/inventory/buy-list/${buyListId}/item`, {
            method: 'POST',
            body: {
                buyListItem: {
                    itemId: add.item.itemId,
                    itemVariantId: add.item.itemVariantId,
                    amountValue: add.amountValue,
                },
            },
        })

        buyList.items[buyListItem.id] = buyListItemToDynamic(buyListItem)
    } catch (err) {
        console.error(err)
    }
}

const updateItem = async (buyListId: BuyList['id'], itemId: BuyListItem['id'], updated: Partial<BuyListItem>) => {
    try {
        const { buyListItem } = await $apiFetch<{
            buyListItem: BuyListItem
        }>(`/inventory/buy-list/${buyListId}/item/${itemId}`, {
            method: 'PUT',
            body: {
                buyListItem: updated,
            },
        })

        buyList.items[buyListItem.id] = buyListItemToDynamic(buyListItem)
    } catch (err) {
        console.error(err)
    }
}

const deleteItem = async (buyListId: BuyList['id'], itemId: BuyListItem['id']) => {
    try {
        const { buyListItem } = await $apiFetch<{
            buyListItem: BuyListItem
        }>(`/inventory/buy-list/${buyListId}/item/${itemId}`, {
            method: 'DELETE',
        })

        delete buyList.items[buyListItem.id]
    } catch (err) {
        console.error(err)
    }
}

// TODO: SlideItem
</script>

<style scoped lang="scss">
.buy-list-item {
    &::before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 1px;
        top: 0; bottom: 0; left: 0;
        margin: auto;
        margin-left: 5%;
        background-color: #aaa;
        transition: width .2s;
    }

    &.checked::before {
        width: 90%;
    }

    .buy-list-item-open-menu {
        opacity: 0;
        transition: opacity .2s ease;
    }

    &:hover {
        .buy-list-item-open-menu {
            opacity: 1;
        }
    }

    // &:hover:not(:has(*:hover)) {
    //     background-color: #f0f0f0;
    // }
}

.buy-list-status-badge {
    position: absolute;
    top: -10px;
    left: -12px;
    background-color: white;
    padding: 5px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px $grey-5;
}

.buy-list-item-goto-icon {
    transition: opacity .2s ease;
    opacity: 0;
}

.buy-list-item-name {
    cursor: pointer;
    transition: color .2s ease;

    &:hover {
        color: $primary;

        .buy-list-item-goto-icon {
            opacity: 1;
        }
    }
}

.buy-list-item-amount {
    &.sufficient {
        text-decoration: underline;
        color: $primary;
    }
}

.buy-list-item:not(.checked) {
    .buy-list-item-amount {
        transition: color .2s ease;
        cursor: pointer;
    }

    .buy-list-item-amount:hover {
        color: $primary;
    }
}
</style>
