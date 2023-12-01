<template>
    <div class="row q-gutter-sm justify-start">
        <q-btn
            class="col"
            outline
            color="grey-5"
            icon="create_new_folder"
            @click="openCreateFolderModal().value = true"
        >
            <q-tooltip>Add folder</q-tooltip>
        </q-btn>
        <q-btn
            class="col"
            outline
            color="grey-5"
            icon="note_add"
            @click="openCreateItemModal().value = true"
        >
            <q-tooltip>Add item</q-tooltip>
        </q-btn>
    </div>
</template>

<script lang="ts" setup>
import { openCreateFolderModal, openCreateItemModal } from '~/composables/states'

</script>
