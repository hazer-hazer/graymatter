<template>
    <q-dialog v-model="confirm" persistent>
        <q-card class="gm-modal">
            <q-card-section class="column q-gutter-sm">
                <span class="text-h6">
                    Create new attribute
                </span>
                <div class="row col q-gutter-sm">
                    <q-select
                        v-model="type"
                        class="col"
                        :options="ATTR_TYPES"
                        label="Type"
                        hide-bottom-space
                    />
                    <q-input
                        v-model="name"
                        class="col"
                        type="text"
                        label="Attribute name"
                        hide-bottom-space
                    />
                </div>

                <div class="col column">
                    <InputSelectUniqueChips
                        v-if="showAllowedValues"
                        v-model="allowedValues"
                        label="Allowed values"
                        class="col"
                    />
                </div>

                <div class="col">
                    <q-input
                        v-model="description"
                        type="textarea"
                        label="Description"
                        maxlength="1024"
                        outlined
                        autogrow
                    />
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn v-close-popup flat label="Cancel" color="primary" />
                <q-btn
                    flat
                    label="Create attribute"
                    color="primary"
                    type="submit"
                    :loading="loading"
                    :disable="!canSubmit"
                    @click="submit"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import type { AttrType, Attribute } from '~/models/inventory/Attribute'
import { ATTR_TYPES } from '~/models/inventory/Attribute'

const $q = useQuasar()
const { $apiFetch } = useNuxtApp()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean],
    'save': [attr: Attribute]
}>()

const confirm = computed<boolean>({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})

const canSubmit = computed<boolean>(() => !!type.value && !!name.value?.length)
const loading = ref<boolean>(false)
const showAllowedValues = computed<boolean>(() => {
    return type.value === 'Enum'
})

const type = ref<AttrType>()
const name = ref<string>()
const description = ref<string | null>(null)
const allowedValues = ref<string[]>([])

const submit = async () => {
    try {
        loading.value = true
        const result = await $apiFetch<{
            attr: Attribute
        }>('/inventory/attr', {
            method: 'POST',
            body: {
                attr: {
                    type: type.value,
                    name: name.value,
                    description: description.value?.length ? description.value : null,
                    allowedValues: type.value === 'Enum' ? allowedValues.value : null,
                },
            },
        })

        emit('save', result.attr)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        $q.notify({
            type: 'negative',
            message,
        })
    } finally {
        loading.value = false
    }
}

</script>
