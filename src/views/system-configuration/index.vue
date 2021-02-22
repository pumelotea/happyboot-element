<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'参数名'">
            <el-input v-model="tableData.searchCondition.key"></el-input>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'类型'">
            <el-select
              v-model="tableData.searchCondition.type"
              clearable
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="handleAdd"
            permission-key="add">
            新增
          </el-button>
          <el-button type="primary" size="medium" @click="handleConditionSearch">
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
            v-show="tableSelectedData.length > 0">
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
      <el-table-column prop="key" align="center" label="参数名">
      </el-table-column>
      <el-table-column prop="value" align="center" label="参数值">
      </el-table-column>
      <el-table-column prop="type" align="center" label="类型">
        <template #default="scope">{{typeTrans[scope.row.type]}}</template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="备注">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text">查看</el-button>
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-button permission-key="delete" @click="handleDelete(scope.row)" type="text" style="color: red">删除</el-button>
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

    <configuration-drawer ref="CD" @ok="handleSearch" />
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'
import ConfigurationDrawer from './drawer/ConfigurationDrawer.vue'
export default defineComponent ({
  name: 'index',
  components: {
    ConfigurationDrawer
  },
  setup() {
    const context = self()

    const CD: any = ref(null)

    const tableData: any = ref({
      searchCondition: {
        key: '',
        value: '',
        type: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const typeOptions: any = ref({})
    const typeTrans: any = ref([])
    const tableSelectedData: any = ref([])
    let configurationDrawerDeploy: any = {}

    //初始化字典
    const initDict = async () => {
      const res: any = await context.$api.dictItemsMap('SYS_CONFIG_TYPE')
      if (res.code === 0) {
        typeOptions.value = []
        typeOptions.value = res.data.SYS_CONFIG_TYPE
        res.data.SYS_CONFIG_TYPE.map((e: any) => {
          typeTrans.value[e.value] = e.label
        })
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

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

      const res = await context.$api.configPage(tableData.value.searchCondition)
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
      configurationDrawerDeploy.title = '新增'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      configurationDrawerDeploy.mode = 'add'
      ;(CD.value as any).open(configurationDrawerDeploy, '')
    }

    const handleEdit = (row: any) => {
      configurationDrawerDeploy.title = '编辑'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      configurationDrawerDeploy.mode = 'edit'
      ;(CD.value as any).open(configurationDrawerDeploy, row)
    }

    const handleDetail = (row: any) => {
      configurationDrawerDeploy.title = '详情'
      configurationDrawerDeploy.haveSubmit = false
      configurationDrawerDeploy.disabled = true
      ;(CD.value as any).open(configurationDrawerDeploy, row)
    }

    const handleDelete = (row: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.configDelete(row.id).then((res: any) => {
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

    const handleMultiDelete =() => {
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

          context.$api.configDelete(ids.substr(1)).then((res: any) => {
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

    const handleReset =() => {
      tableData.value.searchCondition.key = ''
      tableData.value.searchCondition.value = ''
      tableData.value.searchCondition.type = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20

      handleSearch()
    }

    onMounted(async () => {
      await initDict()
      await handleSearch()
    })

    return {
      initDict,
      pageSizeChange,
      currentClick,
      handleConditionSearch,
      handleSearch,
      tableSelected,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      handleReset,
      CD,
      tableData,
      typeOptions,
      typeTrans,
      tableSelectedData
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
