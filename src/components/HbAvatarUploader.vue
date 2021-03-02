<template>
  <div>
    <slot>
      <el-avatar
        :size="120"
        :src="avatar"
        class="avatar"
        @click="open"
        icon="el-icon-user-solid"
      ></el-avatar>
    </slot>
    <el-dialog
      title="上传头像"
      :append-to-body="true"
      v-model="dialog"
      custom-class="avatar-uploader"
      @close='close'
    >
      <div class="btns" v-show="canSave">
        <el-button-group style="margin: auto">
          <el-button
            type="primary"
            plain
            icon="el-icon-rank"
            @click="setDragMode('move')"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-crop"
            @click="setDragMode('crop')"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-zoom-in"
            @click="zoom('+')"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-zoom-out"
            @click="zoom('-')"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh-left"
            @click="rotate('-')"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh-right"
            @click="rotate('+')"
          ></el-button>
        </el-button-group>
      </div>
      <input
        ref="imageFile"
        type="file"
        style="display:none"
        accept="image/jpg, image/jpeg,image/png"
        @change="selectImg"
      />
      <div v-show="canSave" class="cropper-image-container">
        <img ref="headImg" />
      </div>

      <div v-if="!canSave" style="display: flex">
        <img
          class="select-icon-btn"
          src="/images/uploadhead.svg"
          width="120"
          height="120"
          @click="chooseFile"
        />
      </div>

      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </slot>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ref, watch, nextTick, defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'HbAvatarUploader',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const headImg = ref<HTMLImageElement | null>(null)
    let imageFile = ref<HTMLInputElement | null>(null)
    let cropper: Cropper
    let canSave = ref(false)
    let dialog = ref(false)
    const avatar = ref('')

    const { src } = toRefs(props)
    watch(src, val => {
      avatar.value = val
    })

    const open = () => {
      dialog.value = true
      nextTick(() => {
        initCropper()
      })
    }

    const close = () => {
      dialog.value = false
      canSave.value = false
    }
    const initCropper = () => {
      cropper?.destroy()
      cropper = new Cropper(headImg.value!, {
        guides: true,
        // strict: false,
        aspectRatio: 1,
        // eslint-disable-next-line no-unused-vars
        crop(event) {
        }
      })
    }

    const selectImg = (event: any) => {
      const img = event.target.files[0]
      canSave.value = true
      cropper.replace(URL.createObjectURL(img))
      imageFile.value!.value = ''
    }

    const zoom = (d: string) => {
      if (d === '+') {
        cropper.zoom(0.1)
      }
      if (d === '-') {
        cropper.zoom(-0.1)
      }
    }

    const rotate = (d: string) => {
      if (d === '+') {
        cropper.rotate(45)
      }
      if (d === '-') {
        cropper.rotate(-45)
      }
    }

    const setDragMode = (type: Cropper.DragMode) => {
      cropper.setDragMode(type)
    }

    const chooseFile = () => {
      setTimeout(() => {
        imageFile.value?.click()
      }, 400)
    }

    const save = () => {
      const can = cropper.getCroppedCanvas()
      if (!can) {
        close()
        return
      }
      avatar.value = can.toDataURL()
      emit('cropped', can)

      close()
    }

    return {
      open,
      close,
      initCropper,
      selectImg,
      zoom,
      rotate,
      setDragMode,
      chooseFile,
      save,
      headImg,
      imageFile,
      canSave,
      dialog,
      avatar
    }
  }
})
</script>
