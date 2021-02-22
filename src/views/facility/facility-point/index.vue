<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'功能名称'">
            <el-input
              v-model="tableData.searchCondition.facilityName"
            ></el-input>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'功能平台'">
            <el-select
              v-model="tableData.searchCondition.facilityPlatform"
              clearable
              placeholder="请选择平台"
              style="width: 100%"
            >
              <el-option
                v-for="item in platformOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'功能类型'">
            <el-select
              v-model="tableData.searchCondition.facilityType"
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
      <el-table-column prop="facilityName" align="center" label="功能名称">
      </el-table-column>
      <el-table-column prop="facilityKey" align="center" label="功能标识">
      </el-table-column>
      <el-table-column prop="facilityType" align="center" label="功能类型">
        <template #default="scope">{{
            typeTrans[scope.row.facilityType]
          }}
        </template>
      </el-table-column>
      <el-table-column prop="facilityIcon" align="center" label="图标路径">
      </el-table-column>
      <el-table-column prop="facilityPlatform" align="center" label="功能平台">
        <template #default="scope">{{
            platformTrans[scope.row.facilityPlatform]
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="170">
        <template #default="scope">
          <el-button
            permission-key="configuration"
            @click="handleConfiguration(scope.row)"
            type="text"
          >参数设定
          </el-button
          >
          <el-button
            permission-key="edit"
            @click="handleEdit(scope.row)"
            type="text"
          >编辑
          </el-button
          >
          <el-button
            permission-key="delete"
            @click="handleDelete(scope.row)"
            type="text"
            style="color: red"
          >删除
          </el-button
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
    <point-drawer ref="PD" @ok="handleSearch" />
    <configuration-drawer ref="CD" @ok="handleSearch" />
  </hb-page-layout>
</template>

<script lang='ts'>
import { self } from '@/common'
import PointDrawer from '@/views/facility/facility-point/drawer/PointDrawer.vue'
import ConfigurationDrawer from '@/views/facility/facility-point/drawer/ConfigurationDrawer.vue'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'index',
  components: {
    PointDrawer,
    ConfigurationDrawer
  },
  setup() {
    const context = self()

    const PD: any = ref(null)
    const CD: any = ref(null)

    const tableData = ref({
      searchCondition: {
        facilityName: '',
        facilityPlatform: '',
        facilityType: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const pointDrawerDeploy: any = ref({})
    const platformOptions: any = ref([])
    const platformTrans: any = ref([])
    const typeOptions: any = ref([])
    const typeTrans: any = ref([])
    const tableSelectedData: any = ref([])

    //初始化字典
    const initDict = async () => {
      const res: any = await context.$api.dictItemsMap(
        'FACILITY_PLATFORM,FACILITY_TYPE'
      )
      if (res.code === 0) {
        typeOptions.value = []
        typeOptions.value = res.data.FACILITY_TYPE
        typeTrans.value = []
        res.data.FACILITY_TYPE.map((e: any) => {
          typeTrans[e.value] = e.label
        })
        platformOptions.value = []
        platformOptions.value = res.data.FACILITY_PLATFORM
        platformTrans.value = []
        res.data.FACILITY_PLATFORM.map((e: any) => {
          platformTrans.value[e.value] = e.label
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

      const res: any = await context.$api.facilityPage(tableData.value.searchCondition)
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
      pointDrawerDeploy.value.title = '新增'
      pointDrawerDeploy.value.haveSubmit = true
      pointDrawerDeploy.value.disabled = false
      pointDrawerDeploy.value.mode = 'add'
      ;(PD.value as any).open(pointDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      pointDrawerDeploy.value.title = '编辑'
      pointDrawerDeploy.value.haveSubmit = true
      pointDrawerDeploy.value.disabled = false
      pointDrawerDeploy.value.mode = 'edit'
      ;(PD.value as any).open(pointDrawerDeploy.value, row)
    }

    const handleConfiguration = (row: any) => {
      let configurationDrawerDeploy: any = {}
      configurationDrawerDeploy.title = '配置'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      ;(CD.value as any).open(configurationDrawerDeploy, row)
    }

    const handleDelete = (row: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.facilityDelete(row.id).then((res: any) => {
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

          context.$api.facilityDelete(ids.substr(1)).then((res: any) => {
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
      tableData.value.searchCondition.facilityName = ''
      tableData.value.searchCondition.facilityPlatform = ''
      tableData.value.searchCondition.facilityType = ''
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
      handleConfiguration,
      handleDelete,
      handleMultiDelete,
      handleReset,
      tableData,
      pointDrawerDeploy,
      platformOptions,
      platformTrans,
      typeOptions,
      typeTrans,
      tableSelectedData,
      PD,
      CD
    }
  }
})
</script>

<style scoped></style>
