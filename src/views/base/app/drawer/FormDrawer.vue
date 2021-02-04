<template>
  <drawer-layout
    size="600px"
    :loading="drawerLoading"
    v-model="drawer"
    :title="title"
  >
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="更新内容" prop="updateContent">
        <el-input type="textarea" :rows="4" v-model="form.updateContent" />
      </el-form-item>
      <el-form-item label="版本号" prop="blobVersion">
        <el-input v-model="form.blobVersion" />
      </el-form-item>
      <el-form-item label="文件" prop="blobUrl">
        <el-upload
          ref="uploader"
          action=""
          :http-request="uploadFlie"
          :limit="1"
          accept=".apk"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传apk文件
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'
export default defineComponent ({
  name: 'FormDrawer',
  setup(props, { emit }) {
    const context = self()

    const uploader: any = ref(null)
    const forms: any = ref(null)

    const drawerLoading = ref(false)
    const drawer = ref(false)
    const title = ref('')
    const fileList: any = ref([])
    const form = ref({
      blobVersion: '', //版本
      blobUrl: '', //地址
      updateContent: '' //更新内容
    })
    const rules = {
      blobVersion: [
        { required: true, message: '请输入版本', trigger: 'change' }
      ],
      blobUrl: [{ required: true, message: '请上传文件', trigger: 'change' }]
    }

    //上传文件
    const uploadFileRequest = async (file: any, success: any, error: any) => {
      const res: any = await context.$api.uploadFile(file)
      if (res.code === 0) {
        success(res.data)
      } else {
        error(res)
      }
    }

    const addRequest = async (params: any) => {
      const res: any = await context.$api.addApp(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '新增成功',
          type: 'success'
        })
        submitSuccess()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      drawerLoading.value = false
    }

    const add = (data: any = {}) => {
      drawer.value = true
      title.value = '新增'
      initForm(data)
    }

    const initForm = (data: any) => {
      form.value.blobUrl = ''
      form.value.blobVersion = ''
      form.value.updateContent = ''

      nextTick(() => {
        (uploader.value as any).clearFiles()
        ;(forms.value as any).resetFields()
        form.value = partialCopying(form.value, data)
      })
    }

    const partialCopying = (form: any, data: any) => {
      if (!data) {
        return form
      }
      Object.keys(form).forEach(key => {
        form[key] = data[key] || form[key]
      })
      return form
    }

    const close = () => {
      drawer.value = false
    }

    const handleSubmit = () => {
      drawerLoading.value = true
      ;(forms.value as any).validate((valid: any) => {
        if (!valid) {
          drawerLoading.value = false
          return
        }
        addRequest(form.value)
      })
    }

    //新增或编辑成功
    const submitSuccess = () => {
      emit('handleSubmit')
      close()
    }

    //文件相关------------------begin
    const uploadFlie = (file: any) => {
      uploadFileRequest(
        file.file,
        (success: any) => {
          form.value.blobUrl = success
          file.onSuccess()
        },
        (err: any) => {
          context.$notify({
            title: '上传失败',
            message: err.msg,
            type: 'error'
          })
          form.value.blobUrl = ''
          file.onError()
        }
      )
    }
    //文件相关------------------begin

    return {
      initForm,
      add,
      uploadFileRequest,
      addRequest,
      close,
      handleSubmit,
      submitSuccess,
      uploadFlie,
      drawerLoading,
      drawer,
      title,
      fileList,
      form,
      rules,
      uploader,
      forms
    }
  }
})
</script>
<style scoped>
.table-box {
  position: relative;
  width: 100%;
  border: 1px solid #dcdfe6;
}
.table-row {
  position: relative;
  height: 50px;
  line-height: 50px;
  color: #606266;
}
.table-cell {
  height: 100%;
  text-align: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.table-row-title {
  background: #f5f7fa;
}
.table-row-content {
  border-top: 1px solid #dcdfe6;
}
</style>
