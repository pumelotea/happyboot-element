<template>
  <main-layout>
    <template v-slot:head-bar>
      <HeadBar />
    </template>
    <template v-slot:nav-bar>
      <NavBar />
    </template>
    <template v-slot:menu-list>
      <MenuList />
    </template>
    <template v-slot:content>
      <content-container ref="cache">
        <router-view   v-slot="{ Component }" >
<!--          <keep-alive>-->
            <component :is="Component" :pageId="pageId" :key="pageId"></component>
<!--          </keep-alive>-->
        </router-view>
<!--        <router-view v-slot="{ Component }" v-if="!isKeepalive">-->
<!--          <component  :is="Component" :pageId="pageId"  :key="pageId"></component>-->
<!--        </router-view>-->
      </content-container>
    </template>
  </main-layout>
</template>

<script lang="ts">
import HeadBar from '@/components/HeadBar.vue'
import NavBar from '@/components/NavBar.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import MenuList from '@/components/MenuList.vue'
import ContentContainer from '@/layouts/ContentContainer.vue'
import { defineComponent, computed } from 'vue'
import { getHappykitInstance } from '@/framework'

export default defineComponent({
  components: {
    MainLayout,
    HeadBar,
    NavBar,
    MenuList,
    ContentContainer
  },
  setup() {
    const hkf = getHappykitInstance()
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    const isKeepalive = computed(() => {
      return currentRouteMenu.value?.menuItem.isKeepalive || false
    })

    const pageId = computed(() => {
      return currentRouteMenu.value?.pageId || ''
    })

    return {
      pageId,
      isKeepalive
    }
  }
})
</script>
