<template>
  <page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'主体名称'">
            <el-input v-model="tableData.searchCondition.subjectName" />
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
      <el-table-column prop="subjectName" align="center" label="主体名称">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template #default="scope">
          <el-button
            @click="handleRegionLink(scope.row)"
            type="text"
            permission-key="regionLink"
            >区域关联</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link" type="text">更多<em class="el-icon-arrow-down el-icon--right" /></el-button>
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

    <subject-drawer ref="SD" @ok="handleSearch" />
    <region-link-drawer ref="RLD" />
  </page-layout>
</template>

<script lang='ts'>
import SubjectDrawer from './drawer/SubjectDrawer.vue'
import RegionLinkDrawer from './drawer/RegionLinkDrawer.vue'
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import apis from '@/apis'
export default defineComponent ({
  name: 'index',
  components: {
    SubjectDrawer,
    RegionLinkDrawer
  },
  setup() {
    const currentInstance: any = getCurrentInstance()

    const SD: any = ref(null)
    const RLD: any = ref(null)

    const tableData: any = ref({
      searchCondition: {
        subjectName: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const subjectDrawerDeploy: any = ref({})
    const regionLinkDrawerDeploy: any = ref({})
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
      const res: any = await apis.subjectPage(tableData.value.searchCondition)
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
      subjectDrawerDeploy.value.title = '新增'
      subjectDrawerDeploy.value.haveSubmit = true
      subjectDrawerDeploy.value.disabled = false
      subjectDrawerDeploy.value.mode = 'add'
      ;(SD.value as any).open(subjectDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      subjectDrawerDeploy.value.title = '编辑'
      subjectDrawerDeploy.value.haveSubmit = true
      subjectDrawerDeploy.value.disabled = false
      subjectDrawerDeploy.value.mode = 'edit'
      ;(SD.value as any).open(subjectDrawerDeploy.value, row)
    }

    const handleDetail = (row: any) => {
      subjectDrawerDeploy.value.title = '详情'
      subjectDrawerDeploy.value.haveSubmit = false
      subjectDrawerDeploy.value.disabled = true
      ;(SD.value as any).open(subjectDrawerDeploy.value, row)
    }

    const handleRegionLink = (row: any) => {
      (RLD.value as any).open(row)
    }

    const handleDelete = (row: any) => {
      currentInstance.ctx.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apis.subjectDelete(row.id).then((res: any) => {
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

          apis.subjectDelete(ids.substr(1)).then((res: any) => {
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
      tableData.value.searchCondition.subjectName = ''
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
      handleRegionLink,
      handleDelete,
      handleDetail,
      handleMultiDelete,
      handleReset,
      tableData,
      subjectDrawerDeploy,
      regionLinkDrawerDeploy,
      tableSelectedData,
      SD,
      RLD
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
