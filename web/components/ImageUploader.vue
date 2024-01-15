<template>
    <q-dialog v-model="confirm" :persistent="persistent">
        <q-card>
            <q-uploader
                ref="uploader"
                :url="uploadImgUrl"
                color="primary"
                flat
                bordered
                accept="image/*"
                :max-file-size="2 ** 21"
                :multiple="props.multiple"
                :headers="headers"
                @uploaded="uploaded"
            />
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { QUploader } from 'quasar'
import type { Image } from '~/models/Image'

const props = withDefaults(defineProps<{
    multiple?: boolean
    modelValue: boolean,
}>(), {
    multiple: true,
})

const emit = defineEmits<{
    uploaded: [result: UploadResult],
    'update:modelValue': [confirm: boolean],
}>()

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})

const uploader = ref<QUploader>()

const { apiUrl } = useAppConfig()
const { $getAuthHeaderAppendix } = useNuxtApp()
const headers = Object.entries({
    ...$getAuthHeaderAppendix(),
}).map(([name, value]) => ({ name, value }))

const uploadImgUrl = `${apiUrl}/img`

export type UploadResult = {
    files: QUploader['uploadedFiles']
    res: {
        images: Image[]
    }
}

const uploaded = ({ files, xhr }: {files: QUploader['uploadedFiles'], xhr: XMLHttpRequest}) => {
    const { images } = JSON.parse(xhr.response)
    const result = {
        files,
        res: {
            images,
        },
    }
    uploader.value?.reset()
    confirm.value = false
    emit('uploaded', result)
}

const persistent = computed(() => !!uploader.value?.files.length)

</script>
