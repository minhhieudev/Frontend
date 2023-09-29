<template>
  <div>
    <img v-if="isShowPreview" :src="uploadData['show_image_url']" width="auto" style="max-width: 100%; max-height: 150px"/>
    <template v-if="!disabled && !isUploadSimple">
      <div>
        <el-radio-group v-model="uploadData['is_upload']">
          <el-radio :label="false">Enter image URL</el-radio>
          <el-radio :label="true">Upload an image</el-radio>
        </el-radio-group>
      </div>
      <div>
        <template v-if="!uploadData['is_upload']">
          <div class="d-flex">
            <div class="flex-fill">
              <el-input
                :disabled="!is_edit_url"
                size="small"
                placeholder="Enter image URL"
                v-model="edit_url"
                @change="handleChangeImageURL"
              />
            </div>
            <el-button
              class="outline-none pl-4"
              type="text"
              :icon="is_edit_url ? 'el-icon-check' : 'el-icon-edit'"
              @click="handleChangeEditUrl()"
            >
              {{ is_edit_url ? 'OK' : 'Edit' }}
            </el-button>
          </div>
        </template>
        <template v-else>
          <el-progress
            v-if="uploadData['uploading']"
            :percentage="uploadData['percent']"
            :stroke-width="3"></el-progress>
        </template>
      </div>
    </template>
    <input
      class="d-none"
      type="file"
      accept="image/*"
      ref="upload"
      @change="handleUploadFileChange"/>
    <el-button
      v-if="!disabled && uploadData['is_upload'] || isUploadSimple"
      size="small"
      type="primary"
      icon="el-icon-upload2"
      @click="handleClickUpload"
      class="ml-2"
    >Click to upload</el-button>
  </div>
</template>

<script>
import { uploadImage } from '@/api/upload'
export default {
  props: {
    uploadData: {
      type: Object,
      default: () => {
        return {
          upload_file: '',
          show_image_url: '',
          uploading: false,
          percent: 0,
          is_upload: true
        }
      }
    },
    entity: {
      type: String,
      default: 'tmp'
    },
    isShowPreview: {
      type: Boolean,
      default: false
    },
    //props for simple upload type
    isUploadSimple: {
      type: Boolean,
      default: false
    },
    value: { type: String },
    disabled: {
      type: Boolean,
      default: false
    }
    //-------
  },
  data () {
    return {
      queryForImage: '?HM_IMAGE_URL',
      edit_url: '',
      is_edit_url: false
    }
  },
  created () {
    this.updateUploadData()
  },
  watch: {
    value: function () {
      this.updateUploadData()
    }
  },
  methods: {
    updateUploadData () {
      if (this.value) {
        if (this.value.startsWith('http') || this.value.includes(this.queryForImage)) {
          this.edit_url = this.value
          this.uploadData['is_upload'] = false
          this.uploadData['show_image_url'] = this.value
        } else {
          this.uploadData['is_upload'] = true
          if (this.uploadData['upload_file']) {
            this.uploadData['show_image_url'] = this.uploadData['upload_file']
          } else {
            this.uploadData['show_image_url'] = `${this.$store.getters['baseUrl']}/files/media/images/${this.entity}/${this.value}`
          }
        }
      } else {
        this.uploadData['show_image_url'] = `${this.$store.getters['baseUrl']}/files/media/images/placeholder.png`
      }
    },
    handleChangeEditUrl () {
      this.edit_url = this.edit_url.replace(this.queryForImage, '')
      if (this.edit_url) {
        this.edit_url = this.edit_url + this.queryForImage
      }
      
      this.$emit('input', this.edit_url)
      this.$emit('change', this.edit_url)
      this.is_edit_url = !this.is_edit_url
    },
    handleClickUpload () {
      const upload = this.$refs['upload']
      upload.click()
    },
    handleUploadFileChange (e) {
      const input = e.target
      this.formFile = new FormData
      if (input.files[0]) {
        this.formFile.append('upload_data', input.files[0])
        setTimeout(() => {
          this.handleUploadFile()
          input.value = ''
        }, 1000)
      }
    },
    handleChangeImageURL () {
      this.uploadData['has_error'] = false
    },
    handleUploadFile () {
      this.uploadData['uploading'] = true
      this.$emit('uploading', true)
      uploadImage(this.formFile, this.uploadData, `media/images/${this.entity}`).then(res => this.onUploadFinish(res)).finally(() => {
        this.$emit('uploading', false)
      })
    },
    onUploadFinish (res) {
      if (res.data['success'] && res.data['filesUploaded']) {
        let fileUploaded = res.data['filesUploaded'][0]
        this.$emit('input', fileUploaded['name'])
        this.$emit('change', { filename: fileUploaded['name'] })
        this.uploadData['upload_file'] = fileUploaded['full_path']
      }
      setTimeout(() => {
        this.uploadData['uploading'] = false
      }, 1000)
    }
  }
}
</script>
