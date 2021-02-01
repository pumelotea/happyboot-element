<template>
  <div class="nav-bar-container">
    <div class="nav-wrap">
      <el-tabs
        v-show="navList.length > 0"
        v-model="activeTab"
        type="card"
        closable
        @edit="handleTabsEdit"
        @tab-click="goto"
      >
        <template v-for="item in navList" :key="item.pageId">
          <el-tab-pane
            :name="item.pageId"
            :pageId="item.pageId"
          >
            <template v-if="item.title.length >= 10" #label>
              <el-tooltip :content="item.title">
                <span>
                  {{ textOverflow(item.title)}}
                </span>
              </el-tooltip>
            </template>
            <template v-else #label>
              <span>{{ item.title }}</span>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="tab-actions" v-if="navList.length > 0">
      <el-dropdown trigger="hover">
        <div class="el-dropdown-link">
          <div class="tab-actions-bg">
            <a style="margin: auto;">
              <i class="el-icon-arrow-down"></i>
            </a>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.self="closeTabs(0)">
              <i class="el-icon-back"></i>关闭左侧
            </el-dropdown-item>
            <el-dropdown-item @click.self="closeTabs(1)">
              <i class="el-icon-right"></i>关闭右侧
            </el-dropdown-item>
            <el-dropdown-item @click.self="closeTabs(2)">
              <i class="el-icon-close"></i>关闭其他
            </el-dropdown-item>
            <el-dropdown-item @click.self="closeTabs(3)">
              <i class="el-icon-error"></i>关闭全部
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { NavCloseType } from 'happykit'
import {getHappykitInstance} from '@/framework'
import router from '@/router'

export default defineComponent({
  setup(){

    const hkf = getHappykitInstance()
    const navList = hkf.getNavList()
    const currentRouteMenu = hkf.getCurrentMenuRoute()


    const activeTab = ref('')


    watch(currentRouteMenu,()=>{
      activeTab.value = currentRouteMenu.value?.pageId || ''
    })

    onMounted(()=>{
      activeTab.value = currentRouteMenu.value?.pageId || ''
    })

    const textOverflow = (value:string) => {
      return String(value).length < 10
        ? value
        : `${String(value).substr(0, 10)}...`
    }

    const goto = (ins:any) => {
      hkf.clickNavItem(ins.instance.attrs.pageId, (a: any, needNavs: any) => {
        if (needNavs.length>0){
          router.push(needNavs[0].to)
        }
      })
    }

    const handleTabsEdit = (pageId:string, action:string) => {
      if ('remove' === action) {
        hkf.closeNav(NavCloseType.SELF, pageId, (removedNavs: any, needNavs: any) => {
          if (needNavs.length>0){
            router.push(needNavs[0].to)
          }

          if (navList.value.length === 0){
            router.push('/')
          }
        })
      }
    }

    const closeTabs = (type:number) => {
      const tp: any = [ NavCloseType.LEFT, NavCloseType.RIGHT, NavCloseType.OTHER,NavCloseType.ALL, NavCloseType.SELF]
      hkf.closeNav(tp[type], currentRouteMenu.value?.pageId, (removedNavs: any, needNavs: any) => {
        if (needNavs.length>0){
          router.push(needNavs[0].to)
        }
        if (navList.value.length === 0){
          router.push('/')
        }
      })
    }

    return {
      navList,
      activeTab,
      textOverflow,
      goto,
      handleTabsEdit,
      closeTabs
    }
  }
})
</script>

<style scoped>
.nav-bar-container {
  display: flex;
  align-items: center;
  align-content: center;
  height: 100%;
  width: 100%;
  /*overflow: auto;*/
  box-sizing: border-box;
}

.tab-actions {
  margin-left: 5px;
  width: 40px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
}
.tab-actions-bg {
  background: white;
  border-radius: 3px;
  width: 35px;
  height: 35px;
  display: flex;
  cursor: pointer;
}
</style>

<style>
.nav-bar-container .el-tabs__header {
  margin: 0;
}

.nav-bar-container .el-tabs--card > .el-tabs__header {
  /*border-bottom-color: transparent;*/
  border: none;
}

.nav-bar-container .el-tabs__nav {
  background: white;
}

.nav-wrap {
  width: calc(100% - 50px);
  padding-left: 5px;
  display: inline-block;
}
.el-tabs__nav-next,
.el-tabs__nav-prev {
  display: flex;
  align-items: center;
  align-self: center;
  align-content: center;
  height: 100% !important;
  font-size: unset;
  line-height: unset;
}
</style>
