<template>
    <q-dialog v-model="confirm" persistent>
        <q-card class="auth-modal">
            <q-tabs
                v-model="tab"
                dense
                stretch
            >
                <q-tab name="login" icon="login" label="Login" />
                <q-tab name="signup" icon="person_add" label="Signup" />
            </q-tabs>
            <q-card-section class="items-center">
                <q-form
                    class="q-gutter-md"
                    @submit="onSubmit"
                >
                    <q-input v-model="email" type="email" label="Email" :onblur="() => generateNickname()" />
                    <q-input
                        v-if="tab === 'signup'"
                        v-model="nickname"
                        type="text"
                        label="Nickname"
                        :on-blur="() => generateNickname()"
                    />
                    <q-input v-model="password" type="password" label="Password" />
                    <q-checkbox v-model="rememberMe" label="Remember me" dense>
                        <q-tooltip :delay="700">
                            Stay signed in for a longer time
                        </q-tooltip>
                    </q-checkbox>
                    <div class="row items-end">
                        <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
const confirm = showAuthModal()
const tab = ref<'login' | 'signup'>('login')

const loading = ref<boolean>(false)

const email = ref<string>()
const nickname = ref<string>()
const password = ref<string>()
const rememberMe = ref<boolean>(false)

const { $apiFetch } = useNuxtApp()

const auth = useAuthStore()

const $q = useQuasar()

const onSubmit = async () => {
    if (!email.value || !password.value) {
        throw new Error('Invalid params')
    }

    loading.value = true

    try {
        const kind = tab.value
        if (kind === 'signup') {
            await $apiFetch('/auth/signup', {
                method: 'POST',
                body: {
                    email: email.value,
                    password: password.value,
                    uri: nickname.value,
                },
            })
        }

        await auth.login({
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.value,
        })
        confirm.value = false
    } catch (err) {
        loading.value = false

        $q.notify({
            type: 'negative',
            message: (err instanceof Error) ? err.message : 'Unknown error',
        })
    }
}

const generateNickname = () => {
    if (nickname.value || !email.value) {
        return
    }

    nickname.value = email.value.split('@')[0].replaceAll(/\W/g, '-')
}
generateNickname()

</script>

<style lang="scss" scoped>
.auth-modal {
    width: 700px;
    max-width: 60vw;
}
</style>
