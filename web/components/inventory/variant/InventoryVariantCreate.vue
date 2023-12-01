<template>
    <div>
        <q-select
            v-model="variantsList"
            label="Variants"
            use-chips
            use-input
            multiple
            hide-dropdown-icon
            hint="To add multiple variants at once, separate them by `,`"
            @new-value="newVariant"
        />
    </div>
</template>

<script lang="ts" setup>
import type { QSelect } from 'quasar'

const variants = ref(new Set())
const variantsList = computed({
    get () {
        return Array.from(variants.value)
    },
    set (val: unknown[]) {
        variants.value = new Set(val)
    },
})

const newVariant: QSelect['onNewValue'] = (val: string, done) => {
    if (!val.length) {
        return done()
    }

    val.split(/,+/).map(val => val.trim()).filter(val => !!val.length).forEach(val => variants.value.add(val))

    done(null)
}

defineExpose({
    variants: variantsList,
})

</script>
