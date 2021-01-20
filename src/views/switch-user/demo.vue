<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-actions">
        <div class="login-form-content">
          <div class="login-title">
            <img class="login-logo" src="favicon.svg" draggable="false" />
          </div>
          <div class="login-subtitle">
            happyboot
          </div>
          <div class="login-form-item">
            <div class="user-list" id="switch-user">
              <div
                class="card-item active"
                :class="user.id === selectedUser ? 'card-item-active' : ''"
                v-for="user in userList"
                :key="user.id"
                @click="selectUser(user)"
              >
                <div class="card-content">
                  <div class="card-content-avatar">
                    <el-avatar
                      :size="48"
                      :src="$imgId2Url(user.avatar)"
                    ></el-avatar>
                  </div>
                  <div class="card-content-body">
                    <div class="card-content-up" :title="user.nickname+user.username">
                      <i
                        class="el-icon-star-on yellow"
                        v-show="user.usertype === '0'"
                      ></i>
                      {{ user.nickname }}({{ user.username }})
                    </div>
                    <div class="card-content-down" :title="user.subjectname+user.deptname">
                      {{ user.subjectname }}
                      <span v-show="user.subjectname">-</span>
                      {{ user.deptname }}
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

<script>
export default {
  data() {
    return {
      userList: [],
      selectedUser: ''
    }
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user.id
    },
    async login() {
      if (this.selectedUser === '') {
        this.$notify({
          title: '登录失败',
          message: '请选择登录账号',
          type: 'error'
        })
      } else {
        const res = await this.$api.selectLogin(this.selectedUser)
        if (res.code === 0) {
          //登录操作前先清空一遍数据保障正常执行
          this.$store.commit('framework/cleanUserData')
          const data = res.data
          this.$store.commit('framework/setCurrentUserInfo', data)
          this.$router.push('/')
        } else {
          this.$notify({
            title: '登录失败',
            message: res.msg,
            type: 'error'
          })
        }
      }
    },
    async out() {
      this.$store.commit('framework/logout')
    }
  },
  async mounted() {
    const res = await this.$api.userlist()
    if (res.code === 0) {
      this.userList = res.data
      this.userList.map(e => {
        if (e.active) {
          this.selectedUser = e.id
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: url('../../../public/images/body.svg');
  display: flex;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
}

.login-form {
  width: 330px;
  margin: auto;
  display: flex;
}

.login-actions {
  width: 100%;
  display: flex;
}

.login-form-content {
  margin: auto;
  width: 100%;
}

.login-title {
  font-size: 60px;
  color: #93a6b8;
  text-align: center;
}

.login-subtitle {
  font-size: 20px;
  color: slategrey;
  text-align: center;
  margin-bottom: 30px;
}

.login-form-item {
  margin-top: 10px;
}
.login-logo {
  width: 100px;
  margin-bottom: 30px;
}

.user-list {
  max-height: 325px;
  overflow: auto;
  background: #f6f6f6;
  border-radius: 5px;
}

.card-item {
  cursor: pointer;
  padding: 10px 15px;
  transition: 0.3s;
}

.card-item + .card-item {
  border-top: 1px solid #e0e0e0;
}

.card-item:hover {
  background: #ececec;
}

.card-item-active {
  background: #ececec;
  transition: 0.3s;
}

.card-content {
  display: flex;
}
.card-content-avatar {
  width: 65px;
  display: flex;
  align-items: center;
}
.card-content-body {
  flex: 1;
  padding-left: 10px;
}
.card-content-up {
  width: 240px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-content-down {
  width: 240px;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.yellow {
  color: #ffb700;
}
</style>
