<template>
  <hb-main-layout>
    <template v-slot:head-bar>
      <hb-head-bar />
    </template>
    <template v-slot:nav-bar>
      <hb-nav-bar />
    </template>
    <template v-slot:menu-list>
      <hb-menu-list />
    </template>
    <template v-slot:content>
      <hb-content-container>
        <router-view v-slot="{ Component }">
          <transition name="slide-fade">
            <keep-alive :include="include">
              <component
                v-if="pageId"
                :is="Component"
                :pageId="pageId"
                :isKeepalive="isKeepalive"
                :key="pageId"></component>
            </keep-alive>
          </transition>
        </router-view>
      </hb-content-container>
    </template>
    <hb-screen-locker/>
  </hb-main-layout>
</template>

<script lang="ts">
import HbHeadBar from '@/components/HbHeadBar.vue'
import HbNavBar from '@/components/HbNavBar.vue'
import HbMainLayout from '@/layouts/HbMainLayout.vue'
import HbMenuList from '@/components/HbMenuList.vue'
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import HbContentContainer from '@/layouts/HbContentContainer.vue'
import { self } from '@/common'
import HbScreenLocker from '@/components/HbScreenLocker.vue'

export default defineComponent({
  components: {
    HbScreenLocker,
    HbContentContainer,
    HbHeadBar,
    HbNavBar,
    HbMainLayout,
    HbMenuList
  },
  setup() {
    const { $happykit, $router } = self()
    const hkf = $happykit
    const isKeepalive = ref(false)
    const pageId = ref('')

    const update = () => {
      pageId.value = hkf.getCurrentMenuRoute().value?.pageId || ''
      isKeepalive.value = hkf.getCurrentMenuRoute().value?.menuItem.isKeepalive || false
    }

    watch($router.currentRoute, () => {
      update()
    })

    const include = computed(() => {
      return hkf.getNavList().value.map(e => e.pageId)
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
