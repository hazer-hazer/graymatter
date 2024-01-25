<template>
    <q-card
        bordered
        flat
    >
        <DialogAreYouSure v-model="showConfirmDelete" :message="`Are you sure you want to delete attribute '${attr.name}'? It will be removed from all items and their variants`" @yes="() => deleteAttr(attr)" />

        <q-card-section class="q-py-none q-pt-sm q-px-md">
            <div class="text-h6 attr-name">
                <BadgeTooltip position="before" />

                <span>
                    {{ attr.name }}
                </span>

                <q-popup-edit v-slot="scope" v-model="attr.name" class="q-pa-none" @save="name => updateAttr({name})">
                    <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        outlined
                        label="Name"
                        @keyup.enter="scope.set"
                    />
                </q-popup-edit>
            </div>
            <div class="attr-type">
                <BadgeTooltip position="before" />
                <div class="text-body2 row items-center" style="font-family: monospace;">
                    <q-icon :name="ATTR_TYPE_ICONS[attr.type] ?? 'interests'" size="xs" />
                    <span class="q-px-xs">
                        {{ attr.type }}
                    </span>
                </div>

                <!-- TODO: Warning on type change -->
                <q-popup-edit v-slot="scope" v-model="attr.type" class="q-pa-sm" @save="type => updateAttr({type})">
                    <InventoryAttrTypeSelect
                        v-model="scope.value"
                        autofocus
                        dense
                        options-dense
                        @update:model-value="scope.set"
                    />
                </q-popup-edit>
            </div>

            <q-btn dense icon="more_horiz" flat class="absolute-top-right q-ma-sm">
                <q-menu>
                    <q-list dense style="min-width: 100px">
                        <q-item v-close-popup clickable class="text-red" @click="showConfirmDelete = true">
                            <q-item-section side class="q-pr-sm">
                                <q-icon name="delete" size="xs" color="red" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>
                                    Delete
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </q-card-section>
        <q-separator spaced />
        <q-card-section class="q-py-none">
            <div class="text-body2 attr-description">
                <BadgeTooltip position="before" />
                <span v-if="attr.description?.length" class="ellipsis-3-lines">
                    {{ attr.description }}
                </span>
                <span v-else class="text-caption text-italic">No description</span>

                <q-popup-edit
                    v-slot="scope"
                    v-model="attr.description"
                    buttons
                    class="q-pa-xs"
                    @save="description => updateAttr({description})"
                >
                    <q-input
                        v-model="scope.value"
                        type="textarea"
                        outlined
                        dense
                        autofocus
                        label="Description"
                        autogrow
                    />
                </q-popup-edit>
            </div>
        </q-card-section>
        <q-separator v-if="attr.type === 'Enum'" spaced inset />
        <q-separator v-else inset spaced dark />
        <q-card-section v-if="attr.type === 'Enum'" class="column justify-center q-pt-none">
            <q-btn
                class="col row text-subtitle2 q-px-xs"
                outline
                :color="showAllowedValues ? 'primary' : ''"
                no-caps
                @click="showAllowedValues = !showAllowedValues"
            >
                <span class="col-auto">Allowed values</span>
                <!-- <span class="col-auto text-grey-6 q-pb-sm">(type Enum)</span> -->
            </q-btn>
            <div v-show="showAllowedValues" class="col-auto q-gutter-sm column q-pt-sm">
                <q-btn
                    v-if="allowedValueDraft === null"
                    icon="add"
                    class="col"
                    label="Add value"
                    flat
                    dense
                    size="sm"
                    @click="allowedValueDraft = ''"
                />
                <q-btn
                    v-else
                    icon="not_interested"
                    label="Discard"
                    dense
                    outline
                    size="sm"
                    color="red-10"
                    @click="allowedValueDraft = null"
                />
                <q-scroll-area class="col-grow" style="height: 200px;">
                    <q-list
                        separator
                        bordered
                        dense
                        class="rounded-borders"
                    >
                        <q-item v-if="allowedValueDraft !== null" class="attr-value-draft">
                            <q-item-section>
                                <q-input
                                    ref="allowedValueDraftInput"
                                    v-model="allowedValueDraft"
                                    type="text"
                                    label="New value"
                                    dense
                                    :rules="[
                                        val => !!val.length || 'Value cannot be empty',
                                        val => !attr.allowedValues.includes(val.trim()) || `${val} already exists`
                                    ]"
                                    autofocus
                                    @keyup.enter="allowedValueDraft?.length && !allowedValueDraftInput?.hasError && addAllowedValue()"
                                >
                                    <template v-if="!allowedValueDraftInput?.hasError" #after>
                                        <q-btn
                                            flat
                                            icon="check"
                                            round
                                            dense
                                            color="green-4"
                                            @click="addAllowedValue"
                                        />
                                    </template>
                                </q-input>
                            </q-item-section>
                        </q-item>
                        <q-item
                            v-for="(allowedValue, allowedValueIndex) in attr.allowedValues"
                            :key="allowedValueIndex"
                            class="attr-allowed-value"
                        >
                            <q-item-section class="col-auto">
                                <q-item-label>
                                    {{ allowedValue }}
                                </q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-separator inset />
                            </q-item-section>
                            <q-item-section side class="attr-allowed-value-delete">
                                <q-btn
                                    icon="delete"
                                    flat
                                    dense
                                    @click="deleteAllowedValue(allowedValue)"
                                />
                            </q-item-section>
                        </q-item>
                        <q-item v-if="attr.allowedValues.length === 0 && allowedValueDraft === null">
                            <q-item-section>
                                <q-item-label caption class="text-center">
                                    No values
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>
            </div>
        </q-card-section>
        <!-- <q-card-actions align="right">
                        <q-btn flat label="Delete" icon-right="delete" dense />
                        <q-btn flat label="Action 2" dense />
                    </q-card-actions> -->
    </q-card>
</template>

<script setup lang="ts">
import type { QInput } from 'quasar'
import { ATTR_TYPE_ICONS, type Attribute } from '~/models/inventory/Attribute'

const { $apiFetch } = useNuxtApp()

// type AttrDynamic = Attribute & {
//     loading: boolean
//     showConfirmDelete: boolean
// }

// const attrToDynamic = (attr: Attribute): AttrDynamic => ({
//     ...attr,
//     loading: false,
//     showConfirmDelete: false,
// })

const props = defineProps<{
    attr: Attribute
}>()

const emit = defineEmits<{
    'delete': [attr: Attribute]
    'expand': [attr: Attribute, expanded: boolean]
}>()

const loading = ref<boolean>(false)
const showConfirmDelete = ref<boolean>(false)
const showAllowedValues = ref<boolean>(false)

const allowedValueDraftInput = ref<QInput>()
const allowedValueDraft = ref<string | null>(null)

// const attr = reactive<AttrDynamic>(attrToDynamic(props.attr))
const attr = reactive(props.attr)
const applyAttrChanges = (updated: Attribute) => {
    Object.assign(attr, updated)
}

const updateAttr = async (updated: Partial<Attribute>) => {
    console.log('update attr', updated)

    try {
        loading.value = true

        const result = await $apiFetch<{attr: Attribute}>(`/inventory/attr/${attr.id}`, {
            method: 'PUT',
            body: {
                attr: updated,
            },
        })

        applyAttrChanges(result.attr)
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const deleteAttr = async (attr: Attribute) => {
    try {
        await $apiFetch(`/inventory/attr/${attr.id}`, {
            method: 'DELETE',
        })

        emit('delete', attr)
    } catch (err) {
        console.error(err)
    }
}

const addAllowedValue = () => {
    const addValue = allowedValueDraft.value?.trim()
    if (!addValue) {
        return
    }
    const allowedValues = new Set(attr.allowedValues)
    allowedValues.add(addValue)

    updateAttr({ allowedValues: [...allowedValues] })
    allowedValueDraft.value = null
}

const deleteAllowedValue = (allowedValue: string) => {
    const allowedValues = new Set(attr.allowedValues)
    allowedValues.delete(allowedValue)
    updateAttr({ allowedValues: [...allowedValues] })
}
</script>

<style scoped lang="scss">
.attr-name, .attr-type, .attr-description {
    cursor: pointer;
    transition: color .2s ease;

    &:hover {
        color: $primary;
    }
}

.attr-value-draft {
    padding: 0 15px 10px 10px;
}

.attr-allowed-value {
    padding: 5px 5px 5px 10px;

    .attr-allowed-value-delete {
        padding: 0;
        color: $grey-4;
        transition: color .2s ease;
    }

    &:hover .attr-allowed-value-delete {
        color: $red-10;
    }
}
</style>
