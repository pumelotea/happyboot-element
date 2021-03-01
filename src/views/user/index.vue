<template>
  <hb-page-layout id="page_user">
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'账号'">
            <el-input v-model="tableData.searchCondition.account"></el-input>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'状态'">
            <el-select
              clearable
              v-model="tableData.searchCondition.status"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataDict.STATUS?.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'账号类型'">
            <el-select
              clearable
              v-model="tableData.searchCondition.userType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataDict.USER_TYPE?.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            permission-key="add"
            size="medium"
            @click="handleAdd"
          >新增
          </el-button>
          <el-button type="primary" size="medium" @click="pageConditionSearch"
          >查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="handleReset"
          >重置
          </el-button>
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableData.selectedRow.length > 0"
          >批量删除
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
      size="mini"
      :data="tableData.list"
      @selection-change="rowSelected"
      border
      v-loading="tableData.loading"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        prop="username"
        align="center"
        label="账号"
        width="150"
      />
      <el-table-column
        prop="nickname"
        align="center"
        label="姓名"
        width="120"
      />
      <el-table-column prop="headPic" align="center" label="头像" width="100">
        <template #default="scope">
          <el-avatar
            shape="square"
            :src="imgId2Url(scope.row.headPic)"
            size="large"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="账号类型" width="90">
        <template #default="scope">
          <span :style="`color:${userTypeColor[scope.row.userType]}`">
            {{ dataDict.USER_TYPE?.mappings[scope.row.userType] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastIp"
        align="center"
        label="最后登录ip"
        width="120"
      />
      <el-table-column prop="status" align="center" label="状态" width="60">
        <template #default="scope">
          <span :style="`color:${statusColor[scope.row.status]}`">
            {{ dataDict.STATUS?.mappings[scope.row.status] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        align="center"
        label="最后登录时间"
      />
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text"
          >查看
          </el-button>
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link" type="text"
            >更多<em class="el-icon-arrow-down el-icon--right"
            /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button
                    @click="handleDelete(scope.row)"
                    type="text"
                    permission-key="delete"
                    style="color: red"
                  >
                    删除
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="handlePasswordChange(scope.row)" type="text">
                    密码修改
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="handleRoleLink(scope.row)" type="text">
                    角色关联
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="handleDeptLink(scope.row)" type="text">
                    部门关联
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="handleRegionLink(scope.row)" type="text">
                    区域关联
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    @click="handleFacilityGroupLink(scope.row)"
                    type="text"
                  >
                    配置功能
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    @click="handleFacilityConfigurationLink(scope.row)"
                    type="text"
                  >
                    参数配置
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    @click="handleLoginOperate(scope.row)"
                    type="text"
                  >
                    登录管理
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        background
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      >
      </el-pagination>
    </template>

    <user-info-drawer ref="UID" @ok="handleSearch" />
    <user-info-edit-drawer ref="UIED" @ok="handleSearch" />
    <user-info-detail-drawer ref="UIDD" />
    <role-link-drawer ref="RLD" />
    <dept-link-drawer ref="DLD" />
    <region-link-drawer ref="ReLD" />
    <facility-group-link-drawer ref="FGLD" />
    <user-password-edit-drawer ref="UPED" />
    <facility-configuration-drawer ref="FCD" />
    <login-operate-drawer ref='LOD' />
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent, toRefs } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'
import { loadDict } from '@/common/dict'

import UserInfoDrawer from './drawer/UserInfoDrawer.vue'
import UserInfoEditDrawer from './drawer/UserInfoEditDrawer.vue'
import UserInfoDetailDrawer from './drawer/UserInfoDetailDrawer.vue'
import RoleLinkDrawer from './drawer/RoleLinkDrawer.vue'
import DeptLinkDrawer from './drawer/DeptLinkDrawer.vue'
import RegionLinkDrawer from './drawer/RegionLinkDrawer.vue'
import UserPasswordEditDrawer from './drawer/UserPasswordEditDrawer.vue'
import FacilityGroupLinkDrawer from './drawer/FacilityGroupLinkDrawer.vue'
import FacilityConfigurationDrawer from './drawer/FacilityConfigurationDrawer.vue'
import LoginOperateDrawer from '@/views/user/drawer/LoginOperateDrawer.vue'
import { drawerLoader } from '@/common/drawer'

export default defineComponent({
  name: 'index',
  components: {
    UserInfoDrawer,
    UserInfoEditDrawer,
    UserInfoDetailDrawer,
    RoleLinkDrawer,
    DeptLinkDrawer,
    RegionLinkDrawer,
    UserPasswordEditDrawer,
    FacilityGroupLinkDrawer,
    FacilityConfigurationDrawer,
    LoginOperateDrawer
  },
  setup() {
    const context = self()
    const drawer = drawerLoader()

    const statusColor = ['#ea0143', '#02b654', '#0290ef']
    const userTypeColor = ['#0290ef', '#fc7070']

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageNoChange,
      pageSizeChange,
      rowSelected,
      pageConditionSearch,
      defaultPageReset: handleReset,
      defaultDeleteHandle:handleDelete,
      defaultMultiDeleteHandle:handleMultiDelete
    } = createPage({
      conditions: {
        account: {
          default:'',
          reset: ''
        },
        status: {
          default:'',
          reset: ''
        },
        userType: {
          default:'',
          reset: ''
        }
      },
      dataAPI: context.$api.userPage,
      deleteAPI:context.$api.userDelete
    })

    const { dataDict } = loadDict(['STATUS','USER_TYPE'])

    const userInfoDrawerDeploy: any = {}
    const roleLinkDrawerDeploy: any = {}

    const handleAdd = () => {
      userInfoDrawerDeploy.title = '新增'
      userInfoDrawerDeploy.haveSubmit = true
      userInfoDrawerDeploy.disabled = false
      drawer('UID').open(userInfoDrawerDeploy, '')
    }

    const handleEdit = (row: any) => {
      userInfoDrawerDeploy.title = '编辑'
      userInfoDrawerDeploy.haveSubmit = true
      userInfoDrawerDeploy.disabled = false
      drawer('UIED').open(userInfoDrawerDeploy, row.id)
    }

    const handleDetail = (row: any) => {
      userInfoDrawerDeploy.title = '详情'
      userInfoDrawerDeploy.haveSubmit = false
      userInfoDrawerDeploy.disabled = true
      drawer('UIDD').open(userInfoDrawerDeploy, row.id)

    }

    const handlePasswordChange = (row: any) => {
      userInfoDrawerDeploy.title = '密码修改'
      userInfoDrawerDeploy.haveSubmit = true
      userInfoDrawerDeploy.disabled = false
      drawer('UPED').open(userInfoDrawerDeploy, row.id)

    }

    const handleRoleLink = (row: any) => {
      drawer('RLD').open(row.id)
    }

    const handleDeptLink = (row: any) => {
      drawer('DLD').open(row)
    }

    const handleRegionLink = (row: any) => {
      drawer('ReLD').open(row)
    }

    const handleFacilityGroupLink = (row: any) => {
      drawer('FGLD').open(row.id)
    }

    const handleFacilityConfigurationLink = (row: any) => {
      drawer('FCD').open(row.id)
    }

    const handleLoginOperate = (row: any) => {
      drawer('LOD').open(row.id)
    }

    const imgId2Url = (data: any) => {
      return context.$api.$imgId2Url(data)
    }

    return {
      imgId2Url,
      handleReset,
      handleMultiDelete,
      handleDelete,
      handleFacilityConfigurationLink,
      handleFacilityGroupLink,
      pageSizeChange,
      pageNoChange,
      handleAdd,
      handleEdit,
      handlePasswordChange,
      handleDetail,
      handleRegionLink,
      handleRoleLink,
      handleDeptLink,
      handleSearch,
      rowSelected,
      pageConditionSearch,
      handleLoginOperate,
      dataDict,
      statusColor,
      userTypeColor,
      tableData,
      userInfoDrawerDeploy,
      roleLinkDrawerDeploy,
    }
  }
})
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  margin-left: 10px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
