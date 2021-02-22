<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'字典名称'">
            <el-input v-model="tableData.searchCondition.dictName" />
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'字典编码'">
            <el-input v-model="tableData.searchCondition.dictCode" />
          </hb-form-item-container>
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
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column fixed prop="dictCode" align="center" label="字典编码" />
      <el-table-column prop="dictName" align="center" label="字典名称" />
      <el-table-column prop="description" align="center" label="字典描述" />
      <el-table-column prop="status" align="center" label="状态" width="60">
        <template #default="scope">
          <span style="color: #e4979b" v-if="scope.row.status === 0">禁用</span>
          <span style="color: #8290ff" v-if="scope.row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template #default="scope">
          <el-button @click="handleDictionaryConfig(scope.row)" type="text"
            >字典配置</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
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
    <dictionary-info-drawer ref="DID" @ok="handleSearch" />
    <dictionary-config-drawer ref="DCD" @openConfigItemDrawer="openConfigItemDrawer" />
    <dictionary-config-item-drawer ref="DCID" @ok="dictItemOk" />
  </hb-page-layout>
</template>

<script lang='ts'>
import DictionaryInfoDrawer from '@/views/dictionary/drawer/DictionaryInfoDrawer.vue'
import DictionaryConfigDrawer from '@/views/dictionary/drawer/DictionaryConfigDrawer.vue'
import DictionaryConfigItemDrawer from '@/views/dictionary/drawer/DictionaryConfigItemDrawer.vue'
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'
export default defineComponent ({
  name: 'index',
  components: {
    DictionaryInfoDrawer,
    DictionaryConfigDrawer,
    DictionaryConfigItemDrawer
  },
  setup() {
    const context = self()

    const DID: any = ref(null)
    const DCD: any = ref(null)
    const DCID: any = ref(null)

    const tableData: any = ref({
      searchCondition: {
        dictCode: '',
        dictName: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const dictionaryInfoDrawerDeploy: any = ref({})
    const tableSelectedData:any = ref([])

    const pageSizeChange = (val:any) => {
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
      const res: any = await context.$api.dictPage(tableData.value.searchCondition)
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
      dictionaryInfoDrawerDeploy.value.title = '新增'
      dictionaryInfoDrawerDeploy.value.haveSubmit = true
      dictionaryInfoDrawerDeploy.value.disabled = false
      dictionaryInfoDrawerDeploy.value.mode = 'add'
      ;(DID.value as any).open(dictionaryInfoDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      dictionaryInfoDrawerDeploy.value.title = '编辑'
      dictionaryInfoDrawerDeploy.value.haveSubmit = true
      dictionaryInfoDrawerDeploy.value.disabled = false
      dictionaryInfoDrawerDeploy.value.mode = 'edit'
      ;(DID.value as any).open(dictionaryInfoDrawerDeploy.value, row)
    }

    const handleDictionaryConfig = (row: any) => {
      (DCD.value as any).open(row.id)
    }

    const handleDelete = (row: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.dictDelete(row.id).then((res: any) => {
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

          context.$api.dictDelete(ids.substr(1)).then((res: any) => {
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
      tableData.value.searchCondition.dictCode = ''
      tableData.value.searchCondition.dictName = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20

      handleSearch()
    }

    const openConfigItemDrawer = (mode: any, data: any) => {
      if (mode === 'edit') {
        const dictionaryConfigItemDrawerDeploy = { title: '修改', mode: 'edit' }
        ;(DCID.value as any).open(dictionaryConfigItemDrawerDeploy, data)
      } else if (mode === 'add') {
        const dictionaryConfigItemDrawerDeploy = { title: '新增', mode: 'add' }
        ;(DCID.value as any).open(dictionaryConfigItemDrawerDeploy, data)
      }
    }

    const dictItemOk = () => {
      (DCD.value as any).handleSearch()
    }

    onMounted(() => {
      handleSearch()
    })

    return {
      pageSizeChange,
      currentClick,
      handleConditionSearch,
      handleSearch,
      tableSelected,
      handleAdd,
      handleEdit,
      handleDictionaryConfig,
      handleDelete,
      handleMultiDelete,
      handleReset,
      openConfigItemDrawer,
      dictItemOk,
      tableData,
      dictionaryInfoDrawerDeploy,
      tableSelectedData,
      DID,
      DCD,
      DCID
    }
  }
})
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
