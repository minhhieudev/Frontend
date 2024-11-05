<template>
  <div class="question-container">
    <div class="container">
      <!-- Phần Header -->
    
      <!-- Phần Main -->
      <div class="main">
        <div>
          <div class="d-flex  align-items-center p-2">
            <el-input v-model="search" size="mini" placeholder="Tìm theo tên câu hỏi..."
              class="input-question-index">
            </el-input>
            <el-button icon="el-icon-search" class="ml-2" type="success" circle></el-button>
          </div>
        </div>
        <div class="question-button-container">
          <div class="avatar">
           <el-avatar 
            :size="avatarSize" 
            :src="this.$store.getters.currentUser && this.$store.getters.currentUser.avatarUrl 
                  ? this.$store.getters.currentUser.avatarUrl 
                  : 'https://res.cloudinary.com/dpxcvonet/image/upload/v1729304643/jjfd84acjaamikeefdzr.jpg'">
          </el-avatar>
        </div>
          <div class="input-box">
            <input @input="onReplyInputChange" placeholder="Nhập nội dung câu hỏi..." class="reply-inputs" @click="showQuestionPopup" />
          </div>
        </div>

        <el-scrollbar wrap-class="question-list" style="height:80vh; overflow-y: auto;">
          <question 
            v-for="mes in filteredQuestions" 
            :ref="mes._id" 
            :key="mes._id" 
            :title="mes.title" 
            :content="mes.content"
            :avatarUrl="mes.user && mes.user.avatarUrl ? mes.user.avatarUrl : 'https://res.cloudinary.com/dpxcvonet/image/upload/v1729304643/jjfd84acjaamikeefdzr.jpg'" 
            :user="mes.user && mes.user.fullname ? mes.user.fullname : 'Không tên'"
            :createdAt="formatDate(mes.createdAt)" 
            :likes="mes.likes" 
            :id="mes._id" 
            :comments="mes.comments"
            :status="mes.status" 
            :_id="mes.user && mes.user._id ? mes.user._id : null" 
            @pinnedStatusUpdated="loadQuestions" 
            @edit="openEditDialog" 
          />

        </el-scrollbar>
      </div>
    </div>

    <!-- Hộp thoại câu hỏi -->
    <el-dialog class="custom-dialog-question" :visible.sync="isQuestionPopupVisible">
      <p class="title-dialog-question">{{ dialogTitle }}</p>
      <div class="el-dialog__body p-3">
        <p class="font-weight-bold">Tiêu đề</p>
        <input v-model="titleQuestion" placeholder="Nhập tiêu đề câu hỏi ..." class="reply-inputs" />
        <p class="font-weight-bold">Nội dung câu hỏi</p>
        <ckeditor :editor="editor" v-model="questionText"></ckeditor>

        <div class="button-container-tall mt-2">
          <el-button @click="isQuestionPopupVisible = false" class="close-button" type="danger" icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetQuestionText" class="refresh-button" type="warning" icon="el-icon-refresh">Làm mới</el-button>
          <el-button type="success" @click="onSaveButtonClick">Đăng</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import Question from './Question';
import { saveData } from '@/api/question';
import { getAll, updateQuestion } from '@/api/question';
import { format } from 'date-fns';
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { saveNotification } from '@/api/notification';

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
      titleQuestion: '',
      selectedQuestionId: null,
      editor: ClassicEditor,
      isEditing: false,
      search: '',
      questions: [],

    };
  },
  components: {
    Question,
    ckeditor: CKEditor.component,
  },

  mounted() {
    this.loadQuestions();
  },
  updated() {
    if (this.$route.params.id) {
      this.scrollToQuestion();
    };
  },

  computed: {
    avatarSize() {
      return 'small';
    },
    cleanQuestionText() {
      return this.questionText;
    },
    dialogTitle() {
      if (this.isEditing) {
        // Nếu đang sửa câu hỏi, hiển thị "SỬA CÂU HỎI"
        return "SỬA CÂU HỎI";
      } else {
        // Nếu không, hiển thị "TẠO CÂU HỎI"
        return "TẠO CÂU HỎI";
      }
    },
    filteredQuestions() {
      return this.questions.filter(question => {
        // Kiểm tra tiêu đề của câu hỏi có chứa giá trị của `search` hay không
        return question.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    onSaveButtonClick() {
      if (this.isEditing) {
        this.submitEditedQuestion()
      }
      else {
        this.submitQuestion()
      }
    },
    openEditDialog(data) {
      // Mở el-dialog và truyền dữ liệu câu hỏi cần sửa
      this.isQuestionPopupVisible = true;
      this.isEditing = true;


      this.idQuestion = data.id
      this.titleQuestion = data.title;
      this.questionText = data.content;
      this.selectedQuestionId = data._id;
    },
    async submitEditedQuestion() {

      const newQuestion = {
        title: this.titleQuestion,
        content: this.questionText,
        user: this.selectedQuestionId,
      }
      const res = await updateQuestion(this.idQuestion, newQuestion)
      if (res && res.status === 200) {
        this.loadQuestions()
        this.questionText = "";
        this.titleQuestion = "";
        this.isEditing = false;

      }
      // Sau khi lưu thành công, đóng el-dialog
      this.isQuestionPopupVisible = false;
      this.questionText = "";
      this.titleQuestion = "";
    },
    scrollToQuestion() {
      const element = document.getElementById(this.$route.params.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },
    showQuestionPopup() {
      this.isQuestionPopupVisible = true;
      this.isEditing = false; // Đặt lại trạng thái sửa về mặc định
      this.titleQuestion = ''; // Đặt lại tiêu đề câu hỏi về giá trị trống
      this.questionText = ''; // Đặt lại nội dung câu hỏi về giá trị trống
    },

    formatDate(date) {
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm'));
    },
    onReplyInputChange() { },
    async submitQuestion() {
      const trimmedQuestionText = this.questionText.trim();

      if (!trimmedQuestionText) {
        return; // Do nothing if the question is empty
      }

      const newQuestion = {
        title: this.titleQuestion,
        content: this.cleanQuestionText,
        user: this.$store.getters.user._id,
      };

      try {
        const response = await saveData(newQuestion);

        if (response && response.status === 200) {
          const responseData = response.data;

          if (responseData && responseData.success) {
            await this.loadQuestions();
            this.questionText = "";
            this.titleQuestion = "";
            this.isQuestionPopupVisible = false;

            await saveNotification({
              user: this.$store.getters.user._id,
              content: `vừa tạo một câu hỏi mới: ${newQuestion.title}`,
            });

            this.$store.getters.socket.emit("newNotification", {});
          } else {
            console.error("Lỗi khi lưu câu hỏi: ", responseData);
          }
        } else {
          console.error("Lỗi khi gửi câu hỏi, phản hồi không hợp lệ: ", response);
        }
      } catch (error) {
        console.error("Lỗi khi gửi câu hỏi: ", error);
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
      this.titleQuestion = '';
      this.questionText = '';
    },
  },
};
</script>

<style>

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
  border: 1px solid white;
  border-radius: 10px;
  padding: 4px;
  background-color: white;
  width: 85%;
  margin-left: auto;
}

.input-box {
  margin: 0;
  padding: 0;
  flex-grow: 1;
  background-color: rgb(165, 154, 154);
  z-index: 89;
}

.reply-inputs {
  width: 100%;
  padding: 4px;
  outline: none;
  border: none;
  background-color: rgb(247, 243, 243);
  margin-bottom: 5px;
  color: rgb(12, 11, 11);
}

.avatar {
  margin-right: 10px;
}



.title-dialog-question {
  text-align: center;
  font-weight: bold;
  color: rgb(204, 52, 6);
  font-size: larger;
}

/* Post Container Styling */
.question .container {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 20px;
    height: 100%;
    overflow: hidden;

}

.container{
  height: 100%;
  background: linear-gradient(to right, #a8e6cf, #dcedc1);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  border-radius: 25px;
}

/* Main Section */
.main {
    grid-row: 2;

}
.input-question-index{
  width: 20%;
}

.title-ques{
  font-size: xx-large;
  font-family: 'Lobster', cursive;
  color: rgb(255, 255, 255);
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  text-align: center;
  margin: 0

}

.ck-editor__main .ck-content{
  height: 180px;
}

</style>