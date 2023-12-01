<template>
    <q-dialog v-model="confirm">
        <q-card>
            <q-uploader
                ref="uploader"
                :url="uploadImgUrl"
                color="teal"
                flat
                bordered
                accept="image/*"
                :max-file-size="2 ** 21"
                multiple
                @uploaded="uploaded"
            />
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import type { QUploader } from 'quasar';
import { openImageUploaderModal } from '~/composables/states'
import type { Image } from '~/models/inventory/Image';

const confirm = openImageUploaderModal()
const uploader = ref<QUploader>()

const { apiUrl } = useAppConfig()

const uploadImgUrl = `${apiUrl}/img`

export type UploadResult = {
    files: QUploader['uploadedFiles']
    res: {
        images: Image[]
    }
}

const emit = defineEmits<{(event: 'uploaded', result: UploadResult): void}>()

const uploaded = ({files, xhr}: {files: QUploader['uploadedFiles'], xhr: XMLHttpRequest}) => {
    const {images} = JSON.parse(xhr.response)
    const result = {
        files,
        res: {
            images,
        }
    }
    uploader.value?.reset()
    confirm.value = false
    emit('uploaded', result)
}

</script>
