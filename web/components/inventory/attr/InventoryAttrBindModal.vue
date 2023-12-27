<template>
    <q-dialog v-model="confirm" persistent>
        <q-card class="gm-modal">
            <q-card-section class="row q-pb-none">
                <div class="col column">
                    <InventoryAttrSelect v-model="attr" />
                    <TextSeparator label="or" class="text-subtitle2 q-py-xs" />
                    <q-btn
                        icon="new_label"
                        dense
                        flat
                        label="Create new attribute"
                        @click="showAttrCreateModal = true"
                    />
                </div>

                <q-separator spaced vertical />

                <div class="col">
                    <InventoryAttrValueInput v-model="attrValue" :attr="attr" />
                </div>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-actions class="q-pt-none q-px-md" align="right">
                <q-btn
                    v-close-popup
                    flat
                    label="Cancel"
                    color="primary"
                    @click="cancel"
                />
                <q-btn
                    v-close-popup
                    flat
                    label="Add attribute"
                    color="primary"
                    @click="submit"
                />
            </q-card-actions>
        </q-card>

        <InventoryAttrCreateModal v-model="showAttrCreateModal" @save="userDefinedAttrSaved" />
    </q-dialog>
</template>

<script setup lang="ts">
import type { AttrWithValue, Attribute } from '~/models/inventory/Attribute'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean],
    'cancel': [],
    'save': [attr: AttrWithValue],
}>()

const showAttrCreateModal = ref<boolean>(false)

const attr = ref<Attribute | null>(null)
const attrValue = ref<string | null>(null)

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})

const userDefinedAttrSaved = (customAttr: Attribute) => {
    console.log('set attr to user defined', customAttr)
    attr.value = customAttr
    showAttrCreateModal.value = false
}

const cancel = () => emit('cancel')

const submit = () => {
    if (!attr.value || !attrValue.value) {
        cancel()
    } else {
        emit('save', {
            ...attr.value,
            value: attrValue.value,
        })
    }
}
</script>
