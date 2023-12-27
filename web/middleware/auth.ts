export default defineNuxtRouteMiddleware(() => {
    if (!useIsLoggedIn().value) { return navigateTo({ path: '/' }) }
})
