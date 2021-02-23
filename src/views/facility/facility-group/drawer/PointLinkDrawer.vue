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
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确认</el-button>
    </template>
    <configuration-drawer ref="CD" />
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { self } from '@/common'
import ConfigurationDrawer from '@/views/facility/facility-group/drawer/ConfigurationDrawer.vue'
import { defineComponent, ref } from 'vue'
import { drawerLoader } from '@/common/drawer'
export default defineComponent ({
  name: 'PointLinkDrawer',
  components: {
    ConfigurationDrawer
  },
  setup(props, { emit }) {
    const context = self()
    const drawer = drawerLoader()

    const isShow = ref(false)
    const pointLinkDrawerDeploy: any = ref({ title: '功能点关联' })
    const activeNames: any = ref([])
    const facilityPointData: any = ref([])
    const facilityGroupId = ref('')

    const handleConfiguration = (facilityId: any) => {
      drawer('CD').open(facilityId, facilityGroupId.value)
    }

    const handleSubmit = async () => {
      let facilityIds: any = []

      for (let i = 0; i < facilityPointData.value.length; i++) {
        let data: any = facilityPointData.value[i].list
        data.map((e: any) => {
          if (e.flag) {
            facilityIds.push(e.id)
          }
        })
      }

      let res: any = await context.$api.saveFacilityGroupRel(
        facilityGroupId.value,
        facilityIds
      )
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = async (data: any) => {
      isShow.value = true
      facilityGroupId.value = data
      const res: any = await context.$api.queryFacilityByGroup(facilityGroupId.value)
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
      handleSubmit,
      isShow,
      pointLinkDrawerDeploy,
      activeNames,
      facilityPointData,
      facilityGroupId,
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
