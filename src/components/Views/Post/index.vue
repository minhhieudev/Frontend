<template>
  <div class="">
    <div class="container">
      <!-- Phần Header -->
      <div class="header">
        <div class="background-image"></div>
        <div class="logo">
          <el-avatar :size="150" :src="logo"></el-avatar>
        </div>
      </div>

      <!-- Phần Main -->
      <div class="main">
        <div :class="{ 'disabled': isPostButtonDisabled }" class="post-button-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" :src="this.$store.getters.currentUser.avatarUrl"></el-avatar>
          </div>
          <div class="input-box">
            <input @input="onReplyInputChange" placeholder="Nhập thông tin muốn đăng tải ..." class="reply-inputs" @click="showPostPopup" />
          </div>
        </div>

        <el-scrollbar wrap-class="post-list" style="max-height: 700px; overflow-y: auto;">
          <postItem style="widows: 100%;" v-for="mes in posts" :key="mes._id" :title="mes.title" :content="mes.content" :pinned="mes.pinned"
            :attachmentPath="mes.attachmentPath" :postType="mes.postType" :avatarUrl="mes.user.avatarUrl"
            :user="mes.user.fullname" :createdAt="formatDate(mes.createdAt)" :likes="mes.likes" :comments="mes.comments"
            :id="mes._id" @pinnedStatusUpdated="loadData" @edit="openEditPost" />
        </el-scrollbar>
      </div>
    </div>

    <!-- Hộp thoại bài đăng -->
    <el-dialog class="custom-dialog-post" :visible.sync="isPostPopupVisible">
      <p class="title-dialog-post">{{ dialogTitle }}</p>
      <div class="el-dialog__body p-3">
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
        <p v-if="isEditing" style="color: red" class="mt-2">Chọn lại tệp đính kèm</p>
        <p class="font-weight-bold mt-1">Đính kèm</p>
        <el-upload class="upload-demo" ref="upload" :action="uploadActionURL" :auto-upload="false" :before-upload="beforeUpload" :on-success="handleFileUploadSuccess" :on-change="handleFileChange" multiple>
          <el-button slot="trigger" round size="small" type="primary" plain class="">Chọn tệp</el-button>
          <div class="el-upload__tip" slot="tip">Tải tệp đính kèm</div>
        </el-upload>

        <div class="button-container-tall">
          <el-button @click="isPostPopupVisible = false" class="close-button" type="danger"
            icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetText" class="refresh-button" type="warning" icon="el-icon-refresh">Làm mới</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">Đăng</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, saveData,updatePost } from '@/api/post';
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
      isPostPopupVisible: false,
      postText: "",
      title: "",
      uploadActionURL: process.env.VUE_APP_BACKEND_URL + `/public/upload`,
      fileList: [],
      pathList: [],
      isFileSelected: false,
      postType: '',
      pinnedPosts: [],
      editor: ClassicEditor,
      notifications: [],
      isEditing: false,

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
      this.scrollToPost();

    };

  }
  ,
  computed: {
    cleanPostText() {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.postText;
      return tempDiv.textContent || tempDiv.innerText || '';
    },
    isPostButtonDisabled() {
      return this.$store.getters.user.role === 'student';
    },
    dialogTitle() {
      if (this.isEditing) {
        return "SỬA BÀI ĐĂNG";
      } else {
        return "TẠO BÀI ĐĂNG";
      }
    }
  },
  methods: {

    scrollToPost() {

      // Sử dụng document.getElementById hoặc các phương thức cuộn của thư viện Vue để cuộn xuống câu hỏi cụ thể
      const element = document.getElementById(this.$route.params.id);
      //console.log( element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    showPostPopup(data) {
      this.isPostPopupVisible = true;

      this.isEditing = false;
      this.title = '';
      this.postType = '';
      this.postText = '';
    },
    openEditPost(data) {
      this.isPostPopupVisible = true;

      this.isEditing = true;

      this.idPost = data.id
      this.title = data.title;
      this.postType = data.typeof;
      this.postText = data.content;
      this.selectedPostId = data._id;
    },

    formatDate(date) {
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm'));
    },
    onReplyInputChange() { },

    handleFileChange(file, fileList) {
      console.log('Hello11')
      console.log(file)
      console.log(fileList)

      this.isFileSelected = fileList.length > 0;
    },



    beforeUpload(file) {
      console.log('Hello22')
      console.log(file)
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
          content: this.cleanPostText,
          user: this.$store.getters.user._id,
          attachmentPath: this.pathList,
          postType: this.postType,
        };

        if (this.isEditing) {
          this.submitEditedPost(newPost)
        } else {
          this.submitData(newPost);

        }
      }
    },
    submitNoFile() {
      const newPost = {
        title: this.title,
        content: this.cleanPostText,
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
    submitUpload() {

      if (this.isFileSelected && this.checkData()) {
        this.$refs.upload.submit();

      } else if (this.checkData()) {
        this.submitNoFile();

      }
    },

    async submitEditedPost() {

      const newPost = {
        title: this.titlePost,
        content: this.postText,
        user: this.selectedPostId,
      }
      const res = await updatePost(this.idPost, newPost)
      if (res && res.status === 200) {
        this.loadPosts()
        this.postText = "";
        this.titlePost = "";
        this.isEditing = false;

      }
      // Sau khi lưu thành công, đóng el-dialog
      this.isPostPopupVisible = false;
      this.postText = "";
      this.titlePost = "";
    },

    async submitEditedPost(newPost) {
      try {
        const saveResponse = await updatePost(this.idPost,newPost);
        if (saveResponse && saveResponse.status === 200) {
          const responseData = saveResponse.data;
          if (responseData && responseData.success) {
            this.loadData();
            this.resetText();
            this.isPostPopupVisible = false;

            // Đảm bảo làm sạch danh sách file trước khi đăng
            this.$refs.upload.clearFiles();
            this.fileList = []; // Đặt lại danh sách file trong data
            this.pathList = []; // Đặt lại danh sách đường dẫn trong data
            this.isFileSelected = false;
            
          } else {
            console.error("Lỗi khi lưu bài đăng: ", responseData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu bài đăng: ", error);
      }
    },

    async submitData(newPost) {
      try {
        const saveResponse = await saveData(newPost);
        if (saveResponse && saveResponse.status === 200) {
          const responseData = saveResponse.data;
          if (responseData && responseData.success) {
            this.loadData();
            this.resetText();
            this.isPostPopupVisible = false;

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
/* Post List Styling */
.post-list {
    max-height: 100%;
    overflow-y: auto;
}

/* Post Form Styling */
.post-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;
}

.post-textarea {
    width: 100%;
    height: 150px;
    border: none;
    padding: 10px;
    resize: vertical;
}

/* Button Container Tall */
.button-container-tall {
    display: flex;
    justify-content: space-between;
}

/* Button Styling */
.close-button,
.refresh-button,
.timestamp-button {
    cursor: pointer;
    margin-right: 10px;
}

/* Dialog Styling */
.el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
}

/* Custom Dialog Post Styling */
.custom-dialog-post .dialog-title {
    text-align: center;
    font-weight: bold;
    color: rgb(3, 42, 151);
    font-size: larger;
}

/* Post Button Container */
.post-button-container {
    margin-top: 6%;
    display: flex;
    border: 1px solid white;
    border-radius: 10px;
    padding: 4px;
    background-color: white;
    width: 85%;
    margin-left: auto;
}

/* Input Box */
.input-box {
    flex-grow: 1;
    background-color: rgb(129, 117, 117);
}

/* Reply Inputs */
.reply-inputs {
    width: 100%;
    padding: 10px;
    outline: none;
    border: none;
    background-color: rgb(247, 243, 243);
    margin-bottom: 5px;
    color: rgb(12, 11, 11);
}

/* Avatar */
.avatar {
    margin-right: 10px;
}

/* Background Image */
.background-image {
    width: 100%;
    height: 160%;
    background-image: url('../../../assets/8.jpg');
    background-size: cover;
    background-position: center;
    opacity: 1;
    border-radius: 25px;
}

/* Logo Styling */
.logo {
    position: absolute;
    top: 97%;
    left: 8%;
    transform: translateX(-50%);
    z-index: 1;
}

/* Disabled Class Styling */
.disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* Title Dialog Post */
.title-dialog-post {
    text-align: center;
    font-weight: bold;
    color: rgb(4, 27, 235);
    font-size: larger;
}

/* Post Container Styling */
.post .container {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 20px;
    height: 100%;
    overflow: hidden;
}

/* Header */
.header {
    grid-row: 1;
    position: relative;
    height: 14vh;
}

/* Main Section */
.main {
    grid-row: 2;
    padding-top: 20px;

}

/* Post Section */
.post {
    height: 100vh;
}
</style>
