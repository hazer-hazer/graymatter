import { defineStore } from 'pinia'

interface CommonState {
    showLeftDrawer: boolean
    leftDrawerMiniMode: boolean
}

export const useCommonStore = defineStore('common', {
    state (): CommonState {
        return {
            showLeftDrawer: false,
            leftDrawerMiniMode: false,
        }
    },
    actions: {
        toggleLeftDrawer () {
            console.log('toggle left drawer')

            this.showLeftDrawer = !this.showLeftDrawer
        },
        toggleLeftDrawerMini () {
            console.log('mini toggle left drawer mini')
            this.leftDrawerMiniMode = !this.leftDrawerMiniMode
        },
    },
    persist: true,
})
