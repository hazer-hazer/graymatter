<template>
    <q-dialog v-model="open">
        <div class="bg-white q-pa-md inventory-folder-create-modal">
            <span class="text-h5">Add folder</span>
            <q-separator spaced inset />
            <q-form
                class="q-gutter-md"
                @submit="onSubmit"
                @reset="onReset"
            >
                <div class="row">
                    <q-btn label="Submit" type="submit" color="primary" />
                    <q-btn
                        label="Reset"
                        type="reset"
                        color="primary"
                        flat
                        class="q-ml-sm"
                    />
                </div>
            </q-form>
        </div>
    </q-dialog>
</template>

<script lang="ts" setup>
export interface IInventoryItemCreateModal {
    modelValue: boolean
}

const props = defineProps<IInventoryItemCreateModal>()
const emit = defineEmits<{(event: 'update:modelValue', payload: boolean): void}>()
const open = computed({
    get () {
        return props.modelValue
    },
    set (value: boolean) {
        emit('update:modelValue', value)
    },
})

const onSubmit = () => {

}

const onReset = () => {

}

</script>

<style lang="scss" scoped>
.inventory-folder-create-modal {
    width: 700px;
    max-width: 80vw;
}
</style>
