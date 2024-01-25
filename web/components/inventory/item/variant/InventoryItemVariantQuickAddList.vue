<template>
    <div>
        <InputSelectUniqueChips
            v-model="variants.names"
            label="Variants"
            style="min-width: 330px;"
        />

        <div class="row q-pt-md q-gutter-xs">
            <inventory-amount-input
                v-model="variants.amountValueEach"
                class="col"
                dense
                label="Amount of each"
                :amount-unit="amountUnit"
                hide-bottom-space
            />
            <inventory-price-input
                v-model="variants.realPriceEach"
                class="col"
                :currency="currency"
                dense
                label="Price of each"
                clearable
                hide-bottom-space
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Currency } from '~/models/Currency'
import type { AmountUnit } from '~/models/inventory/AmountUnit'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

export interface ItemVariantQuickAddList {
    names?: string[]
    amountValueEach?: ItemVariant['amountValue'] | null
    realPriceEach?: ItemVariant['realPrice'] | null
}

const props = defineProps<{
    modelValue: ItemVariantQuickAddList
    amountUnit: AmountUnit
    currency: Currency
}>()

const amountUnit = toRef(props, 'amountUnit')
const emit = defineEmits<{
    'update:modelValue': [variants: ItemVariantQuickAddList]
}>()

const variants = computed<ItemVariantQuickAddList>({
    get () {
        return props.modelValue
    },
    set (val: ItemVariantQuickAddList) {
        emit('update:modelValue', val)
    },
})

</script>
