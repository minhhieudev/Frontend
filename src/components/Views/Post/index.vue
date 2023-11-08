<template>
  <div class="chatroom">
    <el-container>
      <el-main style="height: calc(100% - 56px); padding: 11px;">
        <div class="post-button-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
          </div>
          <div class="input-box">
            <input
              @input="onReplyInputChange"
              placeholder="Nhập thông tin muốn đăng tải ..."
              class="reply-inputs"
              @click="showQuestionPopup"
            />
          </div>
        </div>
        <el-scrollbar wrap-class="question-list">
          <postItem
            v-for="mes in posts"
            :key="mes._id"
            :title="mes.title"
            :content="mes.content"
            :attachmentPath="mes.attachmentPath"
            :photoURL="typeof mes.photoURL === 'string' ? mes.photoURL : ''"
            :user="mes.user.fullname"
            :createdAt="formatDate(mes.createdAt)"
            :likes="mes.likes"
            :comments="mes.comments"
            :id="mes._id"
          />
        </el-scrollbar>
      </el-main>
    </el-container>

    <!-- Popup nhập nội dung câu hỏi -->
    <el-dialog class="custom-dialog" title="Nhập nội dung muốn đăng" :visible.sync="isQuestionPopupVisible">
      <div class="el-dialog__body">
        <input v-model="title" placeholder="Nhập tiêu đề bài đăng ..." class="reply-inputs" />
        <ckeditor :config="ckEditorConfig" v-model="postText"></ckeditor>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadActionURL"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-success="handleFileUploadSuccess"
          :file-list="fileList"
          multiple
        >
          <el-button slot="trigger" size="small" type="primary">Chọn tệp</el-button>
          <div class="el-upload__tip" slot="tip">Tệp jpg/png có kích thước nhỏ hơn 2MB</div>
        </el-upload>

        <div class="button-container-tall">
          <el-button @click="isQuestionPopupVisible = false" class="close-button" icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetQuestionText" class="refresh-button" icon="el-icon-refresh">Làm mới</el-button>
          <el-button @click="showTimestampPicker" class="timestamp-button" icon="el-icon-time">Thời gian đăng</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">Đăng</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, saveData } from '@/api/post';
import { format } from 'date-fns';
import postItem from './postItem';

export default {
  data() {
    return {
      avatarSize: 'small',
      inputValue: "",
      tableData: [],
      posts: [],
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false,
      postText: "",
      title: "",
      uploadActionURL: `http://localhost:8001/public/upload`,
      fileList:[],
      pathList:[]
    };
  },
  components: {
    postItem,
  },
  created() {
    this.loadData();
  },
  computed: {
    cleanQuestionText() {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.postText;
      return tempDiv.textContent || tempDiv.innerText || '';
    },
  },
  methods: {
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },
    showQuestionPopup() {
      this.isQuestionPopupVisible = true;
    },
    formatDate(date) {
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm'));
    },
    onReplyInputChange() {},

    submitUpload() {
        this.$refs.upload.submit();
    },
    
    beforeUpload(file) {
      this.fileList.push(file);
      const isLt2MB = file.size / 1024 / 1024 < 2;
      if (!isLt2MB) {
        this.$message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      }
      return file;
    },
    handleFileUploadSuccess(response, file, filePath) {

      const attachmentData = response.files.map(file => ({
        filename: file.filename, 
        path: file.path
      }));

      this.pathList.push(...attachmentData);

      if (this.pathList.length === this.fileList.length) {
        const newPost = {
          title: this.title,
          content: this.cleanQuestionText,
          user: this.$store.getters.user._id,
          attachmentPath: this.pathList, 
        };

        this.submitData(newPost);

        console.log(newPost)
      }
    },



    async submitData(newPost) {
      try {
        const saveResponse = await saveData(newPost);
        if (saveResponse && saveResponse.status === 200) {
          const responseData = saveResponse.data;
          if (responseData && responseData.success) {
            this.loadData();
            this.postText = "";
            this.isQuestionPopupVisible = false;
          } else {
            console.error("Lỗi khi lưu bài đăng: ", responseData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu bài đăng: ", error);
      }
    },
    loadData() {
      getAll()
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.posts;
            this.posts = this.tableData.reverse();
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi bài đăng: ", error);
        });
    },
    showTimestampPicker() {
      console.log('123');
    },
    resetQuestionText() {
      console.log('123423');
    },
  },
};
</script>

<style scoped>
.question-list {
  max-height: 100%;
  overflow-y: auto;
}

.question-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
}

.question-textarea {
  width: 100%;
  height: 150px;
  border: none;
  padding: 10px;
  resize: vertical;
}

.button-container-tall {
  display: flex;
  justify-content: space-between;
}

.close-button,
.refresh-button,
.timestamp-button {
  cursor: pointer;
  margin-right: 10px;
}

.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.5);
}

.post-button-container {
  display: flex;
  margin-top: 2 px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 4px;
  background-color: white;
  width: 90%;
  margin-left: auto;
}


.input-box {
  flex-grow: 1;
  background-color: rgb(129, 117, 117);
}

.reply-inputs {
  width: 100%;
  padding: 10px;
  outline: none;
  border: none;
  background-color: rgb(247, 243, 243);
  margin-bottom: 5px;
  color: rgb(12, 11, 11);
}


.avatar {
  margin-right: 10px;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/8.jpg');
  background-size: cover;
  background-position: center;
  z-index: 99;
  opacity: 1;
  border-radius: 25px;
}

.logo {
  position: absolute;
  bottom: -60px;
  left: 10%;
  transform: translateX(-60%);
  z-index: 100;
}
</style>
