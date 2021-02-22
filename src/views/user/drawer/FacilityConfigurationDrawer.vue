<template>
  <hb-drawer-layout
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
              <template #header>
                <div class="clearfix">
                  <div style="display: flex;align-items: center;height: 40px;">
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
                      style="float: right;"
                      type="text"
                      @click="handleConfiguration(point.id)"
                      >参数配置</el-button
                    >
                  </div>
                </div>
              </div>
              </template>
              {{ point.platform }}
<!--              <el-tooltip :content="point.des" placement="bottom">-->
                <div class="div-des">
                  {{ point.des }}
                </div>
<!--              </el-tooltip>-->
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <configuration-drawer ref="ConfigurationDrawer" />
  </hb-drawer-layout>
</template>

<script lang='ts'>
import ConfigurationDrawer from './ConfigurationDrawer.vue'
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
export default defineComponent({
  name: 'FacilityConfigurationDrawer',
  components: {
    ConfigurationDrawer
  },
  setup() {
    const context = self()

    const ConfigurationDrawer = ref(null)

    let isShow = ref(false)
    let activeNames: any = ref([])
    let pointLinkDrawerDeploy: any = ref({title: '功能点关联'})
    let userId = ''
    let facilityPointData: any = ref([])

    const handleConfiguration = (facilityId:any) => {
      (ConfigurationDrawer.value as any).open(facilityId, userId)
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = async (userid: any) => {
      isShow.value = true
      userId = userid
      const res: any = await context.$api.queryFacilityByUser(userId)
      if (res.code === 0) {
        facilityPointData.value = res.data
      } else {
        context.$notify({
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
  align-items: center;
}
.div-name {
  width: 165px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: 5px;
}
.div-des {
  width: 280px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<style>
.el-card__header {
  padding: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.el-card__body{
  padding: 10px 15px;
}
</style>
