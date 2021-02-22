<template>
  <hb-drawer-layout :loading="drawerLoading" v-model="drawer" :title="title">
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="类型" prop="type">
        <el-radio v-model="form.type" label="menu">菜单</el-radio>
        <el-radio v-model="form.type" label="button">按钮</el-radio>
        <el-radio v-model="form.type" label="action">接口</el-radio>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!-- 按钮------------------------begin -->
      <template v-if="form.type === 'button'">
        <el-form-item label="按钮标识" prop="permissionKey">
          <el-input v-model="form.permissionKey"></el-input>
        </el-form-item>
      </template>
      <!-- 按钮------------------------end -->
      <!-- 接口------------------------begin -->
      <template v-if="form.type === 'action'">
        <el-form-item label="请求类型" prop="requestType">
          <el-select v-model="form.requestType" placeholder="请选择">
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
          <el-input v-model="form.path"></el-input>
        </el-form-item>
      </template>
      <!-- 接口------------------------end -->
      <!-- 菜单------------------------begin -->
      <template v-if="form.type === 'menu'">
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon">
            <template #suffix>
              <i class="el-input__icon el-icon-setting" @click="iconSelect"></i>
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
            />
          </el-form-item>
          <!-- 是外链 -->
          <template v-if="form.externalLink">
            <el-form-item label="跳转模式" prop="linkTarget">
              <el-select v-model="form.linkTarget" placeholder="请选择">
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
                <el-input v-model="form.path"></el-input>
              </el-form-item>
              <el-form-item label="视图" prop="view">
                <el-input v-model="form.view"></el-input>
              </el-form-item>
              <el-form-item label="是否首页" prop="home">
                <el-switch
                  v-model="form.home"
                  active-text="是"
                  inactive-text="否"
                  :active-value="true"
                  :inactive-value="false"
                />
              </el-form-item>
            </template>
            <el-form-item label="外链" prop="externalLinkAddress">
              <el-input v-model="form.externalLinkAddress"></el-input>
            </el-form-item>
          </template>
          <!-- 不是外链 -->
          <template v-if="!form.externalLink">
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item label="视图" prop="view">
              <el-input v-model="form.view"></el-input>
            </el-form-item>
            <el-form-item label="是否缓存" prop="keepalive">
              <el-switch
                v-model="form.keepalive"
                active-text="是"
                inactive-text="否"
                :active-value="true"
                :inactive-value="false"
              />
            </el-form-item>
            <el-form-item label="是否首页" prop="home">
              <el-switch
                v-model="form.home"
                active-text="是"
                inactive-text="否"
                :active-value="true"
                :inactive-value="false"
              />
            </el-form-item>
          </template>
        </template>
        <!-- 非路由 -->
        <template v-if="!form.router">
          <el-form-item label="路径" prop="path" :rules="[]">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="隐藏路由" prop="hide">
          <el-switch
            v-model="form.hide"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
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
        />
      </el-form-item>
      <el-form-item label="排序号" prop="orderId">
        <el-input-number v-model="form.orderId" :min="0" />
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>

    <icons v-show="showIcons" @iconChoose="iconChoose" />
  </hb-drawer-layout>
</template>
<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'
import Icons from '../icon/index.vue'
import { partialCopying } from '@/common/utils'
export default defineComponent ({
  components: {
    Icons
  },
  setup(props, { emit }) {
    const context = self()

    const forms: any = ref(null)

    const drawerLoading = ref(false)
    const drawer = ref(false)
    const showIcons = ref(false)
    const title = ref('')
    const form = ref({
      id: '', //自己的id
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
    const linkTargetMap = [
      { name: '页内标签', value: '_tab' },
      { name: '当前标签', value: '_self' },
      { name: '浏览器标签', value: '_blank' }
    ]
    const requestTypeMap = [
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
      { name: 'PUT', value: 'PUT' },
      { name: 'DELETE', value: 'DELETE' },
      { name: 'HEAD', value: 'HEAD' },
      { name: 'CONNECT', value: 'CONNECT' },
      { name: 'OPTIONS', value: 'OPTIONS' },
      { name: 'TRACE', value: 'TRACE' }
    ]
    const rules = {
      name: [
        { required: true, message: '请输入菜单名称', trigger: 'change' }
      ],
      requestType: [
        { required: true, message: '请输入请求类型', trigger: 'change' }
      ],
      path: [
        { required: true, message: '请输入路由地址', trigger: 'change' }
      ],
      view: [
        { required: true, message: '请输入视图容器', trigger: 'change' }
      ],
      permissionKey: [
        { required: true, message: '请输入按钮标识', trigger: 'change' }
      ]
    }

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getMenuTreeNode(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const editNode = async (params: any) => {
      const res: any = await context.$api.editMenuTree(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        submitSuccess()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      drawerLoading.value = false
    }

    const addNode = async (params: any) => {
      const res: any = await context.$api.addMenuTree(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        submitSuccess()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      drawerLoading.value = false
    }

    const add = (data: any = { parentId: '0' }) => {
      drawer.value = true
      title.value = '新增'
      initForm(data)
    }

    const edit = (data: any) => {
      drawer.value = true
      title.value = '编辑'
      getNodeData(data.id, (res: any) => {
        initForm(res)
      })
    }

    const initForm = (data: any) => {
      form.value.id = ''
      form.value.parentId = '0'
      form.value.name = ''
      form.value.path = ''
      form.value.view = ''
      form.value.router = true
      form.value.keepalive = true
      form.value.externalLink = false
      form.value.linkTarget = '_tab'
      form.value.externalLinkAddress = ''
      form.value.type = 'menu'
      form.value.permissionKey = ''
      form.value.icon = ''
      form.value.status = 1
      form.value.orderId = 0
      form.value.hide = false
      form.value.home = false

      //如果是action则截取字符串
      if (data.type === 'action') {
        const temp = data.path.split('/')
        data.requestType = temp[0]
        data.path = data.path.substring(temp[0].length, data.path.length)
      }
      nextTick(() => {
        (forms.value as any).resetFields()
        form.value = partialCopying(form.value, data)
      })
    }

    const close = () => {
      drawer.value = false
    }

    const handleSubmit = () => {
      drawerLoading.value = true
      ;(forms.value as any).validate((valid: any) => {
        if (!valid) {
          drawerLoading.value = false
          return
        }
        if (form.value.type === 'action') {
          form.value.path = form.value.requestType + form.value.path
        }
        if (!form.value.id) {
          addNode(form.value)
        } else {
          editNode(form.value)
        }
      })
    }

    const submitSuccess = () => {
      emit('handleSubmit', form.value)
      close()
    }

    const iconSelect = () => {
      showIcons.value = true
    }

    const iconChoose = (ico: any) => {
      if (ico) {
        form.value.icon = ico
      }
      showIcons.value = false
    }

    return {
      initForm,
      add,
      edit,
      close,
      addNode,
      editNode,
      handleSubmit,
      submitSuccess,
      getNodeData,
      iconChoose,
      iconSelect,
      drawer,
      drawerLoading,
      showIcons,
      title,
      form,
      linkTargetMap,
      requestTypeMap,
      rules,
      forms
    }
  }
})
</script>
