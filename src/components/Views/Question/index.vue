<template>
  <div class="chatroom" ref="questionTableContainer">
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
            <span slot="label"><i class="el-icon-date"></i> Hỏi đáp</span>
            <div class="question-button-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
          </div>
          <div class="input-box">
            <input
              @input="onReplyInputChange"
              placeholder="Nhập nội dung câu hỏi mà bạn muốn hỏi Cố vấn học tập..."
              class="reply-inputs"
              @click="showQuestionPopup"
            />
          </div>
        </div>
       
        <div class="question-container" style="max-height: 700px; overflow-y: auto;">
           <!-- Trong template của index.vue -->
<question
  v-for="mes in questions"
  :ref="mes._id"
  :key="mes._id"
  :title="mes.title"
  :content="mes.content"
  :photoURL="typeof mes.photoURL === 'string' ? mes.photoURL : ''"
  :user="mes.user && mes.user.fullname ? mes.user.fullname : 'Không tên'"
  :createdAt="formatDate(mes.createdAt)"
  :likes="mes.likes"
  :comments="mes.comments"
  :id="mes._id"
/>

          </div>
        
        
       
      </el-main>
    </el-container>

    <el-dialog class="custom-dialog" title="Nhập nội dung câu hỏi" :visible.sync="isQuestionPopupVisible">
      <div class="el-dialog__body">
        <p class="font-weight-bold">Tiêu đề</p>

        <input v-model="titleQuestion" placeholder="Nhập tiêu đề câu hỏi ..." class="reply-inputs" />
        <ckeditor :config="ckEditorConfig" v-model="questionText"></ckeditor>
        <div class="button-container-tall mt-3">
          <el-button @click="isQuestionPopupVisible = false" class="close-button" type="danger" icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetQuestionText" class="refresh-button" type="warning" icon="el-icon-refresh">Làm mới</el-button>
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
      titleQuestion:'',
      selectedQuestionId: null, 
    };
  },
  components: {
    Question
  },



  created() {
  this.loadQuestions();
  // Gọi phương thức scrollToQuestion sau khi dữ liệu đã được tải
 
},
updated() {
  if (this.$route.params.id){
  console.log('Component updated');

    this.scrollToQuestion();

  };

}
,

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
    onReplyInputChange() {},
    submitQuestion() {

      if (this.questionText.trim() !== "") {
        const newQuestion = {
          title: this.titleQuestion,
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
                this.titleQuestion="";
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

<style >
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
  background-color: rgb(165, 154, 154);
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



</style>
