<template>
  <el-dialog
    title="自定义布局"
    v-model="dialogFormVisible"
    width="700px"
    @close="()=>{$store.commit('settingDialog',false)}"
  >
    <el-form v-model="form">
      <el-form-item label="顶栏" label-width="120px">
        <el-radio-group v-model="form.topSlot" size="medium">
          <el-radio-button label="bread">面包屑</el-radio-button>
          <el-radio-button label="nav">导航</el-radio-button>
          <el-radio-button label="menu">菜单</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="左侧栏" label-width="120px">
        <el-radio-group v-model="form.leftSlot" size="medium">
          <el-radio-button label="menu">菜单</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导航栏" label-width="120px">
        <el-radio-group v-model="form.navSlot" size="medium">
          <el-radio-button label="nav">导航</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="页面面包屑" label-width="120px">
        <el-radio-group v-model="form.pageBreadSlot" size="medium">
          <el-radio-button label="enable">面包屑</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="面包屑图标" label-width="120px">
        <el-radio-group v-model="form.breadIcon" size="medium">
          <el-radio-button label="enable">启用</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导航栏图标" label-width="120px">
        <el-radio-group v-model="form.navIcon" size="medium">
          <el-radio-button label="enable">启用</el-radio-button>
          <el-radio-button label="disable">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="layout-setting-container">
      <div class="layout">
        <div class="head-bar">
          <div class="logo">LOGO</div>
          <div class="slot" :class="{'slot-disable':form.topSlot ==='disable'}">
            {{dict[form.topSlot]}}
          </div>
          <div class="actions"></div>
        </div>
        <div class="menu" v-if="form.leftSlot !== 'disable'">
          菜单
        </div>
        <div class="nav-bar" v-if="form.navSlot !== 'disable'" :class="{'menu-disable':form.leftSlot ==='disable'}">导航</div>
      </div>
    </div>
    <template #footer>
      <el-button @click="$store.commit('settingDialog',false)">取消</el-button>
      <el-button type="primary" @click="setLayout">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'HbLayoutSetting',
  setup() {

    const { $store } = self()

    const dialogFormVisible = computed({
      get:() => {
        return $store.getters.settingDialog
      },
      set:val=>{
        $store.commit('settingDialog',val)
      }
    })
    const form = computed({
      get: () => {
        return $store.getters.layoutSetting
      },
      set: val => {
        $store.commit('setLayoutSetting', val)
      }
    })

    const setLayout = () => {
      $store.commit('settingDialog',false)
      $store.commit('setLayoutSetting',form.value)
    }

    const dict = {
      nav:'导航',
      menu:'菜单',
      bread:'面包屑',
    }

    return {
      dialogFormVisible,
      form,
      dict,
      setLayout
    }
  }
})
</script>
