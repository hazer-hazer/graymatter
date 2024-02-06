<template>
    <q-dialog v-model="confirm">
        <q-card class="gm-modal">
            <q-card-section>
                <span class="text-h5">{{ title }}</span>
                <template v-if="caption">
                    <q-space />
                    <span v-if="caption" class="text-caption text-italic">{{ caption }}</span>
                </template>
            </q-card-section>

            <q-separator v-if="title || caption" inset />

            <q-card-section class="column">
                <slot />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    v-if="showCancel"
                    v-close-popup
                    flat
                    :label="cancelLabel"
                    color="primary"
                    @click="emit('cancel')"
                />
                <q-btn
                    v-close-popup
                    outline
                    :label="submitLabel"
                    color="primary"
                    :loading="loading"
                    @click="emit('submit')"
                />
            </q-card-actions>

            <q-card-section v-if="$slots.bottom">
                <slot name="bottom" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean
    title?: string
    caption?: string
    submitLabel?: string
    showCancel?: boolean
    cancelLabel?: string
    loading?: boolean
}>(), {
    title: '',
    caption: '',
    submitLabel: 'Submit',
    showCancel: true,
    cancelLabel: 'Cancel',
    loading: false,
})

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
    'submit': []
    'cancel': []
}>()

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})
</script>
