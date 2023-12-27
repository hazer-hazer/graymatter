<template>
    <q-dialog v-model="confirm">
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
const confirm = showCreateFolderModal()

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
