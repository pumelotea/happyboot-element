<template>
  <div style='display: inline-block'>
    <slot>
      <el-avatar
        :size='120'
        :src='avatar'
        class='avatar'
        @click='open'
        shape='square'
      ></el-avatar>
    </slot>
    <el-dialog
      title='上传头像'
      :append-to-body='true'
      v-model:visible='dialog'
      @close='close'
    >
      <div class='btns' v-show='canSave'>
        <el-button-group style='margin: auto'>
          <el-button
            type='primary'
            plain
            icon='el-icon-rank'
            @click="setDragMode('move')"
          ></el-button>
          <el-button
            type='primary'
            plain
            icon='el-icon-crop'
            @click="setDragMode('crop')"
          ></el-button>
          <el-button
            type='primary'
            plain
            icon='el-icon-zoom-in'
            @click="zoom('+')"
          ></el-button>
          <el-button
            type='primary'
            plain
            icon='el-icon-zoom-out'
            @click="zoom('-')"
          ></el-button>
          <el-button
            type='primary'
            plain
            icon='el-icon-refresh-left'
            @click="rotate('-')"
          ></el-button>
          <el-button
            type='primary'
            plain
            icon='el-icon-refresh-right'
            @click="rotate('+')"
          ></el-button>
        </el-button-group>
      </div>
      <input
        ref='imageFile'
        type='file'
        id='file'
        style='display:none'
        accept='image/jpg, image/jpeg,image/png'
        @change='selectImg'
      />
      <div v-show='canSave' class='cropper-image-container'>
        <img ref='headImg' />
      </div>

      <div v-if='!canSave' style='display: flex'>
        <img
          class='select-icon-btn'
          src='/images/uploadhead.svg'
          width='120'
          height='120'
          @click='chooseFile'
        />
      </div>

      <slot name='footer'>
        <span class='dialog-footer'>
          <el-button @click='close'>取 消</el-button>
          <el-button type='primary' @click='save'>确 定</el-button>
        </span>
      </slot>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ref, watch, getCurrentInstance } from 'vue'

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props: any) {
    const currentInstance: any = getCurrentInstance()

    let headImg = ref(null)
    let cropper = ref(null)
    let canSave = ref(false)
    let dialog = ref(false)
    const avatar = ref('')

    const src = {...props}.src
    watch(src, () => {
      avatar.value = src
    })

    const open = () => {
      dialog.value = true
      currentInstance.ctx.$nextTick(() => {
        initCropper()
      })
    }

    const close = () => {
      dialog.value = false
      canSave.value = false
    }

    const initCropper = () => {
      if (cropper.value) {
        (cropper.value as any).destroy()
      }
      (cropper.value as any) = new Cropper((headImg.value as any), {
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
      ;(cropper as any).replace(URL.createObjectURL(img))
      currentInstance.ctx.$refs.imageFile.value = ''
    }

    const zoom = (d: any) => {
      if (d === '+') {
        (cropper as any).value.zoom(0.1)
      }
      if (d === '-') {
        (cropper as any).value.zoom(-0.1)
      }
    }

    const rotate = (d: any) => {
      if (d === '+') {
        (cropper as any).value.rotate(45)
      }
      if (d === '-') {
        (cropper as any).value.rotate(-45)
      }
    }

    const setDragMode = (type: any) => {
      (cropper as any).value.setDragMode(type)
    }

    const chooseFile = () => {
      setTimeout(() => {
        (document.documentElement.querySelector('#file') as any).click()
      }, 400)
    }

    const save = () => {
      const can = (cropper as any).value.getCroppedCanvas()
      if (!can) {
        close()
        return
      }
      avatar.value = (can.toDataURL() as string)
      currentInstance.ctx.$emit('cropped', can)
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
      canSave,
      dialog,
      avatar
    }
  }
}
</script>

<style scoped>
.cropper-image-container {
  width: 100%;
  height: 400px;
}

.select-icon-btn {
  cursor: pointer;
  margin: auto;
}

.select-icon-btn:hover {
  opacity: 0.8;
}

.avatar {
  cursor: pointer;
}

.avatar:hover {
  opacity: 0.8;
}

.btns {
  margin-bottom: 20px;
}
</style>
