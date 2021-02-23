<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'标题'">
            <el-input
              placeholder="请输入标题"
              v-model="tableData.searchCondition.title"
            />
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'标签'">
            <el-select
              v-model="tableData.searchCondition.label"
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
          <el-button type="primary" size="medium" @click="pageConditionSearch"
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
            v-show="tableData.selectedRow.length > 0"
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
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      />
    </template>
    <form-drawer ref="FD" @handleSubmit="handleSearch" />
    <detail-drawer ref="DD" />
  </hb-page-layout>
</template>
<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue'
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import DetailDrawer from './drawer/DetailDrawer.vue'
import { timeFormat } from '@/common/utils'
import { createPage } from '@/common/page'
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
        label: {
          default:'',
          reset: ''
        },
        title: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.getKnowledge,
      deleteAPI:context.$api.deleteKnowledge
    })

    const esLabelOptions: any = ref({})

    //初始化字典
    const getDict = async (success: any, error: any) => {
      const res: any = await context.$api.dictItemsMap('KNOWLEDGE_LABEL')
      if (res.code === 0) {
        success(res.data)
      } else {
        error()
      }
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

    const handleAdd = () => {
      (FD.value as any).add()
    }

    const handleEdit = (row: any) => {
      (FD.value as any).edit({ id: row.id })
    }

    const handleDetail = (row: any) => {
      context.$router.push({path:'/mb-mgt/knowledge-detail',query:{knowledgeId:row.id}}, row.title)
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
    })

    return {
      getDict,
      initDict,
      pageSizeChange,
      pageNoChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      handleReset,
      formatTime,
      formatText,
      rowSelected,
      pageConditionSearch,
      tableData,
      esLabelOptions,
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
