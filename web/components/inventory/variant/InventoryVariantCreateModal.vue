<template>
    <q-dialog v-model="show">
        <q-card class="variant-create-modal">
            <q-card-section>
                <span class="text-h6">Create new variant</span>
                <q-space />
                <span class="text-caption text-italic">in {{ path }}</span>
                <q-form
                    ref="form"
                    class="q-gutter-md"
                    autofocus
                    @submit="onSubmit"
                >
                    <q-input v-model="name" type="text" label="Name" />
                    <q-input v-model="description" type="textarea" label="Description" />
                    <input-uri v-model="uri" :name-value="name" />

                    <div>
                        <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { QForm } from 'quasar'
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

const form = ref<QForm>()

const name = ref<string>()
const description = ref<string>()
const uri = ref<string>()

const path = computed(() => useInventoryLocation().toUserPath())

const loading = ref<boolean>(false)
const $q = useQuasar()

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
        form.value?.reset()
        show.value = false
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
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss">
.variant-create-modal {
    width: 700px;
    max-width: 60vw;
}
</style>
