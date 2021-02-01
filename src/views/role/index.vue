<template>
  <page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'角色名称'">
            <el-input v-model="tableData.searchCondition.roleName"></el-input>
          </form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="handleAdd"
            permission-key="add"
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="handleConditionSearch"
            >查询</el-button
          >
          <el-button type="primary" size="medium" plain @click="handleReset"
            >重置</el-button
          >
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableSelectedData.length > 0"
            >批量删除
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
      size="mini"
      :data="tableData.list"
      @selection-change="tableSelected"
      border
      v-loading="tableData.loading"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" width="50">
      </el-table-column>
      <!--      <el-table-column fixed prop="authorityName" align="center" label="角色编码"> </el-table-column>-->
      <el-table-column prop="roleName" align="center" label="角色名称">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" width="60">
        <template #default="scope">
          <span style="color: #e4979b" v-if="scope.row.status === 0">禁用</span>
          <span style="color: #8290ff" v-if="scope.row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handlePermissionLink(scope.row)" type="text"
            >权限</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link" type="text"
              >更多<em class="el-icon-arrow-down el-icon--right"
            /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item>
                <el-button
                  permission-key="delete"
                  @click="handleDelete(scope.row)"
                  type="text"
                  style="color: red"
                  >删除</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="handleDetail(scope.row)" type="text"
                  >查看</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="currentClick"
      >
      </el-pagination>
    </template>

    <role-info-drawer ref="RID" @ok="handleSearch" />
    <permission-link-drawer ref="PLD" />
  </page-layout>
</template>

<script lang='ts'>
import RoleInfoDrawer from './drawer/RoleInfoDrawer.vue'
import PermissionLinkDrawer from './drawer/PermissionLinkDrawer.vue'
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import apis from '@/apis'
export default defineComponent ({
  name: 'index',
  components: {
    RoleInfoDrawer,
    PermissionLinkDrawer
  },
  setup() {
    const currentInstance: any = getCurrentInstance()

    const RID: any = ref(null)
    const PLD: any = ref(null)

    const tableData: any = ref({
      searchCondition: {
        roleName: '',
        authorityName: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const roleInfoDrawerDeploy: any = ref({})
    const permissionLinkDrawerDeploy: any = ref({})
    const tableSelectedData: any = ref([])

    const pageSizeChange = (val: any) => {
      tableData.value.searchCondition.pageSize = val
      tableData.value.searchCondition.pageNo = 1
      handleSearch()
    }

    const currentClick = (val: any) => {
      tableData.value.searchCondition.pageNo = val
      handleSearch()
    }

    const handleConditionSearch = () => {
      tableData.value.searchCondition.pageNo = 1
      handleSearch()
    }

    const handleSearch = async () => {
      tableData.value.loading = true

      const res: any = await apis.rolePage(tableData.value.searchCondition)
      if (res.code === 0) {
        tableData.value.list = res.data.records
        tableData.value.total = res.data.total
      }

      tableData.value.loading = false
    }

    const tableSelected = (rows: any) => {
      tableSelectedData.value = rows
    }

    const handleAdd = () => {
      roleInfoDrawerDeploy.value.title = '新增'
      roleInfoDrawerDeploy.value.haveSubmit = true
      roleInfoDrawerDeploy.value.disabled = false
      roleInfoDrawerDeploy.value.mode = 'add'
      ;(RID.value as any).open(roleInfoDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      roleInfoDrawerDeploy.value.title = '编辑'
      roleInfoDrawerDeploy.value.haveSubmit = true
      roleInfoDrawerDeploy.value.disabled = false
      roleInfoDrawerDeploy.value.mode = 'edit'
      ;(RID.value as any).open(roleInfoDrawerDeploy.value, row)
    }

    const handleDetail = (row: any) => {
      roleInfoDrawerDeploy.value.title = '详情'
      roleInfoDrawerDeploy.value.haveSubmit = false
      roleInfoDrawerDeploy.value.disabled = true
      ;(RID.value as any).open(roleInfoDrawerDeploy.value, row)
    }

    const handlePermissionLink = (row: any) => {
      (PLD.value as any).open(row)
    }

    const handleDelete = (row: any) => {
      currentInstance.ctx.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apis.roleDelete(row.id).then((res: any) => {
            if (res.code === 0) {
              tableData.value.searchCondition.pageNo = 1
              handleSearch()
              currentInstance.ctx.$notify({
                type: 'success',
                title: '提示',
                message: '删除成功！'
              })
            } else {
              currentInstance.ctx.$notify({
                type: 'error',
                title: '提示',
                message: res.msg
              })
            }
          })
        })
    }

    const handleMultiDelete = () => {
      currentInstance.ctx.$confirm(
        '即将删除这' + tableSelectedData.value.length + '条数据, 是否确认?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = ''
          tableSelectedData.value.forEach((item: any) => {
            ids = ids + ',' + item.id
          })

          apis.roleDelete(ids.substr(1)).then((res: any) => {
            if (res.code === 0) {
              tableData.value.searchCondition.pageNo = 1
              handleSearch()
              currentInstance.ctx.$notify({
                type: 'success',
                title: '提示',
                message: '删除成功！'
              })
            } else {
              currentInstance.ctx.$notify({
                type: 'error',
                title: '提示',
                message: res.msg
              })
            }
          })
        })
    }

    const handleReset = () => {
      tableData.value.searchCondition.roleName = ''
      tableData.value.searchCondition.authorityName = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20
      handleSearch()
    }

    onMounted(() => {
      handleSearch()
    })

    return {
      pageSizeChange,
      currentClick,
      handleConditionSearch,
      tableSelected,
      handleAdd,
      handleReset,
      handleMultiDelete,
      handleDelete,
      handlePermissionLink,
      handleDetail,
      handleEdit,
      RID,
      PLD,
      tableSelectedData,
      permissionLinkDrawerDeploy,
      roleInfoDrawerDeploy,
      tableData
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
