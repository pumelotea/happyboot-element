<template>
  <drawer-layout
    v-model="isShow"
    :outType="userInfoDrawerDeploy.outType"
    :title="userInfoDrawerDeploy.title"
  >
    <el-form
      ref="userInfoForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="账号">
        <el-input v-model="form.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="账号类型">
        <el-radio v-model="form.userType" label="0" border :disabled="true"
          >主账号</el-radio
        >
        <el-radio v-model="form.userType" label="1" border :disabled="true"
          >子账号</el-radio
        >
      </el-form-item>
      <el-form-item
        label="关联账号"
        v-show="form.userType === '1' && userLinkData.length === 0"
      >
        <el-select
          v-model="linkUser"
          filterable
          remote
          reserve-keyword
          placeholder="请输入账号"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          clearable
        >
          <el-option
            v-for="item in linkOptions"
            :key="item.value"
            :label="item.nickname"
            :value="item.id"
          >
            <span style="float: left">{{ item.nickname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.username
            }}</span>
          </el-option>
        </el-select>
        <el-button style="margin-left: 15px;" type="primary" @click="handleLink"
          >关联</el-button
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
          <el-table-column fixed="right" align="center" label="操作">
            <template #default="scope">
              <el-button
                @click="handleUnLink(scope.row)"
                type="danger"
                size="small"
                >解绑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
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
        <avatar-uploader
          :src="imgId2Url(form.headPic)"
          @cropped="onCropped"
        ></avatar-uploader>
      </el-form-item>
    </el-form>
    <template #actions v-if="userInfoDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('userInfoForm')">
        确认
      </el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import AvatarUploader from '@/components/AvatarUploader.vue'
import { defineComponent, ref, nextTick } from 'vue'
import { self } from '@/common'
export default defineComponent({
  name: 'UserInfoDrawer',
  components: {
    AvatarUploader
  },
  setup(props, { emit }) {
    const context = self()

    let isShow = ref(false)
    let selectLoading = ref(false)
    let userInfoDrawerDeploy: any = ref({})
    let linkUser: any = ref([])
    let linkOptions: any = ref([])
    let userLinkData: any = ref([])
    const form: any = ref({
      id: 0,
      nickname: '',
      status: 1,
      headPic: ''
    })
    const rules = { nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }] }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise(resolve => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      //将关联账号列表里的id 放到userIdList里
      let userIdList: any = []
      userLinkData.value.map((e: any) => {
        userIdList.push(e.id)
      })
      form.value.userIdList = userIdList
      const res: any = await context.$api.userEdit(form.value)
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (deploy: any, data:any) => {
      isShow.value = true
      userInfoDrawerDeploy.value = deploy
      nextTick(() => {
        if (data != null && data !== '') {
          context.$api.userGet(data).then((res: any) => {
            if (res.code === 0) {
              form.value = res.data
              userLinkData.value = res.data.userlist
            }
          })
          linkUser.value = ''
          linkOptions.value = []
          userLinkData.value = []
        }
      })
    }

    const remoteMethod = async (query: any) => {
      if (query !== '') {
        selectLoading.value = true
        const res:any = await context.$api.queryMainAccountList(query)
        if (res.code === 0) {
          linkOptions.value = res.data
        }
        selectLoading.value = false
      } else {
        linkOptions.value = []
      }
    }

    const handleLink = () => {
      linkOptions.value.map((e: any) => {
        if (e.id === linkUser.value) {
          userLinkData.value.push({
            id: e.id,
            username: e.username,
            nickname: e.nickname
          })
        }
      })
    }

    const handleUnLink = (row: any) => {
      let index = 0
      for (let i = 0; i < userLinkData.value.length; i++) {
        if (row.id === userLinkData[i].id) {
          index = i
        }
      }
      userLinkData.value.splice(index, 1)
    }

    const onCropped = async (can: any) => {
      const data: any = await new Promise(resolve => {
        can.toBlob((data: any) => {
          resolve(data)
        })
      })
      const res: any = await context.$api.uploadImage(data)
      if (res.code === 0) {
        form.value.headPic = res.data
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const imgId2Url = (data:any) => {
      return context.$api.$imgId2Url(data)
    }

    return {
      open,
      handleSubmit,
      remoteMethod,
      handleLink,
      handleUnLink,
      onCropped,
      imgId2Url,
      isShow,
      selectLoading,
      userInfoDrawerDeploy,
      linkOptions,
      userLinkData,
      linkUser,
      form,
      rules
    }
  }
})
</script>
