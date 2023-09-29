<template>
  <div>
    <div v-if="!data.image_url" class="wrapper" @click="handleClickUpload">
      <i class="el-icon-upload2"></i>
      <div class="progress" v-if="data.uploading">
        <el-progress type="circle" :show-text="false" :percentage="data.percent"></el-progress>
      </div>
    </div>
    <div v-else class="wrapper image" @click="handleClickRemove">
      <i class="el-icon-delete"></i>
      <img :src="data.image_url" alt="image">
    </div>
    <input
      class="d-none"
      type="file"
      accept="image/*"
      ref="upload"
      @change="handleUploadFileChange"/>
  </div>
</template>

<script>
import { blockUploadImage } from '@/api/content'
export default {
  props: ['src'],
  data () {
    return {
      data: {
        percent: 0,
        uploading: false,
        filename: '',
        image_url: '',
        deleted: []
      },
      formFile: null
    }
  },
  created() {
    this.data.image_url = this.src
  },
  methods: {
    handleClickUpload () {
      const upload = this.$refs['upload']
      upload.click()
    },
    handleClickRemove () {
      this.data.deleted.push(this.data.image_url);
      this.data.image_url = ''
    },
    handleUploadFileChange (e) {
      this.data.image_url = ''
      this.data.percent = 0
      const input = e.target
      this.formFile = new FormData
      if (input.files[0]) {
        this.formFile.append('file', input.files[0])
        setTimeout(() => {
          this.handleUploadFile()
          input.value = ''
        }, 1000)
      }
    },
    handleUploadFile () {
      this.data.uploading = true
      blockUploadImage(this.formFile, this.data).then(res => this.onUploadFinish(res))
    },
    onUploadFinish (res) {
      if (res.data['success']) {
        this.data['image_url'] = res.data['filename']
        this.data['filename'] = res.data['filename']
        this.data['has_error'] = false
      }
      setTimeout(() => {
        this.data['uploading'] = false
      }, 1000)
    }
  },
  watch: {
    'data.image_url' () {
      if (this.data.image_url) {
        this.$emit('change-url', this.data['filename'])
      } else {
        if (!this.data.filename) {
          this.$emit('change-url', 'delete_act')
        } else {
          this.$emit('change-url', '')
        }
      }
    },
    'src' () {
      this.data.image_url = this.src
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    $image-width: 130px;
    width: $image-width;
    height: $image-width;
    display: block;
    line-height: $image-width;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &.full-width {
      width: 100% !important;
      i {
        width: 100% !important;
      }
    }
    &:hover {
      border-color: #409EFF;
    }
    i {
      position: absolute;
      font-size: 28px;
      color: #8c939d;
      width: $image-width;
      height: $image-width;
      line-height: $image-width;
      text-align: center;
    }
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
    }
    &.image {
      & > img {
        width: 100%;
      }
      &:hover {
        i {
          color: #111 !important;
        }
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 111;
          background: #fff5;
        }
      }
    }
  }
</style>
