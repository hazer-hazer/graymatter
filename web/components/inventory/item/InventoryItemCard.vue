<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <!-- Slides -->
            <!-- <q-carousel
                v-model="imageSlide"
                height="200px"
                swipeable
                animated
                infinite
            >
                <q-carousel-slide
                    v-for="img in item.images"
                    :key="img.image.id"
                    :name="img.image.id"
                    :img-src="img.image.src"
                    class="column no-wrap flex-center rounded-borders"
                />
            </q-carousel> -->

            <q-img
                :src="item.images?.at(0)?.image.src"
                height="150px"
                spinner-color="primary"
                spinner-size="82px"
            />

            <q-btn
                icon="more_vert"
                class="absolute-top-right q-ma-xs text-weight-medium"
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

        <!--  class="row q-pa-sm q-pt-xs justify-between shadow-1" -->
        <q-card-section>
            <div class="column col q-px-xs">
                <q-btn :to="`/inventory/item/${item.id}`" tag="div" class="row text-body1 text-weight-bold q-pb-sm">
                    {{ item.name }}
                </q-btn>
                <!-- <p class="row text-body2">{{ item.description }}</p> -->
                <div class="row">
                    <!-- <q-icon name="inventory_2" /> -->
                    <InventoryItemAmount :amount="amount" class="text-weight-light" />
                    <q-separator spaced vertical />
                    <q-badge label="Price" />
                    <!-- <InventoryItemPrice v-if="item.price" :price="item.price" /> -->
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts" setup>
import type { IInventoryItemAmount } from './InventoryItemAmount.vue'
import type { Item } from '~/models/inventory/Item'

// export interface IInventoryItemCard extends Item {
//     id: string;
//     uri: string;
//     name: string,
//     description: string,
//     images?: {
//         image: {
//             id: string
//             src: string
//         }
//     }[],
//     amountUnit: AmountUnit;
//     variants?: ItemVariant[]
//     price?: IInventoryItemPrice
//     rawAmountValue: string
// }

const props = defineProps<{
    item: Item
}>()

const { item } = props

const amount: IInventoryItemAmount = {
    unit: item.amountUnit,
    value: item.rawAmountValue,
}

// const imageSlide = ref(item.images?.at(0)?.image?.id)

</script>
