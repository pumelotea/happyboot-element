<template>
  <div class="head-bar">
    <hb-head-bar-logo />
    <div class="actions">
      <el-link
        v-if="setting.leftSlot === 'menu'"
        class="action-item"
        :underline="false"
        href="javascript:void(0)"
        @click="$store.commit('toggleIsCollapse')"
      >
        <i class="el-icon-s-unfold" v-if="isCollapse"></i>
        <i class="el-icon-s-fold" v-else></i>
      </el-link>
    </div>
    <div class="space">
      <slot></slot>
    </div>
    <div class="actions">
      <el-tooltip
        class="item"
        effect="dark"
        content="系统锁屏"
        placement="bottom"
      >
        <el-link
          class="action-item"
          :underline="false"
          href="javascript:void(0)"
          @click="$store.commit('lock', true)"
        >
          <i class="el-icon-lock"></i>
        </el-link>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="外观配置"
        placement="bottom"
      >
        <el-link
          class="action-item"
          :underline="false"
          href="javascript:void(0)"
          @click="$store.commit('settingDialog', true)"
        >
          <i class="el-icon-brush"></i>
        </el-link>
      </el-tooltip>
      <el-link
        class="action-item"
        :underline="false"
        href="javascript:void(0)"
        @click="setTheme(themeNameMap[activeTheme].next)"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="themeNameMap[activeTheme].name"
          placement="bottom"
        >
          <i :class="themeNameMap[activeTheme].icon"></i>
        </el-tooltip>
      </el-link>
      <div class="action-item" id="__user-avatar">
        <span class="nickname">{{ nickname }}</span>
        <el-dropdown trigger="click">
          <div class="el-dropdown-links">
            <el-avatar :src="headImage"></el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click='editUserInfo'>
                <span><i class="el-icon-edit-outline"></i>修改信息</span>
              </el-dropdown-item>
              <el-dropdown-item @click='editPassword'>
                <span><i class="el-icon-lock"></i>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item @click='securityLog'>
                <span><i class="el-icon-lock"></i>安全日志</span>
              </el-dropdown-item>
              <el-dropdown-item disabled
              ><i class="el-icon-mobile-phone"></i>改绑手机
              </el-dropdown-item
              >
              <el-dropdown-item
                divided
                @click="switchUser"
                v-show="userType === '0'"
              >
                <i class="el-icon-s-custom"></i>切换账号
              </el-dropdown-item>
              <el-dropdown-item
                @click="logout"
                :divided="userType !== '0'"
              >
                <i class="el-icon-switch-button"></i>退出系统
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { computed, defineComponent } from 'vue'
import HbHeadBarLogo from '@/components/HbHeadBarLogo.vue'
import { self } from '@/common'

export default defineComponent({
  name: 'HbHeadBar',
  components: { HbHeadBarLogo },
  computed: {
    ...mapGetters(['isCollapse', 'activeTheme'])
  },
  setup() {
    const { $router, $security, $api, $store } = self()
    const themeNameMap: any = $store.getters['themeNameMap']

    const setTheme = (theme: string) => {
      $store.commit('setTheme', theme)

    }

    const userInfo = computed(() => {
      return $security.getUser().value?.data
    })

    const userType = computed(() => {
      return $store.getters['userType']
    })

    const nickname = computed(() => {
      return userInfo.value?.nickname
    })

    const headImage = computed(() => {
      return $api.$imgId2Url(userInfo.value?.headPic)
    })

    const editUserInfo = () => {
      //把要打开的tab名字存到localstorage里
      $store.commit('setUserCenterActiveName', { activeName: 'userInfo' })
      $router.push('/user-center', '个人中心')
    }

    const editPassword = () => {
      //把要打开的tab名字存到localstorage里
      $store.commit('setUserCenterActiveName', { activeName: 'editPassword' })
      $router.push('/user-center', '个人中心')
    }

    const securityLog = () => {
      //把要打开的tab名字存到localstorage里
      $store.commit('setUserCenterActiveName', { activeName: 'securityLog' })
      $router.push('/user-center', '个人中心')
    }

    const switchUser = () => {
      $router.push('/switch-user')
    }

    const logout = () => {
      $security.signOut()
      $router.push('/login')
    }

    const setting = computed(() => {
      return $store.getters.layoutSetting
    })
    return {
      userType,
      nickname,
      headImage,
      themeNameMap,
      switchUser,
      logout,
      editUserInfo,
      editPassword,
      securityLog,
      setTheme,
      setting
    }
  }
})
</script>
