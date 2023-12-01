<template>
    <q-page padding class="col" style="max-width: 1400px;">
        <InventoryTreePath v-if="data?.item.path" :path="data?.item.path" />
        <div v-if="pending">
            <q-spinner-gears
                color="primary"
                size="3rem"
                class="absolute-center"
                :thickness="5"
            />
        </div>
        <div v-else-if="error">
            <pre>{{ error.message }}</pre>
        </div>
        <q-card v-else-if="data" class="col">
            <q-card-section class="row q-pa-none">
                <q-card-section class="row col q-pr-none">
                    <q-carousel
                        v-model="imageSlide"
                        class="col"
                        swipeable
                        animated
                        arrows
                        control-color="black"
                        control-type="flat"
                        height="200px"
                    >
                        <q-carousel-slide v-for="(imgGroup, groupIndex) in imageGroups" :key="groupIndex" class="column no-wrap flex-center q-pa-none" :name="groupIndex">
                            <div class="row fit justify-start items-center q-gutter-xs no-wrap">
                                <q-img
                                    v-for="({image}, imgIndex) in imgGroup"
                                    :key="imgIndex"
                                    :src="image.src"
                                    spinner-color="primary"
                                    spinner-size="82px"
                                    class="rounded-borders col full-height"
                                />
                            </div>
                        </q-carousel-slide>
                    </q-carousel>
                    <!-- <q-file
                        v-model="addedPhotos"
                        class="col-3 full-height"
                        :counter-label="addPhotoCounter"
                        multiple
                        outlined
                        counter
                        use-chips
                        append
                    >
                        <template #prepend>
                            <q-icon name="attach_file" />
                        </template>
                        <template #append>
                            <q-icon v-show="addedPhotos.length > 0" name="close" class="cursor-pointer" @click.stop.prevent="addedPhotos = []" />
                        </template>
                    </q-file> -->
                    <q-btn
                        color="primary"
                        icon="add_photo_alternate"
                        class="absolute-bottom-right q-mb-md"
                        flat
                        dense
                        @click="addPhoto"
                    />
                    <ImageUploader @uploaded="photoUploaded"/>
                </q-card-section>
                <q-separator spaced inset vertical />
                <q-card-section class="col">
                    <div class="row" @mouseover="editNameTooltip = true" @mouseleave="editNameTooltip = false">
                        <span class="text-h4 ellipsis">{{ editedName }}</span>
                        <q-tooltip v-model="editNameTooltip" anchor="bottom start" :offset="[-45, 0]">
                            <span>Edit name</span><q-icon name="edit" class="q-pl-sm" />
                        </q-tooltip>
                        <q-popup-edit v-slot="scope" v-model="editedName" title="Edit item name" auto-save>
                            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </div>
                    <q-separator spaced />
                    <div class="row">
                        <p v-if="editedDescription?.trim().length" class="text-body1 col" style="white-space: normal; overflow-wrap: break-word;">
                            {{ editedDescription }}
                        </p>
                        <span v-else class="text-italic col">No description</span>
                        <q-tooltip v-model="editDescriptionTooltip" anchor="bottom start" :offset="[-60, 0]">
                            <span>Edit description</span><q-icon name="edit" class="q-pl-sm" />
                        </q-tooltip>
                        <q-popup-edit v-slot="scope" v-model="editedDescription" title="Edit item description" auto-save>
                            <q-input
                                v-model="scope.value"
                                type="textarea"
                                dense
                                autofocus
                                @keyup.enter="scope.set"
                            />
                        </q-popup-edit>
                    </div>

                    <q-btn
                        v-if="isChanged"
                        color="primary"
                        icon="save"
                        label="Save changes"
                        outline
                        :loading="saveChangesLoading"
                        @click="saveChanges"
                    />
                </q-card-section>
            </q-card-section>

            <q-separator spaced inset />

            <q-card-section class="row q-pt-none">
                <span v-if="!data.item.variants?.length">This item does not have variants</span>
                <div v-else dense class="col">
                    <!-- TODO: https://quasar.dev/vue-components/table#example--selection-cell-slots-with-range-selection -->
                    <q-table
                        v-model:selected="variantsSelected"
                        title="Variants"
                        :columns="variantsTableColumns"
                        :rows="data.item.variants"
                        row-key="name"
                        flat
                        bordered
                        selection="multiple"
                        virtual-scroll
                        style="max-height: 500px;"
                    />
                    <!-- Via virtual-scroll -->
                    <!-- <q-virtual-scroll
                        v-model:selected="variantsSelected"
                        style="max-height: 400px;"
                        :items="data.item.variants"
                        virtual-scroll-sticky-size-end="48"
                        type="table"
                        flat
                        bordered
                    >
                        <template #before>
                            <thead class="thead-sticky text-left">
                                <tr>
                                    <th v-for="col in variantTableColumns" :key="`header-${col}`">
                                        {{ col.name }}
                                    </th>
                                </tr>
                            </thead>
                        </template>

                        <template #default="{item: variant, index}">
                            <tr :key="index">
                                <td v-for="col in variantTableColumns" :key="`${index}-${col.name}`">
                                    {{ variant[col.prop] }}
                                </td>
                                <td>
                                    <q-checkbox v-model="variantsSelected[variant.id]" />
                                </td>
                            </tr>
                        </template>
                    </q-virtual-scroll> -->

                    <!-- As list -->
                    <!-- <q-virtual-scroll v-slot="{item: variant, index}" separator :items="data.item.variants" style="max-height: 400px;">

                        <q-item :key="index" v-ripple>
                            <q-item-section avatar>
                                <q-avatar size="xl" rounded>
                                    <div v-if="variant.images?.length">
                                        TODO Images
                                    </div>
                                    <q-img
                                        v-else
                                        fit="cover"
                                        :src="data.item.images?.at(0)?.image.src"
                                        spinner-color="primary"
                                        spinner-size="82px"
                                    />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>{{ variant.name }}</q-item-section>
                            <q-item-section side>
                                <q-checkbox v-model="variantsSelected[variant.id]" />
                            </q-item-section>
                        </q-item>
                    </q-virtual-scroll> -->
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import type { QTableColumn, QUploader } from 'quasar'
import type { UploadResult } from '~/components/ImageUploader.vue'
import { openImageUploaderModal } from '~/composables/states'
import type { Image } from '~/models/inventory/Image'
import type { Item, ItemGetByIdResult } from '~/models/inventory/Item'
import type { ItemVariant } from '~/models/inventory/ItemVariant'

definePageMeta({
    validate: (route) => {
        return /\d+/.test(route.params.id as string)
    },
})

const $q = useQuasar()
const route = useRoute()
const imageSlide = ref(0)
const imageGroupSize = 2
const item = ref<Item>()

const { $apiUseFetch, $apiFetch } = useNuxtApp()

const imageGroups = computed(() => chunk(item.value?.images ?? [], imageGroupSize))

const { data, pending, error } = await $apiUseFetch<{
    item: Item
}>(() => `inventory/item/${route.params.id}`)

item.value = data.value?.item

if (data.value?.item.path) {
    inventoryLocation().value = data.value.item.path.segments
}

// const variantsSelected = ref(Object.fromEntries(data.value?.item.variants?.map(v => [v.id, false]) || []))
const variantsSelected = ref([])

// const variantTableColumns: {
//     name: string
//     prop: keyof ItemVariant
// }[] = [
//     { name: 'Name', prop: 'name' },
// ]

const variantsTableColumns: QTableColumn<ItemVariant, keyof ItemVariant>[] = [
    {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left',
        sortable: true,
    },
    {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left',
        sortable: true,
    },
]

useHead({
    title: `Item ${data.value?.item.name}`,
})

// const addedPhotos = ref([])
// const addPhotoCounter: QFile['counterLabel'] = ({ totalSize, filesNumber }) => `${filesNumber} photos | ${totalSize}`

const addPhoto = () => {
    openImageUploaderModal().value = true
}

const photoUploaded = async (res: UploadResult) => {
    console.log(res.files, res.res);

    for await (const image of res.res.images) {
        await $apiFetch<{
            itemId: Item['id']
            imageId: Image['id']
        }>(`/inventory/item/${data.value?.item.id}/image/${image.id}`, {
            method: 'POST',
        })
        item.value?.images?.push({
            image: image
        })
    }
}

const editedName = ref(data.value?.item.name)
const editNameTooltip = ref(false)
const editedDescription = ref(data.value?.item.description)
const editDescriptionTooltip = ref(false)
const saveChangesLoading = ref(false)

const isChanged = computed(() =>
    editedName.value !== item.value?.name ||
 editedDescription.value !== item.value?.description,
)

const saveChanges = async () => {
    try {
        saveChangesLoading.value = true
        const { item: updated } = await $apiFetch<{item: Item}>(`/inventory/item/${data.value?.item.id}`, {
            method: 'PUT',
            body: {
                item: {
                    name: editedName.value,
                    description: editedDescription.value,
                },
            },
        })
        item.value = {
            ...item.value,
            ...updated,
        }
        saveChangesLoading.value = false
    } catch (err) {
        if (err instanceof Error) {
            $q.notify({
                type: 'negative',
                message: err.message,
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.thead-sticky tr > * {
    position: sticky;
    z-index: 1;
    background-color: white;
}

.thead-sticky tr:last-child > * {
    top: 0;
}
</style>
