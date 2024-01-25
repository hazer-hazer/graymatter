<template>
    <DefaultPage>
        <div class="col row items-center justify-between">
            <div class="col row inline text-h6 self-end">
                My attributes
            </div>
            <div class="col row justify-end">
                <q-btn
                    color="primary"
                    icon="new_label"
                    outline
                    label="Create attribute"
                    @click="showCreateModal = true"
                />
            </div>
        </div>
        <q-separator spaced />

        <InventoryAttrCreateModal v-model="showCreateModal" @save="onAttrAdded" />

        <q-inner-loading :showing="pending">
            <q-spinner
                color="primary"
                size="3rem"
                :thickness="5"
            />
        </q-inner-loading>

        <div v-if="data" class="row q-col-gutter-xs">
            <div
                v-for="(attr, id) in attrMap"
                :key="id"
                class="col-md-4 col-sm-6"
            >
                <InventoryAttrCard :attr="attr" @delete="onAttrDeleted" />
            </div>
            <div v-if="data.attrs.length === 0" class="col column justify-center">
                <div class="col row text-center">
                    <span class="col text-body1 text-grey-6">You have no attributes</span>
                </div>
            </div>
        </div>
    </DefaultPage>
</template>

<script setup lang="ts">
import type { Attribute } from '~/models/inventory/Attribute'

definePageMeta({
    middleware: ['auth'],
})

useHead({
    title: 'My attributes',
})

const { $apiUseFetch } = useNuxtApp()

const { data, pending } = await $apiUseFetch<{
    attrs: Attribute[]
}>('/inventory/attr/my')

const attrMap = reactive(mapIdList(data.value?.attrs ?? [], 'id'))

const onAttrAdded = (attr: Attribute) => {
    attrMap[attr.id] = attr
}

const onAttrDeleted = (attr: Attribute) => {
    delete attrMap[attr.id]
}

const showCreateModal = ref<boolean>(false)

</script>

<style scoped lang="scss">
// .attrs {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     grid-auto-rows: max-content;
//     grid-gap: 5px;

//     & > .q-card {
//         display: block;
//     }
// }
</style>
