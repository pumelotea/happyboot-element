  <template>
    <div class="head-bar">
      <head-bar-logo />
      <div class="actions">
        <el-link
          class="action-item"
          :underline="false"
          href="javascript:void(0)"
          @click="$store.commit('toggleIsCollapse')"
        >
          <i class="el-icon-s-unfold" v-if="isCollapse"></i>
          <i class="el-icon-s-fold" v-else></i>
        </el-link>
      </div>
      <div class="space"></div>
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
          >
            <i class="el-icon-lock"></i>
          </el-link>
        </el-tooltip>
        <el-link class="action-item" :underline="false">
          <el-tooltip
            class="item"
            effect="dark"
            content="数据大屏"
            placement="bottom"
          >
            <i class="el-icon-data-analysis"></i>
          </el-tooltip>
        </el-link>
        <el-link
          class="action-item"
          :underline="false"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="外观配置"
            placement="bottom"
          >
            <i class="el-icon-brush"></i>
          </el-tooltip>
        </el-link>
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
  import { computed, defineComponent, ref } from 'vue'
  import HeadBarLogo from '@/components/HeadBarLogo.vue'
  import { self } from '@/common'
  import { loadCssFile, removeCssFile } from '@/common/utils'

  export default defineComponent({
    name: 'HeadBar',
    components: { HeadBarLogo },
    computed: {
      ...mapGetters(['isCollapse','activeTheme'])
    },
    setup() {
      const { $router, $security, $api, $store } = self()
      const themeNameMap:any = $store.getters['themeNameMap']

      const setTheme = (theme: string) => {
        $store.commit('setTheme',theme)

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

      const switchUser = () => {
        $router.push('/switch-user')
      }

      const logout = () => {
        $security.signOut()
        $router.push('/login')
      }
      return {
        userType,
        nickname,
        headImage,
        themeNameMap,
        switchUser,
        logout,
        editUserInfo,
        editPassword,
        setTheme
      }
    }
  })
  </script>

  <style scoped>
  /*.head-bar {*/
  /*  height: 100%;*/
  /*  width: 100%;*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  border-bottom: 1px solid rgba(128, 128, 128, 0.2);*/
  /*  box-sizing: border-box;*/
  /*}*/


  /*.space {*/
  /*  flex: 1;*/
  /*}*/

  /*.actions {*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  align-content: center;*/
  /*  justify-content: center;*/
  /*}*/

  /*.action-item {*/
  /*  padding: 0 10px;*/
  /*  cursor: pointer;*/
  /*  font-size: 20px;*/
  /*  !*color: rgba(0, 0, 0, 0.5);*!*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  align-content: center;*/
  /*  justify-content: center;*/
  /*}*/

  /*.collapse-width-menu {*/
  /*  width: 64px;*/
  /*  transition: all 0.2s ease-in-out;*/
  /*}*/

  /*.uncollapse-width-menu {*/
  /*  width: 220px;*/
  /*  transition: all 0.2s ease-in-out;*/
  /*}*/

  /*.nickname {*/
  /*  font-size: 14px;*/
  /*  color: white;*/
  /*  margin-right: 10px;*/
  /*}*/

  /*.view-port-name {*/
  /*  font-size: 14px;*/
  /*}*/

  </style>
  <style>
  /*#__user-avatar .el-avatar {*/
  /*  display: flex;*/
  /*}*/
  </style>
