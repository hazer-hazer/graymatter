<template>
    <q-dialog v-model="confirm" persistent>
        <q-card class="gm-modal">
            <q-card-section class="row q-pb-none">
                <div class="col column">
                    <InventoryAttrSelect v-model="attr" :filter="filterExisting" />
                    <TextSeparator label="or" />
                    <q-btn
                        icon="new_label"
                        dense
                        flat
                        label="Create new attribute"
                        @click="showAttrCreateModal = true"
                    />
                </div>

                <q-separator spaced vertical />
                <!-- <TextSeparator vertical full>
                    <q-icon name="keyboard_arrow_right" size="sm" color="grey" class="q-ml-xs" />
                </TextSeparator> -->

                <div class="col column">
                    <InventoryAttrValueInput v-model="attrValue" class="col" :attr="attr" />

                    <div class="col column justify-end">
                        <q-btn
                            to="/inventory/attr/my"
                            target="_blank"
                            class="text-caption"
                            icon-right="open_in_new"
                            dense
                            flat
                            color="orange-4"
                            label="Open my attributes"
                        />
                    </div>
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
                    :disable="!canSubmit"
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
    modelValue: boolean,
    existing: Attribute['id'][]
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean],
    'cancel': [],
    'save': [attr: AttrWithValue],
}>()

const canSubmit = computed<boolean>(() => !!attr.value && !!attrValue.value?.length)
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

const filterExisting = (attr: Attribute) => !props.existing.includes(attr.id)
</script>
