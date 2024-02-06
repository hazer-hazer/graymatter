<template>
    <div class="row q-gutter-sm justify-start">
        <q-btn
            class="col"
            outline
            color="grey-5"
            icon="create_new_folder"
            @click="showFolderCreateModal = true"
        >
            <q-tooltip>Add folder</q-tooltip>
        </q-btn>
        <q-btn
            class="col"
            outline
            color="grey-5"
            icon="note_add"
            @click="showItemCreateModal = true"
        >
            <q-tooltip>Add item</q-tooltip>
        </q-btn>

        <inventory-folder-create-modal v-model="showFolderCreateModal" :path="props.path" />
        <inventory-item-create-modal v-model="showItemCreateModal" :path="props.path" />
    </div>
</template>

<script lang="ts" setup>
import { type TreePathSegment } from '~/models/inventory/Tree'

const props = defineProps<{
    path: TreePathSegment[]
}>()

// const path = computed(() => new TreePath(props.path))

const showFolderCreateModal = ref<boolean>(false)
const showItemCreateModal = ref<boolean>(false)
</script>
