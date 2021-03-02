<template>
  <div class="switch-user-container">
    <div class="login-form">
      <div class="login-actions">
        <div class="login-form-content">
          <div class="login-title">
            <img class="login-logo" src="favicon.svg" draggable="false" />
          </div>
          <div class="login-subtitle">
            <hb-text-logo/>
          </div>
          <div class="login-form-item">
            <div class="user-list" id="switch-user">
              <div
                class="card-item active"
                :class="u.id === selectedUser ? 'card-item-active' : ''"
                v-for="u in userList"
                :key="u.id"
                @click="selectUser(u)"
              >
                <div class="card-content">
                  <div class="card-content-avatar">
                    <el-avatar
                      :size="48"
                      :src="imgId2Url(u.avatar)"
                    ></el-avatar>
                  </div>
                  <div class="card-content-body">
                    <div class="card-content-up" :title="u.nickname+u.username">
                      <i
                        class="el-icon-star-on yellow"
                        v-show="u.usertype === '0'"
                      ></i>
                      {{ u.nickname }}({{ u.username }})
                    </div>
                    <div class="card-content-down" :title="u.subjectname+u.deptname">
                      {{ u.subjectname }}
                      <span v-show="u.subjectname">-</span>
                      {{ u.deptname }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="login-form-item">
            <el-button style="width: 100%" plain type="primary" @click="login">
              登录
            </el-button>
          </div>
          <div class="login-form-item">
            <el-button style="width: 100%" plain type="danger" @click="out">
              退出
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { onMounted, ref } from 'vue'
import { resetFramework } from 'happykit'
import { self } from '@/common'

export default {
  name: 'index',
  setup() {
    const context = self()

    let userList = ref([])
    let selectedUser = ref('')

    const selectUser = (user: any) => {
      selectedUser.value = user.id
    }

    const user = context.$security.getUser()

    const login = async () => {
      if (selectedUser.value === '') {
        context.$notify({
          title: '登录失败',
          message: '请选择登录账号',
          type: 'error'
        })
        return
      }

      if (user.value.data.id === selectedUser.value){
        resetFramework(context.$happykit)
        context.$router.push('/')
        return
      }

      const res: any = await context.$api.switchLogin(selectedUser.value)
      if (res.code === 0) {
        //登录操作前先清空一遍数据保障正常执行
        resetFramework(context.$happykit)

        user.value.data = res.data.userinfo
        context.$security.refreshToken(res.data.token)
        context.$security.refreshUser(user.value)

        context.$router.push('/')
      } else {
        context.$notify({
          title: '登录失败',
          message: res.msg,
          type: 'error'
        })
      }

    }

    const out = async () => {
      context.$security.signOut()
      context.$router.push('/login')
    }

    const getUserList = async () => {
      const res: any = await context.$api.userlist()
      if (res.code === 0) {
        userList.value = res.data
        res.data.map( (e: any) => {
          if (e.active) {
            selectedUser.value = e.id
          }
        })
      }
    }

    const imgId2Url = (id: string) => {
      return context.$api.$imgId2Url(id)
    }

    onMounted(async () => {
      await getUserList()
    })

    return {
      userList,
      user,
      selectedUser,
      login,
      out,
      selectUser,
      imgId2Url
    }
  }
}
</script>
