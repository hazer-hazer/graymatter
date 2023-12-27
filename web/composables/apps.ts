import type { App } from '~/models/App'

export const useApp = () => computed(() => {
    const uri: App['uri'] = useRoute().path.split('/').filter(seg => !!seg.length)[0] ?? null

    return {
        uri,
    }
})
