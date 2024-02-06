<template>
    <q-select
        v-model="currency"
        :options="options"
        label="Currency"
        use-input
        outlined
        autofocus
        :display-value="currency?.code"
        @filter="filter"
    >
        <template #no-option>
            <q-item>
                <q-item-section>
                    <q-item-label caption>
                        Currency not found
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
        <template #option="option">
            <q-item dense v-bind="option.itemProps">
                <q-item-section avatar>
                    {{ option.opt.symbol }}
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ option.opt.code }}</q-item-label>
                    <q-item-label caption lines="2">
                        {{ option.opt.name }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts" setup>
import type { QSelect } from 'quasar'
import type { Currency } from '~/models/Currency'

const props = defineProps<{
    modelValue: Currency | null
}>()

const emit = defineEmits<{
    'update:modelValue': [currency: Currency | null]
}>()

const currency = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})

const { $apiFetch } = useNuxtApp()

const isoCurrencies = ref<Currency[]>([])
const options = ref<Currency[]>()

const filter: QSelect['onFilter'] = async (input_, update) => {
    if (!isoCurrencies.value.length) {
        const { currencies } = await $apiFetch<{
            currencies: Currency[]
        }>('/currency', {
            method: 'GET',
        })

        isoCurrencies.value = currencies
    }

    const input = input_.toLocaleLowerCase()

    update(() => {
        options.value = isoCurrencies.value.filter(cur =>
            cur.name.toLocaleLowerCase().startsWith(input) ||
        cur.code.toLocaleLowerCase().includes(input))
    })
}
</script>
