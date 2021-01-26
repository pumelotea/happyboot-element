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
      <content-container >
        <router-view  v-slot="{ Component }" >
          <keep-alive ref="aaa">
            <component v-if="isKeepalive" :is="Component" :pageId="pageId" :isKeepalive="isKeepalive" :key="pageId"></component>
          </keep-alive>
          <component v-if="!isKeepalive" :is="Component" :pageId="pageId" :isKeepalive="isKeepalive" :key="pageId"></component>
        </router-view>
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
import { defineComponent, watch, ref, onMounted, getCurrentInstance } from 'vue'
import { getHappykitInstance } from '@/framework'
import happyKitRouter from '@/router'
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
    const isKeepalive = ref(false)
    const pageId = ref('')
    // const ctx = (getCurrentInstance() as any).ctx

    const update = ()=>{
      pageId.value = hkf.getCurrentMenuRoute().value?.pageId || ''
      isKeepalive.value = hkf.getCurrentMenuRoute().value?.menuItem.isKeepalive || false
      // console.log((ctx.$refs.aaa as any))
    }

    watch(happyKitRouter.currentRoute,()=>{
      update()
    })

    onMounted(()=>{
      update()
    })

    return {
      pageId,
      isKeepalive,
    }
  },
  mounted() {
    // console.log((this.$refs.aaa as any))
  }
})
</script>
