<template>
  <div class="chatroom">
    <el-container>
      <el-header style="height: 120px; padding: 0; position: relative;">
        <!-- Ảnh nền -->
        <div class="background-image">
        </div>
        <!-- Avatar -->
        <div class="logo">
          <el-avatar :size="150" :src="logo"></el-avatar>

        </div>
      </el-header>
      <el-main style="height: calc(100% - 56px); padding: 11px;">
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
      </el-main>
    </el-container>

    <!-- Popup nhập nội dung câu hỏi -->
    <el-dialog class="custom-dialog" title="Nhập nội dung câu hỏi" :visible.sync="isQuestionPopupVisible">
      <!-- Sử dụng textarea thay vì el-input để có vùng nhập lớn hơn -->
      <div class="el-dialog__body">
        <!-- <textarea
          v-model="questionText"
          class="question-textarea"
          placeholder="Nhập nội dung câu hỏi..."
        ></textarea> -->

        <ckeditor  :config="ckEditorConfig" v-model="questionText" 
         ></ckeditor>
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
import Question from './Question.vue';
import { saveData, getCollection } from '@/api/question'
import { getAll } from '@/api/question'; // Import các phương thức từ tệp api/question.js
import { format } from 'date-fns'; 



const ModelCode = 'question';


export default {
  data() {
    return {
      logo: "https://upload.wikimedia.org/wikipedia/vi/2/2e/Dai_hoc_phu_yen_logo.png",
        replyText: "",

      inputValue: "",
      questions: [], // Mảng câu hỏi
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false, // Biến để kiểm soát việc hiển thị popup
      questionText: "", // Dùng để lưu nội dung câu hỏi
    };
  },
  components: {
    Question,
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
      // Hiển thị dialog mời thành viên
      this.isInviteMemberVisible = true;
    },
    showQuestionPopup() {
      // Hiển thị popup nhập nội dung câu hỏi khi click vào
      this.isQuestionPopupVisible = true;
    },
    formatDate(date) {
      // Sử dụng hàm format từ date-fns để định dạng lại ngày tháng
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm')); // Thay đổi định dạng tùy ý
    },
    onReplyInputChange() {
    // Xử lý khi người dùng nhập vào ô phản hồi
    // Ví dụ: có thể kiểm tra độ dài hoặc thực hiện xử lý khác theo nhu cầu
  },
    submitQuestion() {
  if (this.questionText.trim() !== "") {
    // Tạo một đối tượng câu hỏi từ dữ liệu được nhập vào
    // Trong actions hoặc component khác

    const newQuestion = {
      content: this.cleanQuestionText,
      user: this.$store.getters.user._id
      
    };
    // Lưu câu hỏi vào cơ sở dữ liệu bằng cách gọi API
    saveData(newQuestion)
      .then((response) => {
        if (response && response.status === 200) {
          // Kiểm tra xem phản hồi có trạng thái 200 OK không
          const responseData = response.data;

          if (responseData && responseData.success) {
            // Nếu lưu thành công, thêm câu hỏi mới vào danh sách câu hỏi
            this.loadQuestions();
            

            // Xóa nội dung câu hỏi sau khi đã tạo thành công
            this.questionText = "";

            // Đóng popup sau khi tạo câu hỏi
            this.isQuestionPopupVisible = false;
          } else {
            // Xử lý trường hợp lỗi khi lưu câu hỏi (API trả về success: false)
            console.error("Lỗi khi lưu câu hỏi: ", responseData);
          }
        } else {
          // Xử lý trường hợp lỗi khi gọi API (status code khác 200)
          console.error("Lỗi khi gửi câu hỏi, phản hồi không hợp lệ: ", response);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gửi câu hỏi: ", error);
        // Xử lý lỗi nếu có
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
    }
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
  height: 150px; /* Điều chỉnh chiều cao của vùng nhập */
  border: none; /* Loại bỏ viền */
  padding: 10px; /* Khoảng cách bên trong vùng nhập */
  resize: vertical; /* Cho phép điều chỉnh chiều cao theo chiều dọc */
}

.button-container-tall {
  display: flex;
  justify-content: space-between;
}

.close-button,
.refresh-button,
.timestamp-button {
  cursor: pointer; /* Thay đổi con trỏ khi di chuột vào button */
  margin-right: 10px; /* Khoảng cách giữa các button */
}

/* CSS cho popup */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.5); /* Màu nền với độ trong suốt */
}

/* CSS cho nội dung bên trong popup */

/* CSS cho container chứa avatar và nút */
.question-button-container {
  display: flex;
  margin-top: 10px;
  border: 1px solid white; /* Đặt đường viền cho ô nhập phản hồi */
  border-radius: 10px; /* Bo tròn các góc của ô nhập phản hồi */
  padding: 5px;
  background-color: white; /* Màu nền của ô nhập phản hồi */
  width: 70%;
 margin-left: auto;

}

.input-box {
  flex-grow: 1;

  background-color: white; /* Đặt màu nền của ô nhập phản hồi giống màu nền của phần câu hỏi */
}

.reply-inputs {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  background-color: white; /* Đặt màu nền của ô input */
  color: rgb(12, 11, 11); /* Màu văn bản trong ô nhập phản hồi */
}

/* CSS cho avatar */
.avatar {
  margin-right: 10px; /* Khoảng cách giữa avatar và nút */
  /* Đặt kích thước, ảnh và bất kỳ kiểu hiển thị avatar nếu cần */
}



.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/8.jpg'); /* Thay đổi đường dẫn đến ảnh nền của bạn */
  background-size: cover;
  background-position: center;
  /* filter: blur(10px); Hiệu ứng mờ ảnh nền */
  z-index: 99; /* Để đảm bảo ảnh nền nằm sau phần content */
  opacity: 1; /* Điều chỉnh độ trong suốt của ảnh nền */
  border-radius: 25px;
}

/* CSS cho avatar */
.logo {
  position: absolute;
  bottom: -60px; /* Điều chỉnh vị trí avatar xuống phía dưới */
  left: 10%;
  transform: translateX(-60%);
   z-index: 100;
}
</style>
