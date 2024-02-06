<template>
    <q-dialog v-model="show">
        <q-card class="gm-modal">
            <q-card-section class="q-gutter-sm">
                <span class="text-h6">Create new variant</span>
                <q-space />
                <span class="text-caption text-italic">in {{ path }}</span>
                <q-input
                    v-model="name"
                    type="text"
                    label="Name"
                    outlined
                    autofocus
                />
                <q-input
                    v-model="description"
                    type="textarea"
                    autogrow
                    label="Description"
                    outlined
                />
                <input-uri v-model="uri" :name-value="name" outlined dense />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Submit"
                    type="Submit"
                    color="primary"
                    :loading="loading"
                    @click="onSubmit"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { Item } from '~/models/inventory/Item'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

// TODO: Accept existing item variants to disallow duplicates
const props = defineProps<{
    modelValue: boolean,
    item: Pick<Item, 'id' | 'path'>
}>()

const emit = defineEmits<{
    'update:modelValue': [show: boolean],
    'save': [variant: ItemVariant],
}>()

const show = computed({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})

const { $apiFetch } = useNuxtApp()

const path = computed(() => useInventoryStore().path?.toUserPath())
const loading = ref<boolean>(false)

const name = ref<string>()
const description = ref<string>()
const uri = ref<string>()

const onSubmit = async () => {
    loading.value = true
    try {
        const result = await $apiFetch<{
            variant: ItemVariant,
        }>(`/inventory/item/${props.item.id}/variant`, {
            method: 'POST',
            body: {
                variant: {
                    name: name.value,
                    description: description.value,
                    uri: uri.value,
                },
            },
        })

        emit('save', result.variant)

        name.value = ''
        description.value = ''
        uri.value = ''

        show.value = false
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}
</script>
