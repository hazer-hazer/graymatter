<template>
    <DefaultPage>
        <div class="col row items-center justify-between">
            <div class="col row inline text-h6 self-end">
                My buy lists
            </div>
        </div>

        <q-separator spaced />

        <div v-if="buyLists" class="row q-col-gutter-sm">
            <div
                v-for="(buyList, id) in buyLists"
                :key="id"
                class="col-md-4 col-sm-6 col-xs-12"
            >
                <InventoryBuyListCard :buy-list="buyList" @delete="onBuyListDelete" />
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
                <q-btn
                    v-if="newBuyListDraft !== null"
                    icon="not_interested"
                    label="Discard"
                    color="red-10"
                    class="col full-width q-mb-xs"
                    outline
                    @click="newBuyListDraft = null"
                />
                <q-btn
                    v-else
                    color="grey-6"
                    icon="playlist_add"
                    label="Add buy list"
                    style="height: max-content;"
                    outline
                    class="full-width"
                    @click="newBuyListDraft = initialBuyListDraft"
                />

                <q-card
                    v-if="newBuyListDraft !== null"
                    flat
                    bordered
                    class="new-buy-list-draft"
                >
                    <q-card-section>
                        <q-input v-model="newBuyListDraft.name" type="text" label="Name" autofocus />
                        <q-input v-model="newBuyListDraft.description" type="textarea" label="Description" autogrow />
                    </q-card-section>
                    <q-card-section class="q-pt-none q-pb-sm column q-gutter-sm">
                        <q-checkbox v-model="newBuyListDraft.watch" label="Watch" dense>
                            <q-tooltip :delay="400" class="neutral-tooltip" max-width="20rem">
                                {{ whatIsWatchOptionText }}
                            </q-tooltip>
                        </q-checkbox>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn
                            class="col"
                            outline
                            color="green-7"
                            label="Create buy list"
                            :loading="newBuyListLoading"
                            @click="createBuyList"
                        />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
        <q-inner-loading :showing="pending">
            <q-spinner size="50px" color="primary" />
        </q-inner-loading>
    </DefaultPage>
</template>

<script setup lang="ts">
import type { BuyList } from '~/models/inventory/BuyList'

useHead({
    title: 'My buy lists',
})

const whatIsWatchOptionText = 'When item\'s amount will be sufficient, it will be automatically checked in this list'

const { $apiUseFetch, $apiFetch } = useNuxtApp()

const { data, pending } = await $apiUseFetch<{
    buyLists: BuyList[]
}>('/inventory/buy-list', {
    method: 'GET',
})

if (!data.value?.buyLists) {
    throw createError({
        statusCode: 400,
        statusMessage: 'Service unavailable',
    })
}

const buyLists = reactive(mapIdList(data.value.buyLists, 'id'))

type BuyListDraft = Partial<Pick<BuyList,
    | 'name'
    | 'description'
    | 'watch'
>>

const initialBuyListDraft: BuyListDraft = {
    watch: true,
}
const newBuyListDraft = ref<BuyListDraft | null>(null)
const newBuyListLoading = ref<boolean>(false)

const createBuyList = async () => {
    try {
        newBuyListLoading.value = true
        const result = await $apiFetch<{
            buyList: BuyList
        }>('/inventory/buy-list', {
            method: 'POST',
            body: {
                buyList: newBuyListDraft.value,
            },
        })

        buyLists[result.buyList.id] = result.buyList

        newBuyListDraft.value = null
    } catch (err) {
        console.error(err)
    } finally {
        newBuyListLoading.value = false
    }
}

const onBuyListDelete = (buyList: BuyList) => {
    delete buyLists[buyList.id]
}
</script>

<style scoped lang="scss">
.new-buy-list-draft {
    transition: .4s ease-in;
}
</style>
