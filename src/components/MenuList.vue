<template>
  <div class="menu-list-container">
    <el-menu
      style="flex: 1;"
      :mode="mode"
      :default-active="activeMenu[activeMenu.length - 1]"
      :default-openeds="uniqueOpened ? activeMenu : null"
      :unique-opened="false"
      :collapse="mode !== 'horizontal' && isCollapse"
      :collapse-transition="false"
      @select="goto"
    >
      <template v-for="e in menuTree">
        <el-menu-item v-if="e.isRouter && !e.hide" :index="e.menuId">
          <i :class="e.icon"></i>
          <span slot="title">{{ e.name }}</span>
        </el-menu-item>

        <el-submenu :index="e.menuId" v-else-if="!e.isRouter && !e.hide">
          <template #title>
            <i :class="e.icon"></i>
            <span slot="title">{{ e.name }}</span>
          </template>
          <MenuContent v-for="a in e.children" :data="a" :key="a.menuId" />
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import MenuContent from './MenuContent.vue'
import { computed, defineComponent } from 'vue'
import { self } from '@/common'

export default defineComponent({
  props: {
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  components: {
    MenuContent
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  setup() {
    const { $happykit, $router } = self()

    const hkf = $happykit
    const menuTree = hkf.getMenuTree()
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    const activeMenu = computed(() => {
      return currentRouteMenu.value?.menuItem.menuPath.map(e => e.menuId) || []
    })

    const goto = (menuId: string) => {
      hkf.clickMenuItem(menuId, menuItems => {
        $router.push(menuItems[0].routerPath)
      })
    }

    return {
      menuTree,
      currentRouteMenu,
      activeMenu,
      goto
    }
  }
})
</script>

<style scoped>
.menu-list-container {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.menu-list-container::-webkit-scrollbar {
  display: none !important; /* Chrome Safari */
}

.copyright {
  font-size: 12px;
  color: rgba(94, 94, 94, 0.4);
  text-align: center;
  word-break: break-all;
  padding: 10px;
}
</style>

<style>
.menu-list-container .el-menu {
  border-right: none;
}
</style>
