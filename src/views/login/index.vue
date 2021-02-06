<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-actions">
        <div class="login-form-content">
          <div class="login-title">
            <img class="login-logo" src="favicon.svg" draggable="false" />
          </div>
          <div class="login-subtitle">
            <text-logo />
          </div>
          <div class="login-form-item">
            <el-input
              prefix-icon="el-icon-user"
              placeholder="用户名"
              clearable
              v-model="username"
            />
          </div>
          <div class="login-form-item">
            <el-input
              prefix-icon="el-icon-lock"
              placeholder="密码"
              type="password"
              clearable
              v-model="password"
            />
          </div>
          <div class="login-form-item">
            <div style="display: flex">
              <div style="flex: 1;margin-right: 5px">
                <el-input
                  prefix-icon="el-icon-key"
                  placeholder="验证码"
                  clearable
                  v-model="code"
                />
              </div>
              <div>
                <img
                  v-if="kaptchaId"
                  @click="getKaptcha"
                  style="height: 40px;width: 100px"
                  :src="kaptchaImage"
                />
              </div>
            </div>
          </div>
          <div class="login-form-item">
            <el-checkbox v-model="saveLoginStatusLocal"
            >记住登录状态
            </el-checkbox
            >
          </div>
          <div class="login-form-item">
            <el-button style="width: 100%" plain type="primary" @click="login">
              登录
            </el-button>
          </div>
          <div class="login-form-item" style="margin-bottom: 150px">
            <el-link :underline="false" style="margin-right: 5px">
              忘记密码
            </el-link>
            <el-link :underline="false">没有账号</el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="wave">
      <img src="../../../public/images/wave.svg">
    </div>
  </div>
</template>

<script lang='ts'>
import { ref, computed, onMounted, onBeforeUnmount} from 'vue'
import TextLogo from '@/components/TextLogo.vue'
import { self } from '@/common'

export default {
  name: 'index',
  components: { TextLogo },
  setup() {
    const { $security, $api, $store, $router, $notify } = self()

    const kaptchaImage = ref('')
    const kaptchaId = ref('')
    const username = ref('admin')
    const password = ref('123456')
    const code = ref('')
    const saveLoginStatusLocal = ref(false)
    let user: any = {
      saveLoginStatus: true,
      data: null
    }

    const getKaptcha = async () => {
      const kaptcha: any = await $api.getKaptcha()
      if (kaptcha.code === 0) {
        kaptchaId.value = kaptcha.data.id
        kaptchaImage.value = 'data:image/png;base64,' + kaptcha.data.base64ImgStr
      }
    }

    const login = async () => {
      //登录操作前先清空一遍数据保障正常执行
      $security.signOut()

      const res: any = await $api.login(
        username.value,
        password.value,
        kaptchaId.value,
        code.value
      )
      if (res.code === 0) {
        const data = res.data
        user.saveLoginStatus = saveLoginStatusLocal.value
        user.data = data.userinfo
        $security.signIn(data.token, user)
        $store.commit('setUserType', { userType: data.userinfo.userType })

        if (data.userlist_count === 0) {
          $router.push('/')
        } else {
          $router.push('/switch-user')
        }
      } else {
        $notify({
          title: '登录失败',
          message: res.msg,
          type: 'error'
        })
      }
    }

    const onKeyEnter = (e: any) => {
      if (e.keyCode === 13) {
        login()
      }
    }

    const saveLoginStatus = computed(() => {
      let user = $security.getUser().value
      if (user) {
        return user.saveLoginStatus
      } else {
        return false
      }
    })

    const token = $security.getToken()

    onMounted(() => {
      document.addEventListener('keypress', onKeyEnter)
      getKaptcha()
      //如果记住登录，并且存在token就跳转进入首页
      if (saveLoginStatus.value && token) {
        $router.push('/')
        return
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keypress', onKeyEnter)
    })

    return {
      kaptchaImage,
      kaptchaId,
      username,
      password,
      code,
      saveLoginStatusLocal,
      login,
      getKaptcha,
      onKeyEnter,
      user
    }
  }
}
</script>

<style scoped>
/*.login-container {*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  top: 0;*/
/*  background: url('../../../public/images/body.svg');*/
/*  display: flex;*/
/*  background-repeat: no-repeat;*/
/*  background-position: 50%;*/
/*  background-size: 100%;*/
/*  background-color: rgb(14,17,22);*/
/*}*/

/*.login-form {*/
/*  width: 330px;*/
/*  margin: auto;*/
/*  display: flex;*/
/*}*/

/*.login-actions {*/
/*  width: 100%;*/
/*  display: flex;*/
/*}*/

/*.login-form-content {*/
/*  margin: auto;*/
/*  width: 100%;*/
/*}*/

/*.login-title {*/
/*  font-size: 60px;*/
/*  color: #93a6b8;*/
/*  text-align: center;*/
/*}*/

/*.login-subtitle {*/
/*  font-size: 20px;*/
/*  color: slategrey;*/
/*  text-align: center;*/
/*  margin-bottom: 30px;*/
/*}*/

/*.login-form-item {*/
/*  margin-top: 10px;*/
/*}*/

/*.login-logo {*/
/*  width: 100px;*/
/*  margin-bottom: 30px;*/
/*}*/

/*.wave {*/
/*  position: absolute;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  justify-content: flex-end;*/
/*  pointer-events: none;*/
/*}*/

/*.wave img {*/
/*  width: 100%;*/
/*}*/
</style>
