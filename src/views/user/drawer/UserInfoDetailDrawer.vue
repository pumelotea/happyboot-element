<template>
  <hb-drawer-layout v-model="isShow" :title="userInfoDrawerDeploy.title">
    <el-form
      ref="userInfoForm"
      :model="form"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="form.nickname" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="账号类型">
        <el-radio v-model="form.userType" label="0" border :disabled="true"
        >主账号
        </el-radio
        >
        <el-radio v-model="form.userType" label="1" border :disabled="true"
        >子账号
        </el-radio
        >
      </el-form-item>
      <el-form-item :label="form.userType === '1' ? '主账号' : '子账号'">
        <el-table :data="form.userlist" size="mini" border style="width: 100%">
          <el-table-column
            prop="username"
            align="center"
            label="账号"
            width="150"
          >
          </el-table-column>
          <el-table-column prop="nickname" align="center" label="姓名">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          disabled
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="头像">
        <el-avatar
          shape="square"
          :src="imgId2Url(form.headPic)"
          :size="100"
        ></el-avatar>
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'UserInfoDrawer',
  setup() {
    const context = self()

    let isShow = ref(false)
    let form: any = reactive({
      id: '',
      username: '',
      nickname: '',
      status: 1,
      headPic: ''
    })
    let userInfoDrawerDeploy: any = ref({})

    const open = (deploy: any, data: any) => {
      isShow.value = true
      userInfoDrawerDeploy.value = deploy
      nextTick(() => {
        if (data !== null && data !== '') {
          context.$api.userGet(data).then((res: any) => {
            if (res.code === 0) {
              Object.assign(form, res.data)
            }
          })
        }
      })
    }

    const imgId2Url = (data: any) => {
      return context.$api.$imgId2Url(data)
    }

    return {
      open,
      imgId2Url,
      isShow,
      form,
      userInfoDrawerDeploy
    }
  }
})
</script>

<style scoped>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
