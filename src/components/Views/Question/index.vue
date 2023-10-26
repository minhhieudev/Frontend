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
        <el-tabs type="border-card" class="mt-5">
          <el-tab-pane label="Hỏi đáp">
            <div class="question-button-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
          </div>
          <div class="input-box">
            <input
              v-model="replyText"
              @input="onReplyInputChange"
              placeholder="Nhập nội dung câu hỏi mà bạn muốn hỏi Cố vấn học tập..."
              class="reply-inputs"
              @click="showQuestionPopup"
            />
          </div>
        </div>
        <el-scrollbar wrap-class="question-list">
          <question
            v-for="mes in questions"
            :key="mes._id"
            :content="mes.content"
            :photoURL="typeof mes.photoURL === 'string' ? mes.photoURL : ''"
            :user="mes.user.fullname"
            :createdAt="formatDate(mes.createdAt)"
            :likes="mes.likes"
            :comments="mes.comments"
            :id="mes._id"
          />
        </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="Tài liệu / Bài đăng">
            <post/>
          </el-tab-pane>
        </el-tabs>
       
      </el-main>
    </el-container>

    <!-- Popup nhập nội dung câu hỏi -->
    <el-dialog class="custom-dialog" title="Nhập nội dung câu hỏi" :visible.sync="isQuestionPopupVisible">
      <!-- Sử dụng textarea thay vì el-input để có vùng nhập lớn hơn -->
      <div class="el-dialog__body">
        <ckeditor :config="ckEditorConfig" v-model="questionText"></ckeditor>
        <div class="button-container-tall">
          <!-- Thêm icon cho các button bằng cách sử dụng thuộc tính icon của el-button -->
          <el-button @click="isQuestionPopupVisible = false" class="close-button" icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetQuestionText" class="refresh-button" icon="el-icon-refresh">Làm mới</el-button>
          <el-button @click="showTimestampPicker" class="timestamp-button" icon="el-icon-time">Thời gian đăng</el-button>
          <el-button class="bg-green" type="primary" @click="submitQuestion">Đăng</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Question from './Question';
import Post from '../Post'
import { saveData, getCollection } from '@/api/question';
import { getAll } from '@/api/question';
import { format } from 'date-fns';

const ModelCode = 'question';

export default {
  data() {
    return {
      logo: "https://upload.wikimedia.org/wikipedia/vi/2/2e/Dai_hoc_phu_yen_logo.png",
      replyText: "",
      inputValue: "",
      questions: [],
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false,
      questionText: "",
    };
  },
  components: {
    Question,
    Post
  },
  created() {
    this.loadQuestions();
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    cleanQuestionText() {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.questionText;
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
    submitQuestion() {
      if (this.questionText.trim() !== "") {
        const newQuestion = {
          content: this.cleanQuestionText,
          user: this.$store.getters.user._id,
        };
        saveData(newQuestion)
          .then((response) => {
            if (response && response.status === 200) {
              const responseData = response.data;
              if (responseData && responseData.success) {
                this.loadQuestions();
                this.questionText = "";
                this.isQuestionPopupVisible = false;
              } else {
                console.error("Lỗi khi lưu câu hỏi: ", responseData);
              }
            } else {
              console.error("Lỗi khi gửi câu hỏi, phản hồi không hợp lệ: ", response);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi gửi câu hỏi: ", error);
          });
      } else {
        // Xử lý trường hợp không có nội dung câu hỏi
        // Hiển thị thông báo hoặc xử lý khác tùy ý
      }
    },
    loadQuestions() {
      getAll()
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.questions = response.data.questions;
            this.questions = this.questions.reverse();
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải câu hỏi: ", error);
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

.question-button-container {
  display: flex;
  margin-top: 10px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 5px;
  background-color: white;
  width: 70%;
  margin-left: auto;
}

.input-box {
  flex-grow: 1;
  background-color: white;
}

.reply-inputs {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  background-color: white;
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
