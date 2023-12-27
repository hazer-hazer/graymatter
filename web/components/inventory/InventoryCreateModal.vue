<template>
    <q-dialog v-model="confirm">
        <q-card class="inventory-create-modal">
            <q-card-section class="q-pb-none">
                <span class="text-h6">Create new inventory</span>
            </q-card-section>
            <q-card-section>
                <q-form
                    class="q-gutter-md"
                    @submit="onSubmit"
                >
                    <q-input v-model="name" type="text" label="Inventory name" />
                    <q-input v-model="description" type="text" label="Description" />
                    <q-input v-model="uri" type="text" label="Shortname" />
                    <div>
                        <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

const confirm = showInventoryCreateModal()

const loading = ref<boolean>(false)
const name = ref<string>()
const description = ref<string>()
const uri = ref<string>()

const { $apiFetch } = useNuxtApp()

const onSubmit = async () => {
    loading.value = true
    const result = await $apiFetch<{
        inventory: Inventory
    }>('/inventory', {
        method: 'POST',
        body: {
            name: name.value,
            description: description.value,
            uri: uri.value,
        },
    })
    loading.value = false

    navigateTo(`/inventory/${result.inventory.uri}`)
}

</script>

<style lang="scss" scoped>
.inventory-create-modal {
    width: 700px;
    max-width: 60vw;
}
</style>
