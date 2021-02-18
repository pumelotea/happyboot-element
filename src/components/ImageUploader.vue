<template>
  <div class="image-uploader">
    <div ref="viewerRef">
      <div
        class="image-item"
        v-for="(e, index) in existList"
        :key="imgId2Url(e)"
      >
        <img class="image" :src="imgId2Url(e)" />
        <div class="preview">
          <i
            class="el-icon-view"
            style="cursor: pointer"
            @click="preview(index)"
          ></i>
        </div>
        <div v-if="!disabled" class="delete-btn" @click="deleteExist(index)">
          <i class="el-icon-close delete-btn-icon"></i>
        </div>
      </div>

      <div
        class="image-item"
        v-for="(e, index) in needUploadList"
        :key="e.blobUrl"
      >
        <img class="image" :src="e.blobUrl" />
        <div class="preview">
          <i
            class="el-icon-view"
            style="cursor: pointer"
            @click="preview(existList.length + index)"
          ></i>
        </div>
        <div
          v-if="!disabled"
          class="delete-btn"
          @click="deleteNeedUpload(index)"
        >
          <i class="el-icon-close delete-btn-icon"></i>
        </div>
      </div>
    </div>
    <div
      class="image-item uper"
      @click="chooseFile"
      v-if="!disabled && existList.length + needUploadList.length < max"
    ></div>
    <div
      class="image-item no-picture-disabled"
      v-if="disabled && existList.length === 0"
    >
      暂无图片
    </div>
    <input
      v-if="!disabled"
      multiple="multiple"
      type="file"
      ref="fileRef"
      hidden
      :accept="accept"
      @change="selectImg"
    />

    <el-dialog
      v-model="show"
      modal-append-to-body
      append-to-body
      custom-class="image-uploader-err"
      title="图片超限警告"
      @close="closeDialog"
    >
      <h4>图片大小限制：{{ sizeLimit }}字节</h4>
      <div class="err-list" v-for="(e, i) in errorList" :key="e.name + i">
        <div class="err-filename">{{ e.name }}</div>
        <div>{{ e.size }}字节</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
const conversion = require('@/common/conversion')
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { defineComponent, ref, watch, onMounted, toRefs } from 'vue'
import { self } from '@/common'
import { $imgId2Url } from '@/apis'

export default defineComponent({
  name: 'ImageUploader',
  props: {
    modelValue: {
      type: Array,
      require: false,
      default: () => {
        return []
      }
    },
    //最大数量限制
    max: {
      type: Number,
      require: false,
      default: 100
    },
    //上传大小限制,单位字节
    sizeLimit: {
      type: Number,
      require: false,
      default: 100000000 //单位B
    },
    //文件类型限制
    accept: {
      type: String,
      require: false,
      default: '.png,.jpg,.jpeg,.gif'
    },
    //开启压缩
    enableCompress: {
      type: Boolean,
      require: false,
      default: false
    },
    //禁用
    disabled: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $api, $alert } = self()
    const existList = ref<string[]>([])
    const needUploadList = ref<any>([])
    const show = ref(false)
    const errorList = ref<any>([])
    let viewer: Viewer
    const fileRef = ref<HTMLInputElement | null>(null)
    const viewerRef = ref<HTMLElement | null>(null)

    const { modelValue } = toRefs(props)
    existList.value = modelValue.value as string[]

    watch(modelValue, () => {
      existList.value = modelValue.value as string[]
    })

    const chooseFile = () => {
      setTimeout(() => {
        fileRef.value!.click()
      }, 400)
    }

    const selectImg = async (event: any) => {
      const tmpList = []
      for (const img of event.target.files) {
        let obj = img
        if (obj.size >= props.sizeLimit) {
          if (props.enableCompress) {
            const compressed = await conversion.compressAccurately(
              obj,
              props.sizeLimit / 1024
            )
            obj = new File([compressed], obj.name, {
              type: obj.type
            })
          } else {
            tmpList.push(obj)
            continue
          }
        }

        if (existList.value.length + needUploadList.value.length < props.max) {
          needUploadList.value.push({
            file: obj,
            blobUrl: URL.createObjectURL(obj)
          })
        }
      }
      if (tmpList.length > 0) {
        errorList.value = tmpList
        show.value = true
      }

      fileRef.value!.value = ''
    }

    const deleteExist = (index: number) => {
      existList.value.splice(index, 1)
      emit('onUpdate:modelValue', existList.value)
    }

    const deleteNeedUpload = (index: number) => {
      needUploadList.value.splice(index, 1)
    }

    const upload = async () => {
      if (needUploadList.value.length === 0) {
        return
      }
      const res = await $api.uploadImagesV2(
        needUploadList.value.map((e: any) => e.file)
      )
      if (res.code !== 0) {
        $alert(res.msg, '上传警告')
        return
      }
      needUploadList.value = []
      existList.value.push(...res.data)
      emit('onUpdate:modelValue', existList.value)
    }

    const preview = (index: number) => {
      viewer.update()
      viewer.view(index)
    }

    const imgId2Url = $imgId2Url

    onMounted(() => {
      viewer = new Viewer(viewerRef.value!)
    })

    const closeDialog = () => {
      show.value = false
    }
    return {
      existList,
      needUploadList,
      show,
      errorList,
      fileRef,
      viewerRef,
      chooseFile,
      selectImg,
      deleteExist,
      deleteNeedUpload,
      preview,
      upload,
      imgId2Url,
      closeDialog
    }
  }
})
</script>
