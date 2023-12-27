<template>
    <div class="row no-wrap items-center">
        <q-separator class="col" />
        <div class="col-grow q-px-sm">
            {{ label }}
        </div>
        <q-separator class="col" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>
