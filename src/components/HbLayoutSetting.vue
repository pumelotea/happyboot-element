<template>
  <el-dialog
    title="自定义布局"
    v-model="dialogFormVisible"
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

    return {
      dialogFormVisible,
      form,
      setLayout
    }
  }
})
</script>

<style scoped>

</style>
