<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="Chọn Avatar mới" width="30%" @close="resetDialog">
      <el-form ref="avatarForm" :model="avatarForm" label-width="80px">
        <el-form-item >
          <el-upload :action=uploadActionURL list-type="picture-card"
            :on-success="handleAvatarUploadSuccess" :auto-upload="true" :show-file-list="false"
            :on-change="handleAvatarChange">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div v-if="previewUrl" class="avatar-preview">
        <img :src="previewUrl" alt="Avatar Preview" />
      </div>

      <div slot="footer">
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="confirmAvatar">Xác nhận</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateAvatarUser } from "@/api/user";

export default {
  data() {
    return {
      dialogVisible: false,
      avatarForm: {
        file: null,
        name: '',
        path:''
      },
      previewUrl: '',
      uploadActionURL: process.env.VUE_APP_BACKEND_URL+`/public/upload`,
    };
  },
  created(){
  },
  methods: {
    resetDialog() {
      this.dialogVisible = false;
      this.avatarForm.file = null;
      this.previewUrl = null;
    },
    handleAvatarChange(file, fileList) {
      // Ensure only one file is selected
      if (fileList) {
        // Update avatarForm.file instead of accessing raw directly
        this.avatarForm.file = file;
        this.avatarForm.name = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;

          // Lấy thêm đường dẫn của ảnh

          // Console log giá trị thử của additionalUrl
        };
        reader.readAsDataURL(file.raw || file.originFileObj); // Handle different file structures
      } else {
        this.previewUrl = null;
        this.$message.error('Vui lòng chọn chỉ một hình ảnh.');
      }
    },


    handleAvatarUploadSuccess(response, file, filePath) {
      const uploadedFile = response.files[0];
      this.avatarForm.name= uploadedFile.filename
      this.avatarForm.path=`${process.env.VUE_APP_BACKEND_URL}${uploadedFile.path}`
    },

    async confirmAvatar() {

      if (this.avatarForm.file && this.avatarForm.file.raw) {
        console.log('22333:'+this.avatarForm.path)
        try {
          // Update avatar through API
          const response = await updateAvatarUser(this.$store.getters.user._id, { newUrl: this.avatarForm.path });

          // Handle response from the server

          this.$emit('change-avatar', this.previewUrl);
          this.resetDialog();
        } catch (error) {
          console.error(error);
          this.$message.error('Có lỗi xảy ra khi cập nhật avatar.');
        }
      } else {
        this.$message.error('Vui lòng chọn hình ảnh trước khi xác nhận.');
      }
    },

  },
};
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-preview {
  margin-top: 20px;
  text-align: center;
}

.avatar-preview img {
  max-width: 100%;
  max-height: 200px;
}
</style>
