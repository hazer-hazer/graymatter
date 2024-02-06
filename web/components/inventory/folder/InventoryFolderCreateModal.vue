<template>
    <g-modal v-model="confirm" title="Add folder" :caption="caption" @submit="onSubmit">
        <q-input v-model="name" type="text" label="Name" />
        <q-input v-model="description" type="textarea" autogrow label="Description" />
    </g-modal>
</template>

<script lang="ts" setup>
import type { Folder } from '~/models/inventory/Folder'
import { TreePath, type TreePathSegment } from '~/models/inventory/Tree'

const props = defineProps<{
    modelValue: boolean
    path: TreePathSegment[]
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
}>()

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})

const path = new TreePath(props.path)

const caption = computed(() => `in ${path.toUserPath()}`)

const name = ref<string>()
const description = ref<string>()

const $q = useQuasar()
const { $apiFetch } = useNuxtApp()

const onSubmit = async () => {
    const parentFolderId = path.targetFolderId()
    const inventoryId = path.inventoryId()

    try {
        if (!parentFolderId || !inventoryId) {
            throw new Error('Cannot determine folder and inventory to save folder to')
        }

        const { folder } = await $apiFetch<{folder: Folder}>('/inventory/folder', {
            method: 'POST',
            body: {
                name: name.value,
                description: description.value,
                parentId: parentFolderId,
                inventoryId,
            },
        })

        const folderUrl = `/inventory/folder/${folder.id}`

        $q.notify({
            type: 'positive',
            message: `Folder ${folder.name} created successfully`,
            timeout: 5000,
            actions: [
                {
                    label: 'Open',
                    color: 'white',
                    handler: () => navigateTo(folderUrl),
                },
                {
                    label: 'Open in new tab',
                    color: 'white',
                    handler: () => navigateTo(folderUrl, {
                        open: {
                            target: '_blank',
                        },
                    }),
                },
            ],
        })
    } catch (err) {
        console.error(err)
    }
}
</script>

<style lang="scss" scoped>
.inventory-folder-create-modal {
    width: 700px;
    max-width: 80vw;
}
</style>
