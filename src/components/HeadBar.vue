<template>
  <div class="head-bar">
    <div
      class="logo"
      :class="{
        'collapse-width-menu': isCollapse,
        'uncollapse-width-menu': !isCollapse,
        'brand-collapse': isCollapse
      }"
    >
      <span v-if="!isCollapse" :class="{ brand: !isCollapse }">
        happy
      </span>
      <img v-if="isCollapse" class="logo-svg" src="favicon.svg" />
      <span v-if="!isCollapse">boot</span>
    </div>
    <div class="actions">
      <a
        class="action-item"
        @click="$store.commit('toggleIsCollapse')"
      >
        <i class="el-icon-s-unfold" v-if="isCollapse"></i>
        <i class="el-icon-s-fold" v-else></i>
      </a>
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
      <div class="action-item" id="__user-avatar">
        <span class="nickname">用户昵称</span>
        <el-dropdown trigger="click">
          <div class="el-dropdown-links">
            <el-avatar></el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span><i class="el-icon-edit-outline"></i>修改信息</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span><i class="el-icon-lock"></i>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item disabled
              ><i class="el-icon-mobile-phone"></i>改绑手机
              </el-dropdown-item
              >
              <el-dropdown-item
                divided
              >
                <i class="el-icon-s-custom"></i>切换账号
              </el-dropdown-item>
              <el-dropdown-item
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

<script>
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeadBar',
  computed: {
    ...mapGetters(['isCollapse'])
  }
})
</script>

<style scoped>
.head-bar {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  box-sizing: border-box;
}

.logo {
  width: 220px;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 30px;
}

.space {
  flex: 1;
}

.actions {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.action-item {
  padding: 0 10px;
  cursor: pointer;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.collapse-width-menu {
  width: 64px;
  transition: all 0.2s ease-in-out;
}

.uncollapse-width-menu {
  width: 220px;
  transition: all 0.2s ease-in-out;
}

.brand {
  color: #007cff;
  font-weight: bold;
}

.brand-collapse {
  color: #007cff !important;
  font-weight: bold;
}

.nickname {
  font-size: 14px;
  color: #505050;
  margin-right: 10px;
}

.view-port-name {
  font-size: 14px;
}

.logo-svg {
  width: 40px;
}
</style>
<style>
#__user-avatar .el-avatar {
  display: flex;
}
</style>
