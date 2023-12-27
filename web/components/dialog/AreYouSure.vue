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
                    label="Change amount unit"
                    color="red"
                    @click="onYes"
                />
                <q-btn
                    v-close-popup
                    outline
                    label="No"
                    color="green"
                    @click="onNo"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<!-- Use for cases when better answer is "No", such as if I ask you to date me -->

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean,
    message: string,
}>()

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
