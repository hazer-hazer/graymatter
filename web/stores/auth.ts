import { defineStore } from 'pinia'
import type { User } from '~/models/User'

export interface LoginParams {
    email: string
    password: string
    rememberMe?: boolean
}

export const useAuthStore = defineStore('auth', {
    state (): {
        user: User | null,
        jwt: string | null
        authenticated: boolean
        } {
        return {
            user: null,
            jwt: null,
            authenticated: false,
        }
    },
    actions: {
        async login (params: LoginParams): Promise<User> {
            const { $apiFetch } = useNuxtApp()

            const data = await $apiFetch<{
                user: User,
                jwt: string
            }>('/auth/login', {
                method: 'POST',
                body: params,
            })

            this.user = data.user
            this.jwt = data.jwt
            this.authenticated = true

            return this.user
        },

        async logout () {
            const { $apiFetch } = useNuxtApp()
            await $apiFetch('/auth/logout', {
                method: 'POST',
            })
            this.user = null
            this.jwt = null
            this.authenticated = false
        },

        async refreshed () {
            const { $apiUseFetch } = useNuxtApp()
            const res = await $apiUseFetch<{user: User}>('/user/me')
            if (res.data.value) {
                this.user = res.data.value.user
            }
            return res
        },
    },
    persist: true,
})

export const useIsLoggedIn = (): Ref<boolean> => {
    const { authenticated } = storeToRefs(useAuthStore())
    return authenticated
}
