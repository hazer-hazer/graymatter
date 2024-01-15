// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 8080,
        host: '0.0.0.0',
    },
    sourcemap: true,
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    modules: [
        'nuxt-quasar-ui',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        'nuxt-typed-router',
        '@vueuse/nuxt',
    // '@nuxtjs/axios',
    // '@nuxtjs/auth-next',
    ],
    css: [
        '~/assets/scss/main.scss',
    ],
    quasar: {
        sassVariables: 'assets/scss/quasar-variables.scss',
        plugins: [
            'Notify',
        ],
        config: {
            // dark: 'auto',
            // ripple: true,
        },
        extras: {
            animations: 'all',
            fontIcons: [
                'fontawesome-v6',
                'material-icons-outlined',
            ],
        },
    },
    appConfig: {
        apiUrl: 'http://localhost:5000',
    },
})
