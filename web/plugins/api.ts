// import type { AsyncData } from 'nuxt/app'

import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

export default defineNuxtPlugin(() => {
    const { apiUrl } = useAppConfig()

    // TODO: Rewrite to `createFetch`
    return {
        provide: {

            // API_URL (path?: string) { return `${apiUrl}/${path}` },

            apiFetch: $fetch.create({
                baseURL: apiUrl,
            }),

            apiUseFetch<T extends Record<string, any>> (url: string | (() => string), opts: UseFetchOptions<T> = {}) {
                const defaults: UseFetchOptions<T> = {
                    baseURL: apiUrl,
                    // key: Math.random().toString(),
                    onResponse (ctx) {
                        console.log(`${url} response`, JSON.stringify(ctx.response._data))
                    },
                    onRequestError (ctx) {
                        console.error(`${url} request error`, ctx.error)
                    },
                }

                const params: UseFetchOptions<T> = defu(opts, defaults)

                return useFetch(url, params)
            },

            // async apiGet<Q extends Record<string, any>, R extends> (path: string, query?: Q): Promise<ReturnType<typeof useFetch<R>>> {
            //     console.log(`API GET Request ${path}:\n${JSON.stringify(query)}`)

            //     const response = await useFetch<R>(`${apiUrl}/${path}`, {
            //         query,
            //     })

            //     console.log(`API GET Response ${path}:\n${JSON.stringify(response.data)}`)

            //     return response
            // },
            // apiGet<R> (path: string, options = {}) {
            // },

            // async apiPost<D extends Record<string, any>, R = any> (path: string, body: D): Promise<R> {
            //     const result = await $fetch(`${apiUrl}/${path}`, {
            //         method: 'GET',
            //         body,
            //     })
            //     return <R>result
            // },
        },
    }
})
