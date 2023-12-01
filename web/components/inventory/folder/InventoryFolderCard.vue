<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <!-- <q-carousel
                v-model="imageSlide"
                height="150px"
                swipeable
                animated
                infinite
            >
                <q-carousel-slide
                    v-for="img in folder.images"
                    :key="img.image.id"
                    :name="img.image.id"
                    :img-src="img.image.src"
                    class="column no-wrap flex-center rounded-borders"
                />
            </q-carousel> -->

            <q-img
                :src="folder.images?.at(0)?.image.src"
                height="150px"
                spinner-color="primary"
                spinner-size="82px"
            />

            <q-btn
                icon="more_vert"
                class="absolute-top-right q-ma-xs"
                dense
                padding="sm"
                flat
                size="sm"
            >
                <q-menu auto-close>
                    <q-list style="min-width: 100px">
                        <q-item v-close-popup clickable>
                            <q-item-section>edit</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </q-card-section>

        <!-- row q-pa-sm q-pt-xs justify-between shadow-1 -->
        <q-card-section>
            <div class="column col q-px-xs">
                <span class="row text-body1 text-weight-bold q-pb-sm">{{ folder.name }}</span>
                <!-- <p class="row text-body2">{{ item.description }}</p> -->
                <div class="row">
                    <!-- <q-icon name="inventory_2" /> -->
                    Some info here
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts" setup>
export interface IInventoryFolderCard {
    id: string;
    uri: string;
    inventoryId: number;
    name: string;
    description?: string;
    parentId?: string;
    images: {
        image: {
            id: string;
            src: string
        }
    }[]
}

const props = defineProps<{
    folder: IInventoryFolderCard
}>()

const { folder } = props

// const imageSlide = ref(props.folder.images.at(0)?.id)
// const imageSlide = ref(0)

</script>
