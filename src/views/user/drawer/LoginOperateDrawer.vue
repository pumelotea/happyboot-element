<template>
  <hb-drawer-layout
    v-model="isShow"
    :title="loginOperateDrawerDeploy.title"
    size='800px'
  >
    <el-table size="mini" :data="tableList" border style="width: 100%">
      <el-table-column prop="operationTime" align="center" label="登录时间" width='210'></el-table-column>
      <el-table-column prop="clientId" align="center" label="客户端id" width='300'></el-table-column>
      <el-table-column prop="operationPlatform" align="center" label="登录平台" width='80'>
        <template #default="scope">
                <span>
                  {{ dataDict.APP_PLATFORM?.mappings[scope.row.operationPlatform] }}
                </span>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" align="center" label="地区" width='230'></el-table-column>
      <el-table-column prop="ip" align="center" label="登录ip" width='200'></el-table-column>
      <el-table-column prop="ua" align="center" label="UA信息" min-width='300'>
        <template #default="scope">
          <el-tooltip :content="scope.row.ua" placement="top">
            <span>{{ parseUA(scope.row.ua) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="80">
        <template #default="scope">
          <el-button @click="handleOffline(scope.row)" type="text" style="color: red">下线</el-button>
        </template>
      </el-table-column>
    </el-table>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import UAParser from 'ua-parser-js'
import { self } from '@/common'
import { defineComponent, ref } from 'vue'
import { loadDict } from '@/common/dict'

export default defineComponent ({
  name: 'LoginOperateDrawer',
  setup() {
    const context = self()

    const { dataDict } = loadDict(['APP_PLATFORM'])

    const tableList: any = ref([])

    const userId = ref('')

    const isShow = ref(false)
    const loginOperateDrawerDeploy: any = {
      title: '登录管理'
    }

    const open = (data: any) => {
      userId.value = data
      isShow.value = true
      handleSearch()

    }

    const handleSearch = async () => {
      let res: any = await context.$api.queryOnlineList(userId.value)
      if(res.code === 0){
        tableList.value = res.data
        console.log(tableList.value)
      }
    }

    const parseUA = (ua: string) => {
      const parser = new UAParser()
      parser.setUA(ua)
      const res = parser.getResult()
      let osName = res.os.name ? res.os.name : '-'
      let browserName = res.browser.name ? res.browser.name : '-'
      return '操作系统：'+osName + ' | 浏览器名称：' + browserName
    }

    const handleOffline = async (row: any) => {

      context.$confirm('即将下线该用户, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.userOffline(row.token).then((res: any) => {
            if (res.code === 0) {
              context.$notify({
                type: 'success',
                title: '提示',
                message: '操作成功！'
              })
              handleSearch()
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

    return {
      isShow,
      loginOperateDrawerDeploy,
      tableList,
      dataDict,
      handleSearch,
      handleOffline,
      open,
      parseUA
    }
  }
})
</script>

<style scoped>

</style>