<template>
    <q-select
        v-model="type"
        :options="ATTR_TYPES"
        label="Type"
        hide-bottom-space
        rounded
        popup-content-class="column"
    >
        <template #option="{ opt, selected, toggleOption }">
            <q-item
                v-ripple
                :class="selected ? 'selected' : ''"
                clickable
                @click="toggleOption(opt)"
            >
                <q-item-section side class=" ">
                    <q-icon :name="ATTR_TYPE_ICONS[opt as AttrType]" color="grey-6" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ opt }}</q-item-label>
                    <q-item-label caption lines="2">
                        {{ attrTypeDescription[opt as AttrType] }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script setup lang="ts">
import { ATTR_TYPES, ATTR_TYPE_ICONS, DEFAULT_ATTR_TYPE, type AttrType } from '~/models/inventory/Attribute'

const attrTypeDescription: Record<AttrType, string> = {
    String: 'Specify any value',
    Enum: 'Allow only values specified in attribute',
}

const props = defineProps<{
    modelValue?: AttrType | null
}>()

const emit = defineEmits<{
    'update:modelValue': [val: AttrType]
}>()

const type = computed({
    get () {
        return props.modelValue ?? DEFAULT_ATTR_TYPE
    },
    set (val: AttrType) {
        emit('update:modelValue', val)
    },
})

</script>
