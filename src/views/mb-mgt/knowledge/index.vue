<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'标题'">
            <el-input
              placeholder="请输入标题"
              v-model="tableData.searchQuery.title"
            />
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'标签'">
            <el-select
              v-model="tableData.searchQuery.label"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in esLabelOptions"
                :key="key"
                :label="item"
                :value="key"
              />
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
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="handleSearch"
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
            >批量删除</el-button
          >
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
      <el-table-column type="index" align="center" width="50" label="#" />
      <el-table-column prop="title" align="center" label="标题" />
      <el-table-column prop="label" align="center" label="标签">
        <template #default="scope">{{
          esLabelOptions[scope.row.label]
        }}</template>
      </el-table-column>
      <el-table-column prop="content" align="center" label="内容">
        <template #default="scope">{{ formatText(scope.row.content) }}</template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text"
            >查看</el-button
          >
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            permission-key="edit"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            permission-key="delete"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="currentClick"
      />
    </template>
    <form-drawer ref="FD" @handleSubmit="handleSearch" />
    <detail-drawer ref="DD" />
  </hb-page-layout>
</template>
<script lang='ts'>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import DetailDrawer from './drawer/DetailDrawer.vue'
import { timeFormat } from '@/common/utils'
export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer,
    DetailDrawer
  },
  setup() {
    const context = self()

    const FD: any = ref(null)
    const DD: any = ref(null)

    const tableData = reactive({
      searchQuery: {
        label: '',
        title: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const esLabelOptions: any = ref({})
    const tableSelectedData: any = ref([])

    //初始化字典
    const getDict = async (success: any, error: any) => {
      const res: any = await context.$api.dictItemsMap('KNOWLEDGE_LABEL')
      if (res.code === 0) {
        success(res.data)
      } else {
        error()
      }
    }

    //查询
    const search = async (success: any, error: any) => {
      tableData.loading = true
      const res: any = await context.$api.getKnowledge(tableData.searchQuery)
      if (res.code === 0) {
        success(res)
      } else {
        error(res)
      }
      tableData.loading = false
    }

    // 删除 可批量删除，id用,隔开
    const doDelete = async (id: any, success: any, error: any) => {
      tableData.loading = true
      const res: any = await context.$api.deleteKnowledge(id)
      if (res.code === 0) {
        success(res)
      } else {
        error(res)
      }
      tableData.loading = false
    }

    const initDict = () => {
      //初始化字典
      getDict(
          (success: any) => {
            let temp: any = {}
            for (let i = 0; i < success.KNOWLEDGE_LABEL.length; i++) {
              temp[success.KNOWLEDGE_LABEL[i].value] =
                  success.KNOWLEDGE_LABEL[i].label
            }
            esLabelOptions.value = temp
          },
          (err: any) => {
            context.$notify({
              type: 'error',
              title: '提示',
              message: err.msg
            })
          }
      )
    }

    const pageSizeChange = (val: any) => {
      tableData.searchQuery.pageSize = val
      tableData.searchQuery.pageNo = 1
      handleSearch()
    }

    const currentClick = (val: any) => {
      tableData.searchQuery.pageNo = val
      handleSearch()
    }

    const handleSearch = () => {
      search(
          (res: any) => {
            tableData.list = res.data.records
            tableData.total = Number(res.data.total)
          },
          (err: any) => {
            context.$notify({
              type: 'error',
              title: '提示',
              message: err.msg
            })
          }
      )
    }

    const tableSelected = (rows: any) => {
      tableSelectedData.value = rows
    }

    const handleAdd = () => {
      (FD.value as any).add()
    }

    const handleEdit = (row: any) => {
      (FD.value as any).edit({ id: row.id })
    }

    const handleDetail = (row: any) => {
      context.$router.push({path:'/mb-mgt/knowledge-detail',query:{knowledgeId:row.id}}, row.title)
    }

    // 单删
    const handleDelete = (row: any) => {
      const msg = '即将删除该条数据, 是否确认?'
      const ids = row.id
      implementDelete(ids, msg)
    }

    // 多删
    const handleMultiDelete = () => {
      const msg =
          '即将删除这' + tableSelectedData.value.length + '条数据, 是否确认?'
      let ids = ''
      tableSelectedData.value.forEach((item: any) => {
        ids = ids + ',' + item.id
      })
      implementDelete(ids, msg)
    }

    // 执行删除
    const implementDelete = (ids: any, msg: any) => {
      context.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doDelete(
          ids,
          () => {
            tableData.searchQuery.pageNo = 1
            handleSearch()
            context.$notify({
              type: 'success',
              title: '提示',
              message: '删除成功！'
            })
          },
          (err: any) => {
            context.$notify({
              type: 'error',
              title: '提示',
              message: err.msg
            })
          }
        )
      })
    }

    //重置
    const handleReset = () => {
      tableData.searchQuery.label = ''
      tableData.searchQuery.title = ''
      tableData.searchQuery.pageNo = 1
      tableData.searchQuery.pageSize = 20

      handleSearch()
    }

    const formatTime = (val: any) => {
      if (!val) {
        return ''
      }
      return timeFormat(val)
    }

    const formatText = (val: any) => {
      if (!val) {
        return ''
      }
      if (val.length > 20) {
        return val.substring(0, 20) + '...'
      }
      return val
    }

    onMounted(() => {
      initDict()
      handleSearch()
    })

    return {
      getDict,
      initDict,
      search,
      doDelete,
      pageSizeChange,
      currentClick,
      handleSearch,
      tableSelected,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      handleReset,
      implementDelete,
      formatTime,
      formatText,
      tableData,
      esLabelOptions,
      tableSelectedData,
      FD,
      DD
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
