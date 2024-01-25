<template>
    <DefaultPage>
        <q-inner-loading :showing="pending">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <InventoryBuyListCard v-if="data" :buy-list="data?.buyList" />
    </DefaultPage>
</template>

<script setup lang="ts">
import type { BuyList } from '~/models/inventory/BuyList'

const { $apiUseFetch } = useNuxtApp()

const route = useRoute('inventory-buy-list-id')

const { data, pending } = await $apiUseFetch<{
    buyList: BuyList
}>(`/inventory/buy-list/${route.params.id}`)

if (!data.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Buy list not found',
    })
}

</script>
