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
            <template #defalut="scope">
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
import { defineComponent, getCurrentInstance, ref, nextTick } from 'vue'
import apis from '@/apis'
export default defineComponent({
  name: 'UserInfoDrawer',
  components: {
    AvatarUploader
  },
  setup(props, { emit }) {
    const currentInstance: any = getCurrentInstance()

    let isShow = false
    let selectLoading = false
    let userInfoDrawerDeploy: any = {}
    let linkUser: any = []
    let linkOptions: any = []
    let userLinkData: any = []
    const form: any = ref({
      id: 0,
      nickname: '',
      status: 1,
      headPic: ''
    })
    const rules = { nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }] }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise(resolve => {
        currentInstance.ctx.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      //将关联账号列表里的id 放到userIdList里
      let userIdList: any = []
      userLinkData.map((e: any) => {
        userIdList.push(e.id)
      })
      form.value.userIdList = userIdList
      const res: any = await apis.userEdit(form.value)
      if (res.code === 0) {
        isShow = false
        currentInstance.ctx.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        currentInstance.ctx.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (deploy: any, data:any) => {
      isShow = true
      userInfoDrawerDeploy = deploy
      nextTick(() => {
        if (data != null && data !== '') {
          apis.userGet(data).then((res: any) => {
            if (res.code === 0) {
              form.value = res.data
              userLinkData = res.data.userlist
            }
          })
          linkUser = ''
          linkOptions = []
          userLinkData = []
        }
      })
    }

    const remoteMethod = async (query: any) => {
      if (query !== '') {
        selectLoading = true
        const res:any = await apis.queryMainAccountList(query)
        if (res.code === 0) {
          linkOptions = res.data
        }
        selectLoading = false
      } else {
        linkOptions = []
      }
    }

    const handleLink = () => {
      linkOptions.map((e: any) => {
        if (e.id === linkUser) {
          userLinkData.push({
            id: e.id,
            username: e.username,
            nickname: e.nickname
          })
        }
      })
    }

    const handleUnLink = (row: any) => {
      let index = 0
      for (let i = 0; i < userLinkData.length; i++) {
        if (row.id === userLinkData[i].id) {
          index = i
        }
      }
      userLinkData.splice(index, 1)
    }

    const onCropped = async (can: any) => {
      const data: any = await new Promise(resolve => {
        can.toBlob((data: any) => {
          resolve(data)
        })
      })
      const res: any = await apis.uploadImage(data)
      if (res.code === 0) {
        form.value.headPic = res.data
      } else {
        currentInstance.ctx.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const imgId2Url = (data:any) => {
      return apis.$imgId2Url(data)
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
