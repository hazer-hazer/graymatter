<template>
    <q-dialog v-model="confirm" persistent>
        <q-card>
            <q-card-section class="text-subtitle2 q-pb-none">
                {{ message }}
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    v-close-popup
                    flat
                    :label="yesLabel"
                    color="red"
                    @click="$emit('yes')"
                />
                <q-btn
                    v-close-popup
                    outline
                    :label="noLabel"
                    color="green"
                    @click="$emit('no')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<!-- Use for cases when better answer is "No", such as if I ask you to date me -->

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean,
    message: string,
    yesLabel?: string
    noLabel?: string
}>(), {
    yesLabel: 'Yes',
    noLabel: 'No',
})

const emit = defineEmits<{
    'update:modelValue': [val: boolean],
    'yes': [],
    'no': []
}>()

const confirm = computed<boolean>({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})
</script>
