<template>
  <hb-page-layout>
    <el-row :gutter="20">
      <el-col :span="24"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="12"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="3"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
      <el-col :span="12"><el-card shadow="hover" :body-style='bodyStyle'><div class='div-content'></div></el-card></el-col>
    </el-row>
  </hb-page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'index',
  setup() {
    const bodyStyle = {'padding':'0px'}
    return {
      bodyStyle
    }
  }
})
</script>

<style scoped>
.el-row{
  margin-bottom: 20px;
}
.div-content {
  background: #ebfaeb;
  border: 1px solid #dcfcdc;
  border-radius: 2px;
  min-height: 120px;
}
</style>
