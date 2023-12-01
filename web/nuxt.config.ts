// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 8080,
        host: '0.0.0.0',
    },
    sourcemap: true,
    devtools: {
        enabled: true,
    },
    modules: [
        'nuxt-quasar-ui',
    // '@nuxtjs/axios',
    // '@nuxtjs/auth-next',
    ],
    quasar: {
        sassVariables: 'assets/scss/quasar-variables.scss',
        plugins: [
            'Notify',
        ],
        config: {
            // dark: 'auto',
        },
    },
    appConfig: {
        apiUrl: 'http://localhost:5000',
    },
})
