<template>
    <q-select
        v-model="values"
        label="Values"
        use-chips
        use-input
        multiple
        hide-dropdown-icon
        class="col"
        autofocus
        outlined
        :bottom-slots="true"
        @new-value="newValue"
    >
        <template #hint>
            <div>
                To add multiple values at once, separate them by `<span style="font-family: monospace;">
                    {{ delimiters }}
                </span>`
            </div>
        </template>
    </q-select>
</template>

<script setup lang="ts">
import type { QSelect } from 'quasar'

const props = withDefaults(defineProps<{
    modelValue?: string[],
    // Note: I'm not using regex because the value is displayed in hint
    delimiters?: string
}>(), {
    modelValue: () => [],
    delimiters: () => ';,',
})

// FIXME: Format input delimiters, need to escape
const delimRegex = new RegExp(`[${props.delimiters}]`)

const emit = defineEmits<{
    'update:modelValue': [values: string[]]
}>()

const values = computed<string[]>({
    get () {
        return props.modelValue
    },
    set (values: string[]) {
        emit('update:modelValue', values)
    },
})

const newValue: QSelect['onNewValue'] = (newVal: string, done) => {
    if (!newVal.length) {
        return done()
    }

    const updated = new Set(values.value)

    newVal
        .split(delimRegex)
        .map(val => val.trim())
        .filter(val => !!val.length)
        .forEach(val => updated.add(val))

    values.value = Array.from(updated)

    done(null)
}

</script>
