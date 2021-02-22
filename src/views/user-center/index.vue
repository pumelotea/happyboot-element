<template>
  <hb-page-layout-full>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="个人信息" name="userInfo">
        <div style="width: 700px">
          <el-form
            ref="userInfoForm"
            :model="infoForm"
            :rules="infoRules"
            label-width="80px"
            style="padding: 20px"
          >
            <el-form-item label="账号">
              <el-input v-model="infoForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="infoForm.nickname"></el-input>
            </el-form-item>
            <el-form-item label="账号类型">
              <el-radio
                v-model="infoForm.userType"
                label="0"
                border
                :disabled="true"
              >主账号</el-radio
              >
              <el-radio
                v-model="infoForm.userType"
                label="1"
                border
                :disabled="true"
              >子账号</el-radio
              >
            </el-form-item>
            <el-form-item
              label="关联账号"
              v-show="infoForm.userType === '1' && userLinkData.length === 0"
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
              <el-button
                style="margin-left: 15px;"
                type="primary"
                @click="handleLink"
              >关联</el-button
              >
            </el-form-item>
            <el-form-item :label="infoForm.userType === '1' ? '主账号' : '子账号'">
              <el-table
                :data="infoForm.userlist"
                size="mini"
                border
                style="width: 100%"
              >
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
            <el-form-item label="头像">
              <hb-avatar-uploader
                :src="picUrl"
                @cropped="onCropped"
              ></hb-avatar-uploader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleInfoSubmit('userInfoForm')">
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="editPassword">
        <div style="width: 700px;">
          <el-form
            ref="userPasswordForm"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="80px"
            style="padding: 20px"
          >
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="passwordForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwordConfirm">
              <el-input
                type="password"
                v-model="passwordForm.passwordConfirm"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePasswordSubmit('userPasswordForm')">
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </hb-page-layout-full>
</template>

<script lang='ts'>
import HbAvatarUploader from '@/components/HbAvatarUploader.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { self } from '@/common'

export default {
  name: 'index',
  components: {
    HbAvatarUploader
  },
  setup() {
    const context = self()

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== passwordForm.value.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const activeTab = ref('')
    const infoForm = ref({
      id: 0,
      nickname: '',
      status: 1,
      headPic: ''
    })
    const infoRules = {
      nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }]
    }
    const passwordForm = ref({
      id: '',
      password: '',
      passwordConfirm: ''
    })
    const passwordRules = {
      password: [
        { required: true, message: '请输入密码', trigger: 'change' }
      ],
      passwordConfirm: [
        { required: true, validator: validatePass, trigger: 'blur' }
      ]
    }
    const selectLoading = ref(false)
    const linkUser = ref('')
    const linkOptions = ref([])
    const userLinkData = ref([])

    const imgId2Url = (id: string) => {
      return context.$api.$imgId2Url(id)
    }

    const userInfo = computed(() => {
      return context.$security.getUser().value.data
    })

    const activeName = computed(() => {
      return context.$store.getters['userCenterActiveName']
    })

    watch(activeTab, () => {
      if (activeTab.value === 'userInfo') {
        open()
      }
    })

    watch(activeName,() => {
      activeTab.value = activeName.value
    })

    const updateUserInfo = async () => {
      const res: any = await context.$api.userGet(userInfo.value.id)
      if (res.code === 0) {
        let user = context.$security.getUser()
        user.value.data = res.data
      }
    }

    const handleInfoSubmit = async (formName: any) => {
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
      ;(infoForm as any).value.userIdList = userIdList
      const res: any = await context.$api.userEdit(infoForm.value)
      if (res.code === 0) {
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        await updateUserInfo()
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const open = async () => {
      const res: any = await context.$api.userGet(userInfo.value.id)
      if (res.code === 0) {
        infoForm.value = res.data
        userLinkData.value = res.data.userlist
      } else {
        linkUser.value = ''
        linkOptions.value = []
        userLinkData.value = []
      }
    }

    const remoteMethod = async (query: any) => {
      if (query !== '') {
        selectLoading.value = true
        const res: any = await context.$api.queryMainAccountList(query)
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
          (userLinkData as any).value.push({
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
        if (row.id === (userLinkData.value[i] as any).id) {
          index = i
        }
      }
      userLinkData.value.splice(index, 1)
    }

    const onCropped = async (can: any) => {
      const data = await new Promise(resolve => {
        can.toBlob((data: any) => {
          resolve(data)
        })
      })
      const res: any = await context.$api.uploadImage(data)
      if (res.code === 0) {
        infoForm.value.headPic = res.data
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const handlePasswordSubmit = async (formName: string) => {
      const valid = await new Promise(resolve => {
        context.$refs[formName].validate( (v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      passwordForm.value.id = userInfo.value.id
      const res: any = await context.$api.userPwd(passwordForm.value)
      if (res.code === 0) {
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        passwordForm.value.password = ''
        passwordForm.value.passwordConfirm = ''
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const picUrl = ref(imgId2Url(infoForm.value.headPic))

    onMounted(() => {
      activeTab.value = activeName.value
    })

    return {
      imgId2Url,
      updateUserInfo,
      handleInfoSubmit,
      open,
      handleLink,
      remoteMethod,
      handleUnLink,
      onCropped,
      handlePasswordSubmit,
      activeTab,
      infoForm,
      infoRules,
      passwordForm,
      passwordRules,
      selectLoading,
      linkUser,
      linkOptions,
      userLinkData,
      userInfo,
      activeName,
      picUrl
    }
  }
}
</script>

<style scoped>

</style>
