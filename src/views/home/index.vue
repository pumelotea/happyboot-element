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
      <router-view v-slot="{ Component }">
        <transition name="slide-fade">
          <keep-alive :include="include">
            <component
              :is="Component"
              :pageId="pageId"
              :isKeepalive="isKeepalive"
              :key="pageId"></component>
          </keep-alive>
        </transition>
      </router-view>
    </template>
  </main-layout>
</template>

<script lang="ts">
import HeadBar from '@/components/HeadBar.vue'
import NavBar from '@/components/NavBar.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import MenuList from '@/components/MenuList.vue'
import { defineComponent, ref, onMounted, watch } from 'vue'
import { getHappykitInstance } from '@/framework'
import happyKitRouter from '@/router'

export default defineComponent({
  components: {
    HeadBar,
    NavBar,
    MainLayout,
    MenuList,
  },
  setup() {
    const hkf = getHappykitInstance()
    const isKeepalive = ref(false)
    const pageId = ref('')
    const include = ref<string[]>([])

    const update = () => {
      pageId.value = hkf.getCurrentMenuRoute().value?.pageId || ''
      isKeepalive.value = hkf.getCurrentMenuRoute().value?.menuItem.isKeepalive || false
      include.value = hkf.getNavList().value.map(e => e.pageId)
    }

    watch(happyKitRouter.currentRoute, () => {
      update()
    })

    onMounted(() => {
      update()
    })

    return {
      pageId,
      isKeepalive,
      include
    }
  }
})
</script>
