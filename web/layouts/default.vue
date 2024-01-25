<template>
    <q-layout
        view="hHh LpR fff"
        @keyup.self="onKeyupLeftDrawer"
    >
        <NuxtLoadingIndicator />
        <q-header class="header text-dark" bordered :elevated="false">
            <q-toolbar>
                <q-btn
                    dense
                    flat
                    round
                    icon="menu"
                    @click="toggleLeftDrawer"
                />

                <InventoryToolbarHeader v-if="app.uri === 'inventory'" />
                <DefaultHeaderToolbar v-else />

                <q-separator spaced inset vertical />

                <q-btn v-if="isLoggedIn" flat round color="dark">
                    <q-avatar v-if="me?.avatar">
                        <q-img
                            :src="me.avatar.src"
                            spinner-color="primary"
                            spinner-size="20px"
                            height="100%"
                        />
                    </q-avatar>
                    <q-avatar v-else icon="account_circle" />

                    <q-menu anchor="bottom start" self="top start">
                        <q-list style="min-width: 100px" dense class="text-center">
                            <q-item v-close-popup clickable>
                                <q-item-section>Profile</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item v-close-popup clickable :onclick="() => useAuthStore().logout()">
                                <q-item-section class="text-red text-bold">
                                    Logout
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>

                <q-btn
                    v-else
                    flat
                    round
                    icon="login"
                    @click="showAuthModal().value = true"
                />
                <!-- <q-btn-dropdown icon="add" color="white">
                    <q-list>
                        <q-item v-close-popup clickable @click="openItemCreateModal = true">
                            <q-item-section>
                                <q-item-label>Photos</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown> -->
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="showLeftDrawer"
            side="left"
            bordered
            :mini="leftDrawerMini"
            :breakpoint="1000"
            :width="220"
            class="column"
            @click="leftDrawerClick"
        >
            <q-scroll-area class="fit column">
                <div class="col">
                    <InventoryLeftDrawerMenu v-if="app.uri === 'inventory'" />
                </div>

                <q-btn
                    padding="sm 0"
                    flat
                    no-caps
                    size="md"
                    icon="water_drop"
                    text-color="grey-6"
                    dense
                    :ripple="{
                        color: 'grey-8',
                    }"
                    stack
                    square
                    class="absolute-bottom full-width shadow-1"
                >
                    <span v-show="!leftDrawerMini" class="text-caption">GrayMatter</span>
                </q-btn>
            </q-scroll-area>

            <div class="mini-drawer-toggle absolute" style="top: 20px; right: -12px;">
                <q-btn
                    color="primary"
                    style="opacity: 0.8"
                    :icon="leftDrawerMini ? 'chevron_right' : 'chevron_left'"
                    round
                    dense
                    size="sm"
                    @click.stop="() => leftDrawerMini = !leftDrawerMini"
                />
            </div>
        </q-drawer>

        <!-- TODO: Page scroller -->
        <q-page-container>
            <NuxtPage />
        </q-page-container>

        <InventoryItemCreateModal />
        <InventoryFolderCreateModal />
        <InventoryCreateModal />
        <AuthModal />
    </q-layout>
</template>

<script lang="ts" setup>
import { useCommonStore } from '~/stores/common'

const $q = useQuasar()

const isLoggedIn = useIsLoggedIn()
const app = useApp()
const { data: user } = await useAuthStore().refreshed()
const me = user.value?.user

const { showLeftDrawer, leftDrawerMiniMode } = storeToRefs(useCommonStore())
const { toggleLeftDrawer, toggleLeftDrawerMini } = useCommonStore()

const leftDrawerMini = computed({
    get () {
        if (showLeftDrawer.value && $q.screen.width <= 1200) {
            return true
        }
        return leftDrawerMiniMode.value
    },
    set (val: boolean) {
        if (showLeftDrawer.value) {
            leftDrawerMiniMode.value = val
        }
    },
})

const leftDrawerClick = () => {
    // TODO: I don't like this logic, actually
    leftDrawerMini.value = false
}

const onKeyupLeftDrawer = (e: KeyboardEvent) => {
    if (showLeftDrawer.value && e.key === '[') {
        toggleLeftDrawerMini()
    }
}

// const onDrawerKeyup = (e: KeyboardEvent) => {
//     if (!e) {
//         return
//     }

//     console.log(e.target, e.currentTarget)

//     if (!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && e.key === '[') {
//         leftDrawerMini.value = !leftDrawerMini.value
//     }
// }

// onMounted(() => document.addEventListener('keyup', onDrawerKeyup, true))
// onUnmounted(() => document.removeEventListener('keyup', onDrawerKeyup, true))

// onMounted(() => {
//     document.addEventListener('keydown', (e) => {
//         if (inventorySearch.value.focused) {
//             return
//         }

//         e.preventDefault()

//         if (e.ctrlKey && e.key === 'k') {
//             inventorySearch.value.focus()
//         }
//     }, false)
// })
</script>

<style scoped lang="scss">
@use 'sass:color';

.header {
    // box-shadow: 0 1px 5px #dfdfdf;
    background-color: #fff9;
    // background-color: color.adjust($primary, $alpha: -0.4);
    backdrop-filter: blur(6px);
}

.q-drawer {
    .mini-drawer-toggle {
        opacity: 0;
        transition: opacity 0.25s ease-out;
        transition-delay: .25s;
    }

    &.q-drawer--mobile {
        .mini-drawer-toggle {
            display: none;
        }
    }

    &:hover .mini-drawer-toggle {
        opacity: 1;
    }
}
</style>
