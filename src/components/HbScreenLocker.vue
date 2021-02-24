<template>
  <transition enter-active-class="hb-screen-locker-lock" leave-active-class="hb-screen-locker-unlock">
    <div class="hb-screen-locker" v-if="show">
      <div class="form">
        <div class="form-item">
          <el-avatar :size="80" :src="imgId2Url(user.data.headPic)"></el-avatar>
        </div>
        <div class="form-item">
          <span class="nickname">{{user.data.nickname}}</span>
        </div>
        <div class="form-item">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="登陆密码"
            clearable v-model="password">
          </el-input>
        </div>
        <div class="form-item">
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
        <div class="form-item">
          <el-button  style="width: 100%" type="primary" @click="login">解锁</el-button>
        </div>
        <div class="form-item">
          <el-button  style="width: 100%" @click="logout">注销</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import {self} from '@/common'
import { $imgId2Url } from '@/apis'
import { resetFramework } from 'happykit'

export default defineComponent({
  name: 'HbScreenLocker',
  setup(){
    const {$store,$security,$api,$router,$notify,$happykit} = self()
    const user = $security.getUser()
    const show = computed(()=>{
      return $store.getters.lock
    })

    const password = ref('')
    const kaptchaImage = ref('')
    const kaptchaId = ref('')
    const code = ref('')
    const getKaptcha = async () => {
      const kaptcha: any = await $api.getKaptcha()
      if (kaptcha.code === 0) {
        kaptchaId.value = kaptcha.data.id
        kaptchaImage.value = 'data:image/png;base64,' + kaptcha.data.base64ImgStr
      }
    }
    onMounted(getKaptcha)
    watch(show,()=>{
      if (show.value){
        getKaptcha()
      }
    })

    const login = async () => {
      //登录操作前先清空一遍数据保障正常执行

      const res: any = await $api.login(
        user.value.data.username,
        password.value,
        kaptchaId.value,
        code.value
      )
      if (res.code === 0) {
        const data = res.data
        $security.refreshToken(data.token)
        $store.commit('setUserType', { userType: data.userinfo.userType })
        $store.commit('lock',false)
        password.value = ''
        code.value = ''
      } else {
        $notify({
          title: '验证失败',
          message: res.msg,
          type: 'error'
        })
        await getKaptcha()
      }
    }



    const logout = ()=>{
      $security.signOut()
      resetFramework($happykit)
      $store.commit('lock',false)
      $router.push('/login')
    }

    return {
      show,
      user,
      imgId2Url:$imgId2Url,
      password,
      kaptchaId,
      kaptchaImage,
      getKaptcha,
      code,
      login,
      logout
    }
  }
})
</script>
