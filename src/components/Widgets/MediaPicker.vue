<template>
  <div class="">
    <el-button @click="isShowDialog = true" type="primary" size="small">
      {{ text?text:'Chọn ảnh' }}
    </el-button>
    <el-dialog :visible.sync="isShowDialog" title="Chọn ảnh" width="75%">
      <div class="dialog-content">
        <div class="">
          <span class="d-flex">
            <el-upload
              :on-success="loadData"
              :headers="{ 'x-access-token': userToken }"
              :multiple="false"
              :action="apiFileUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              name="upload"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <span v-if="mediaSelected" class="ml-3">
              Đường dẫn: {{ getImagePath(mediaSelected) }}
              <el-button @click="handleCopyStr(getImagePath(mediaSelected))">Copy</el-button>
            </span>
            
          </span>

          <span @click="selectMedia(media)" v-for="(media, index) in gridData" :key="index">
            <img width="140" :class="media.selected == true?'imageSelected':'imageItem'" class="m-2" height="140" :src="getImagePath(media.filename)"/>
          </span>
        </div>
        <el-pagination
          class="mt-3"
          background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[10, 25, 50]" :pager-count="5"
          :page-size.sync="pagination.page_size" :total="pagination.count" :current-page.sync="pagination.current_page"
          @current-change="loadData" @size-change="handlePageSizeChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShowDialog = false">Đóng</el-button>
        <el-button v-if="mediaSelected" type="primary" size="small" @click="handleSelectMedia">Chọn</el-button>
        <el-button v-if="mediaSelected" type="danger" size="small" @click="confirmDelete">Xóa</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="previewImageDialog">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
const ModelCode = 'media'
import { getCollection, handleDelete } from '@/api/media'
export default {
  props: ['text'],
  data() {
    return {
      dialogImageUrl: '',
      previewImageDialog: false,
      isShowDialog: false,
      gridData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
      mediaSelected: '',
      userToken: '',
      apiFileUpload: ''
    }
  },
  watch: {
    'isShowDialog': function () {
      if (this.isShowDialog && !this.gridData.length) {
        this.loadData()
      }
    }
  },
  created() {
    this.apiFileUpload = process.env.VUE_APP_BACKEND_URL + process.env.VUE_APP_API_PATH + '/file'
    this.userToken = getToken()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.previewImageDialog = true;
    },
    handleSelectMedia() {
      this.isShowDialog = false
      console.log(this.mediaSelected);
      this.$emit('input', this.mediaSelected)
      this.$emit('pick', this.mediaSelected)
    },
    /** some handle methods */
    selectMedia(media) {
      this.mediaSelected = media.filename
      this.gridData = this.gridData.map(_media => {
        _media.selected = _media.filename == media.filename
        return _media
      })
    },
    /** default methods */
    confirmDelete() {
      let mediaSelected = this.gridData.find(item => item.filename == this.mediaSelected)
      if (mediaSelected) {
        this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Warning', {
          confirmButtonText: 'Delete',
          type: 'warning'
        }).then(() => {
          handleDelete(mediaSelected._id).then((res) => {
            if (res.data.success) {
              this.loadData()
            }
          }).finally(() => {
            this.$wrLoading(false)
          })
        }).catch()
      }
    },
    loadData() {
      getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.success) {
          this.gridData = data.data
          if (data.total) {
            this.totalData = data.total
          }
        }
      })
    },
    handlePageSizeChange() {
      this.pagination.current_page = 1
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.imageItem{
  border: rgb(175, 178, 175) solid 1px;
}
.imageSelected{
  border: rgb(31, 239, 31) solid 3px;
}
</style>