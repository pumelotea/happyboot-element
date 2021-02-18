<template>
  <page-layout id="page_facility_group">
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'功能组名称'">
            <el-input
              v-model="tableData.searchCondition.facilityGroupName"
            ></el-input>
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
          >
            新增
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="handleConditionSearch"
          >
            查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="handleReset">
            重置
          </el-button>
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableSelectedData.length > 0"
          >
            批量删除
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
      <el-table-column prop="facilityGroupName" align="center" label="功能名称">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button
            permission-key="link"
            @click="handleLink(scope.row)"
            type="text"
            >关联</el-button
          >
          <el-button
            permission-key="edit"
            @click="handleEdit(scope.row)"
            type="text"
            >编辑</el-button
          >
          <el-button
            permission-key="delete"
            @click="handleDelete(scope.row)"
            type="text"
            style="color: red"
            >删除</el-button
          >
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
    <group-drawer ref="GD" @ok="handleSearch" />
    <point-link-drawer ref="PD" />
  </page-layout>
</template>

<script lang='ts'>
import GroupDrawer from '@/views/facility/facility-group/drawer/GroupDrawer.vue'
import PointLinkDrawer from "@/views/facility/facility-group/drawer/PointLinkDrawer.vue";
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  components: {
    GroupDrawer,
    PointLinkDrawer
  },
  setup() {
    const context = self()

    const PD: any = ref(null)
    const GD: any = ref(null)

    const tableData = ref({
      searchCondition: {
        facilityGroupName: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const groupDrawerDeploy: any = ref({})
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

      const res: any = await context.$api.facilityGroupPage(
        tableData.value.searchCondition
      )
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
      groupDrawerDeploy.value.title = '新增'
      groupDrawerDeploy.value.haveSubmit = true
      groupDrawerDeploy.value.disabled = false
      groupDrawerDeploy.value.mode = 'add'
      ;(GD.value as any).open(groupDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      groupDrawerDeploy.value.title = '编辑'
      groupDrawerDeploy.value.haveSubmit = true
      groupDrawerDeploy.value.disabled = false
      groupDrawerDeploy.value.mode = 'edit'
      ;(GD.value as any).open(groupDrawerDeploy.value, row)
    }

    const handleLink = (row: any) => {
      (PD.value as any).open(row.id)
    }

    const handleDelete = (row: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.facilityGroupDelete(row.id).then((res: any) => {
            if (res.code === 0) {
              tableData.value.searchCondition.pageNo = 1
              handleSearch()
              context.$notify({
                type: 'success',
                title: '提示',
                message: '删除成功！'
              })
            } else {
              context.$notify({
                type: 'error',
                title: '提示',
                message: res.msg
              })
            }
          })
        })
    }

    const handleMultiDelete = () => {
      context.$confirm(
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

          context.$api.facilityGroupDelete(ids.substr(1)).then((res: any) => {
            if (res.code === 0) {
              tableData.value.searchCondition.pageNo = 1
              handleSearch()
              context.$notify({
                type: 'success',
                title: '提示',
                message: '删除成功！'
              })
            } else {
              context.$notify({
                type: 'error',
                title: '提示',
                message: res.msg
              })
            }
          })
        })
    }

    const handleReset = () => {
      tableData.value.searchCondition.facilityGroupName = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20

      handleSearch()
    }

    onMounted(() => {
      handleSearch()
    })

    return {
      currentClick,
      pageSizeChange,
      handleConditionSearch,
      handleSearch,
      tableSelected,
      handleAdd,
      handleEdit,
      handleLink,
      handleDelete,
      handleMultiDelete,
      handleReset,
      tableData,
      groupDrawerDeploy,
      tableSelectedData,
      GD,
      PD
    }
  }
})
</script>

<style scoped></style>
