<template>
  <div class="chatroom">
    <el-container>
      <el-header style="height: 120px; padding: 0; position: relative;">
        <!-- Ảnh nền -->
        <div class="background-image"></div>
        <!-- Avatar -->
        <div class="logo">
          <el-avatar :size="150" :src="logo"></el-avatar>
        </div>
      </el-header>
      <el-main style="height: calc(100% - 56px); padding: 11px;">
        <div :class="{ 'disabled': isPostButtonDisabled }" class="post-button-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" :src="this.$store.getters.currentUser.avatarUrl"></el-avatar>
          </div>
          <div class="input-box">
            <input @input="onReplyInputChange" placeholder="Nhập thông tin muốn đăng tải ..." class="reply-inputs"
              @click="showQuestionPopup" />
          </div>
        </div>
        <el-scrollbar wrap-class="post-list" style="max-height: 700px; overflow-y: auto;">
          <postItem v-for="mes in posts" :key="mes._id" :title="mes.title" :content="mes.content" :pinned="mes.pinned"
            :attachmentPath="mes.attachmentPath" :postType="mes.postType" :avatarUrl="mes.user.avatarUrl"
            :user="mes.user.fullname" :createdAt="formatDate(mes.createdAt)" :likes="mes.likes" :comments="mes.comments"
            :id="mes._id" @pinnedStatusUpdated="loadData" />
        </el-scrollbar>
      </el-main>
    </el-container>

    <el-dialog class="custom-dialog" title="Nhập thông tin muốn đăng tải" :visible.sync="isQuestionPopupVisible">
      <div class="el-dialog__body">
        <p class="font-weight-bold">Tiêu đề</p>
        <input v-model="title" placeholder="Nhập tiêu đề bài đăng ..." class="reply-inputs" />
        <p class="font-weight-bold mt-1">Loại</p>
        <div class="post-type-container mt-2">
          <el-radio-group v-model="postType">
            <el-radio label="Tài liệu">Tài liệu</el-radio>
            <el-radio label="Bài đăng">Bài đăng</el-radio>
            <el-radio label="Thông báo">Thông báo</el-radio>
          </el-radio-group>
        </div>

        <p class="font-weight-bold">Nội dung bài đăng</p>

        <ckeditor :editor="editor" v-model="postText"></ckeditor>

        <p class="font-weight-bold mt-1">Đính kèm</p>
        <el-upload class="upload-demo" ref="upload" :action="uploadActionURL" :auto-upload="false"
          :before-upload="beforeUpload" :on-success="handleFileUploadSuccess" :on-change="handleFileChange" multiple>
          <el-button slot="trigger" round size="small" type="primary" plain class="">Chọn tệp</el-button>
          <div class="el-upload__tip" slot="tip">Tải tệp đính kèm</div>
        </el-upload>

        <div class="button-container-tall">
          <el-button @click="isQuestionPopupVisible = false" class="close-button" type="danger"
            icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetText" class="refresh-button" type="warning" icon="el-icon-refresh">Làm mới</el-button>
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
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { saveNotification } from '@/api/notification';

import io from "socket.io-client";

export default {
  data() {
    return {
      avatarSize: 'small',
      logo: "https://upload.wikimedia.org/wikipedia/vi/2/2e/Dai_hoc_phu_yen_logo.png",
      inputValue: "",
      tableData: [],
      posts: [],
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false,
      postText: "",
      title: "",
      uploadActionURL: process.env.VUE_APP_BACKEND_URL + `/public/upload`,
      fileList: [],
      pathList: [],
      isFileSelected: false,
      postType: '',
      pinnedPosts: [],
      editor: ClassicEditor,
      notifications: [], // Khởi tạo mảng trống
    };
  },
  components: {
    postItem,
    ckeditor: CKEditor.component,
  },

  created() {
    this.loadData();
    // Kết nối với server qua Socket.IO
    //this.socket = io("http://localhost:8001");

    // Lắng nghe sự kiện khi có thông báo mới
    // this.socket.on("updateNotifications", (data) => {
    //   // Cập nhật danh sách thông báo khi có thông báo mới
    //   console.log('Gọi')
    // });
  },
  updated() {
    if (this.$route.params.id) {

      this.scrollToQuestion();

    };

  }
  ,
  computed: {
    cleanQuestionText() {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.postText;
      return tempDiv.textContent || tempDiv.innerText || '';
    },
    isPostButtonDisabled() {
      return this.$store.getters.user.role === 'student';
    },
  },
  methods: {

    scrollToQuestion() {

      // Sử dụng document.getElementById hoặc các phương thức cuộn của thư viện Vue để cuộn xuống câu hỏi cụ thể
      const element = document.getElementById(this.$route.params.id);
      //console.log( element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },
    showQuestionPopup() {
      this.isQuestionPopupVisible = true;
    },
    formatDate(date) {
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm'));
    },
    onReplyInputChange() { },

    handleFileChange(file, fileList) {
      this.isFileSelected = fileList.length > 0;
      console.log(fileList.length)
    },

    submitUpload() {

      if (this.isFileSelected && this.checkData()) {
        this.$refs.upload.submit();

      } else if (this.checkData()) {
        this.submitNoFile();

      }
    },

    beforeUpload(file) {

      this.fileList.push(file);
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
          postType: this.postType,
        };

        this.submitData(newPost);

      }
    },
    submitNoFile() {
      const newPost = {
        title: this.title,
        content: this.cleanQuestionText,
        pinned: this.pinned,
        user: this.$store.getters.user._id,
        postType: this.postType,
      };

      this.submitData(newPost);
    },
    checkData() {
      if (this.title == '' || this.postText == '' || this.postType == '') {
        this.$message.error('Vui lòng nhập đủ thông tin !');
        return false;
      }
      return true;
    },

    // Trong phương thức submitData
    async submitData(newPost) {
      try {
        const saveResponse = await saveData(newPost);
        if (saveResponse && saveResponse.status === 200) {
          const responseData = saveResponse.data;
          if (responseData && responseData.success) {
            this.loadData();
            this.resetText();
            this.isQuestionPopupVisible = false;

            // Đảm bảo làm sạch danh sách file trước khi đăng
            this.$refs.upload.clearFiles();
            this.fileList = []; // Đặt lại danh sách file trong data
            this.pathList = []; // Đặt lại danh sách đường dẫn trong data
            this.isFileSelected = false;

            // Gửi thông báo mới đến server

            const responseSave = await saveNotification({
              user: this.$store.getters.user._id,
              content: "vừa đăng một " + newPost.postType + " mới: " + newPost.title,
            });
            if (responseSave.status === 200) {
              this.$store.getters.socket.emit("newNotification", {});
            }


          } else {
            console.error("Lỗi khi lưu bài đăng: ", responseData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu bài đăng: ", error);
      }
    },
    async loadData() {
      try {
        const response = await getAll();
        if (response && response.data && response.data.success) {
          this.tableData = response.data.posts;

          // Tách bài đăng đã ghim và chưa ghim
          const { pinnedPosts, unpinnedPosts } = this.tableData.reduce(
            (result, post) => {
              if (post.pinned) {
                result.pinnedPosts.push(post);
              } else {
                result.unpinnedPosts.push(post);
              }
              return result;
            },
            { pinnedPosts: [], unpinnedPosts: [] }
          );
          // Ghim bài đăng lên đầu danh sách
          this.posts = [...pinnedPosts, ...unpinnedPosts.reverse()];
        } else {
          console.error("Không thành công: ", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải bài đăng: ", error);
      }
    },

    showTimestampPicker() {
      console.log('123');
    },
    resetText() {
      this.postText = '';
      this.title = '';
      this.postType = '';
      this.$refs.upload.clearFiles();
    },
  },
};
</script>


<style scoped>
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
  left: 7%;
  transform: translateX(-60%);
  z-index: 100;
}



.disabled {
  opacity: 0.5;
  /* Adjust the opacity to make it visually disabled */
  pointer-events: none;
  /* Disable click events */
}
</style>
