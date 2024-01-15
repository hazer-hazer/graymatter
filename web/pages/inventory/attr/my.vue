<template>
    <DefaultPage>
        <q-inner-loading :showing="pending">
            <q-spinner
                color="primary"
                size="3rem"
                :thickness="5"
            />
        </q-inner-loading>

        <div v-if="data" class="row q-col-gutter-xs">
            <div
                v-for="(attr, index) in data.attrs"
                :key="index"
                class="row col-md-3 col-sm-6 col-12 items-start"
            >
                <q-card
                    bordered
                    flat
                    class="col"
                    style="max-height: 200px;"
                >
                    <q-card-section class="q-py-sm q-px-md">
                        <div class="text-subtitle2">
                            {{ attr.name }}
                        </div>
                        <div class="text-caption">
                            {{ attr.type }}
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-body2 ellipsis-3-lines">
                            {{ attr.description }}
                        </div>
                    </q-card-section>
                    <q-card-section v-if="attr.type === 'Enum'">
                        Possible values: {{ }}
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Delete" icon-right="delete" dense />
                        <q-btn flat label="Action 2" dense />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
    </DefaultPage>
</template>

<script setup lang="ts">
import type { Attribute } from '~/models/inventory/Attribute'

const { $apiUseFetch, $apiFetch } = useNuxtApp()

type AttrDynamic = Attribute & {
    loading: boolean
} | {
    loading: true
}

const attrToDynamic = (attr: Attribute): AttrDynamic => ({
    ...attr,
    loading: false,
})

const { data, pending } = await $apiUseFetch<{
    attrs: Attribute[]
}>('/inventory/attr/my')

const attrMap = reactive<Record<Attribute['id'], AttrDynamic>>(mapIdList(data.value?.attrs ?? [], 'id', attrToDynamic))

definePageMeta({
    middleware: ['auth'],
})

useHead({
    title: 'Attributes',
})

const update = async (id: Attribute['id'], updated: Partial<Attribute>) => {
    try {
        attrMap[id] = { loading: true }

        const result = await $apiFetch<{attr: Attribute}>('/inventory/attr', {
            method: 'PUT',
            body: {
                attr: updated,
            },
        })

        attrMap[id] = attrToDynamic(result.attr)
    } catch (err) {
        console.error(err)
    } finally {
        attrMap[id].loading = false
    }
}

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
