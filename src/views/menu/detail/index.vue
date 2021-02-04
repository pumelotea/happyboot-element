<template>
  <div class="div-detail" v-show="show">
    <el-form ref="forms" :model="form" label-width="80px" style="padding: 20px">
      <el-form-item label="类型" prop="type">
        <el-radio v-model="form.type" label="menu" disabled>菜单</el-radio>
        <el-radio v-model="form.type" label="button" disabled>按钮</el-radio>
        <el-radio v-model="form.type" label="action" disabled>接口</el-radio>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" readonly></el-input>
      </el-form-item>
      <!-- 按钮------------------------begin -->
      <template v-if="form.type === 'button'">
        <el-form-item label="按钮标识" prop="permissionKey">
          <el-input v-model="form.permissionKey" readonly></el-input>
        </el-form-item>
      </template>
      <!-- 按钮------------------------end -->
      <!-- 接口------------------------begin -->
      <template v-if="form.type === 'action'">
        <el-form-item label="请求类型" prop="requestType">
          <el-select v-model="form.requestType" disabled placeholder="请选择">
            <el-option
              v-for="item in requestTypeMap"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求地址" prop="path">
          <el-input v-model="form.path" readonly></el-input>
        </el-form-item>
      </template>
      <!-- 接口------------------------end -->
      <!-- 菜单------------------------begin -->
      <template v-if="form.type === 'menu'">
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" readonly>
            <template #suffix>
              <i class="el-input__icon el-icon-setting"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否路由" prop="router">
          <el-switch
            v-model="form.router"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </el-form-item>
        <!-- 是路由 -->
        <template v-if="form.router">
          <el-form-item label="是否外链" prop="externalLink">
            <el-switch
              v-model="form.externalLink"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              disabled
            />
          </el-form-item>
          <!-- 是外链 -->
          <template v-if="form.externalLink">
            <el-form-item label="跳转模式" prop="linkTarget">
              <el-select
                v-model="form.linkTarget"
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in linkTargetMap"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 外链情况下如果为内标签 -->
            <template v-if="form.linkTarget === '_tab'">
              <el-form-item label="路径" prop="path">
                <el-input v-model="form.path" readonly></el-input>
              </el-form-item>
              <el-form-item label="视图" prop="view">
                <el-input v-model="form.view" readonly></el-input>
              </el-form-item>
              <el-form-item label="是否首页" prop="home">
                <el-switch
                  v-model="form.home"
                  active-text="是"
                  inactive-text="否"
                  :active-value="true"
                  :inactive-value="false"
                  disabled
                />
              </el-form-item>
            </template>
            <el-form-item label="外链" prop="externalLinkAddress">
              <el-input v-model="form.externalLinkAddress" readonly></el-input>
            </el-form-item>
          </template>
          <!-- 不是外链 -->
          <template v-if="!form.externalLink">
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path" readonly></el-input>
            </el-form-item>
            <el-form-item label="视图" prop="view">
              <el-input v-model="form.view" readonly></el-input>
            </el-form-item>
            <el-form-item label="是否缓存" prop="keepalive">
              <el-switch
                v-model="form.keepalive"
                active-text="是"
                inactive-text="否"
                :active-value="true"
                :inactive-value="false"
                disabled
              />
            </el-form-item>
            <el-form-item label="是否首页" prop="home">
              <el-switch
                v-model="form.home"
                active-text="是"
                inactive-text="否"
                :active-value="true"
                :inactive-value="false"
                disabled
              />
            </el-form-item>
          </template>
        </template>
        <!-- 非路由 -->
        <template v-if="!form.router">
          <el-form-item label="路径" prop="path">
            <el-input v-model="form.path" readonly></el-input>
          </el-form-item>
        </template>
        <el-form-item label="隐藏路由" prop="hide">
          <el-switch
            v-model="form.hide"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </el-form-item>
      </template>
      <!-- 菜单------------------------end -->
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
          disabled
        />
      </el-form-item>
      <el-form-item label="排序号" prop="orderId">
        <el-input-number v-model="form.orderId" disabled :min="0" :max="10" />
      </el-form-item>
    </el-form>
    <icons v-show="showIcons" @iconChoose="iconChoose" />
  </div>
</template>
<script lang='ts'>
import Icons from '../icon/index.vue'
import { self } from '@/common'
import { defineComponent, nextTick, ref } from 'vue'
export default defineComponent ({
  components: {
    Icons
  },
  setup() {
    const context = self()

    const show = ref(false)
    const drawerLoading = ref(false)
    const showIcons = ref(false)
    const form = ref({
      // id: '', //自己的id
      parentId: '0', //父节点id
      name: '', //菜单名称
      requestType: '', //请求类型
      path: '', //路径
      view: '', //视图容器
      router: true, //是否路由
      keepalive: true, //是否keepalive
      externalLink: false, //是否外链
      linkTarget: '_tab', //_self刷新自己;_tab页内标签;_blank浏览器标签
      externalLinkAddress: '', //外链地址
      type: 'menu', //菜单还是按钮menu/button
      permissionKey: '', //按钮标识
      icon: '', //图标
      status: 1, //启用禁用
      orderId: 0, //排序
      hide: false, //是否隐藏路由
      home: false //是否首页
    })
    const linkTargetMap = ref([
      { name: '页内标签', value: '_tab' },
      { name: '当前标签', value: '_self' },
      { name: '浏览器标签', value: '_blank' }
    ])
    const requestTypeMap = ref([
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
      { name: 'PUT', value: 'PUT' },
      { name: 'DELETE', value: 'DELETE' },
      { name: 'HEAD', value: 'HEAD' },
      { name: 'CONNECT', value: 'CONNECT' },
      { name: 'OPTIONS', value: 'OPTIONS' },
      { name: 'TRACE', value: 'TRACE' }
    ])

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getMenuTreeNode(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const open = (data: any) => {
      show.value = true
      getNodeData(data.id, (res: any) => {
        initForm(res)
      })
    }

    const initForm = (data: any) => {
      //如果是action则截取字符串
      if (data.type === 'action') {
        const temp = data.path.split('/')
        data.requestType = temp[0]
        data.path = data.path.substring(temp[0].length, data.path.length)
      }
      nextTick(() => {
        Object.assign(form.value, JSON.parse(JSON.stringify(data)))
      })
    }

    const iconChoose = (ico: any) => {
      if (ico) {
        form.value.icon = ico
      }
      showIcons.value = false
    }

    return {
      open,
      iconChoose,
      initForm,
      getNodeData,
      show,
      showIcons,
      drawerLoading,
      form,
      linkTargetMap,
      requestTypeMap
    }
  }
})
</script>

<style scoped>
.div-detail {
  overflow: auto;
  position: relative;
  width: 100%;
  top: -100px;
}
</style>
