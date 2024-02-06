<template>
    <DefaultPage>
        <div class="col row items-center justify-between">
            <div class="col row inline text-h6 self-end">
                Search my inventories
            </div>
        </div>

        <q-separator spaced />

        <div class="col row">
            <div>
                Filter 1
            </div>
            <div>
                Filter 2
            </div>
        </div>

        <div class="column">
            Search results
        </div>
    </DefaultPage>
</template>

<script setup lang="ts">
useHead({
    title: 'Search',
})
</script>
