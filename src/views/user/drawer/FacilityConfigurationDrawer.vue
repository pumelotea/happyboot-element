<template>
  <drawer-layout
    v-model="isShow"
    :title="pointLinkDrawerDeploy.title"
    size="1000px"
  >
    <div>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(pointGroup, index) in facilityPointData"
          :key="'group' + index"
          :title="pointGroup.name"
          :name="index"
        >
          <div class="container">
            <el-card
              shadow="hover"
              v-for="point in pointGroup.list"
              :key="'point' + point.id"
            >
              <slot name='header'>
                <div class="clearfix">
                <div style="display: flex">
                  <el-switch
                    v-model="point.flag"
                    disabled
                    active-color="#13ce66"
                  ></el-switch>
                  <div class="div-title">
                    <div class="div-name" :title="point.name">
                      {{ point.name }}
                    </div>
                    <el-button
                      v-show="point.flag"
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="handleConfiguration(point.id)"
                      >参数配置</el-button
                    >
                  </div>
                </div>
              </div>
              </slot>
              {{ point.platform }}
              <el-tooltip :content="point.des" placement="bottom">
                <div class="div-des">
                  {{ point.des }}
                </div>
              </el-tooltip>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <configuration-drawer ref="ConfigurationDrawer" />
  </drawer-layout>
</template>

<script lang='ts'>
import ConfigurationDrawer from './ConfigurationDrawer.vue'
import { defineComponent, getCurrentInstance, ref } from 'vue'
import apis from '@/apis'
export default defineComponent({
  name: 'FacilityConfigurationDrawer',
  components: {
    ConfigurationDrawer
  },
  setup() {

    const currentInstance: any = getCurrentInstance()
    const ConfigurationDrawer = ref(null)

    let isShow = false
    let activeNames: any = []
    let pointLinkDrawerDeploy: any = {title: '功能点关联'}
    let userId = ''
    let facilityPointData: any = []

    const handleConfiguration = (facilityId:any) => {
      (ConfigurationDrawer.value as any).open(facilityId, userId)
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = async (userid: any) => {
      isShow = true
      userId = userid
      const res: any = await apis.queryFacilityByUser(userId)
      if (res.code === 0) {
        facilityPointData = res.data
      } else {
        currentInstance.ctx.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    return {
      open,
      handleConfiguration,
      ConfigurationDrawer,
      isShow,
      activeNames,
      pointLinkDrawerDeploy,
      userId,
      facilityPointData
    }
  }
})
</script>
<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.div-title {
  margin-top: -2px;
  width: 100%;
  display: flex;
}
.div-name {
  width: 165px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: 5px;
}
.div-des {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
