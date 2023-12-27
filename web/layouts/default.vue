<template>
    <q-layout view="hHh lpR fff">
        <NuxtLoadingIndicator />
        <q-header class="header text-dark">
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
                        <q-list style="min-width: 100px">
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
            v-model="leftDrawerOpen"
            show-if-above
            side="left"
            bordered
            overlay
            :breakpoint="1200"
            :width="250"
            class="column full-height"
        >
            <div class="col">
                <q-list>
                    <q-item v-ripple clickable>
                        <q-item-section avatar>
                            <q-icon color="primary" name="bluetooth" />
                        </q-item-section>
                        <q-item-section>Icon as avatar</q-item-section>
                    </q-item>
                </q-list>
            </div>

            <q-separator />

            <q-btn
                padding="md 0"
                flat
                no-caps
                size="sm"
                label="GrayMatter"
                icon="water_drop"
                text-color="grey-6"
                dense
                :ripple="{
                    color: 'grey-8',
                }"
            />
        </q-drawer>

        <!-- TODO: Page scroller -->
        <q-page-container class="row justify-center">
            <NuxtPage />
        </q-page-container>

        <InventoryItemCreateModal />
        <InventoryFolderCreateModal />
        <InventoryCreateModal />
        <AuthModal />
    </q-layout>
</template>

<script lang="ts" setup>
const leftDrawerOpen = ref(false)

const isLoggedIn = useIsLoggedIn()
const app = useApp()
const { data: user } = await useAuthStore().refreshed()
const me = user.value?.user

const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value }

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
    box-shadow: 0 1px 5px #dfdfdf;
    background-color: #fff9;
    // background-color: color.adjust($primary, $alpha: -0.4);
    backdrop-filter: blur(6px);
}

</style>
