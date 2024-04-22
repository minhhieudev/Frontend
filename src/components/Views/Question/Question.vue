<template>
  <div>
    <div :id="id" class="question my-2 p-3 mx-0" @click="openDetailQuestion($event)" ref="questionContainer">
      <div class="info">
        <div style="display: flex;justify-content: center;align-items: center;">
          <el-avatar :size="avatarSize" :src="avatarUrl"></el-avatar>


          <div style="display: flex;flex-direction: column;">
            <span class="author">{{ user }}</span>
            <span class="date">{{ createdAt }}</span>
          </div>
        </div>

        <el-dropdown v-if="_id === this.$store.getters.user._id" @command="handleDropdownCommand" @click.stop> 
          <span class="el-dropdown-link">
            <i class="el-icon-more" @click.stop></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit" command="edit" v-if="!status">
              Sửa
            </el-dropdown-item>

            <el-dropdown-item icon="el-icon-delete" command="delete">Xoá bài</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>

      <div class="title">
        [Câu hỏi] {{ title }}
      </div>

      <div class="content" v-if="showFullContent">
        <div v-html="formattedContent"></div>
        <div class="toggle-button-full-content" v-if="content.length > maxContentLength" @click.stop="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>
      <div class="content" v-else>
        <div v-html="formattedTruncatedContent"></div>
        <div class="toggle-button-truncated-content" v-if="content.length > maxContentLength" @click="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>

      <!-- Hiển thị biểu tượng lượt thích và biểu tượng phản hồi -->
      <div class="actions">
        <div class="like-container">
          <i class="fa fa-heart-o" aria-hidden="true" @click.stop="likeQuestion"></i>
          <span class="likes">{{ likesCount }}</span>
        </div>
        <div class="comment-container">
          <el-icon style="color: rgb(24, 61, 228);" class="el-icon-chat-dot-square"></el-icon>
          <span class="comments">{{ comments }}</span>
        </div>
      </div>

      <!-- Ô nhập phản hồi -->
      <div class="reply-container">
        <div class="avatar">
          <el-avatar :size="avatarSize" :src=this.$store.getters.currentUser.avatarUrl></el-avatar>
        </div>
        <div class="input-box">
          <input v-model="replyText" @input="onReplyInputChange" placeholder="Nhập phản hồi của bạn..."
            class="reply-input" />
        </div>
        <div class="send-button mr-3">
          <i class="fa fa-paper-plane" style="color:rgb(22, 77, 228)" @click="sendReply" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <detailQuestionVue ref="childRef" :id="id" :title="title" :content="content" :_id="_id" :avatarUrl="avatarUrl"
      :user="user" :createdAt="createdAt" :likes="likes" :comments="comments" />

  </div>
</template>


<script>
import detailQuestionVue from './detailQuestion';
import { format } from 'date-fns';
import { updateLike, handleDelete } from '../../../api/question';
import { id } from 'date-fns/locale';



export default {
  props: {
    title: String,
    content: String,
    _id: String,
    id: String,
    user: String,
    status: Boolean,
    createdAt: String,
    avatarUrl: String,
    likes: Number,
    comments: Number,
  },
  data() {
    return {
      showFullContent: false,
      maxContentLength: 350,
      showPopup: false,
      replyText: "",
      isInviteMemberVisible: false,
      likesCount: 0,
    };
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedCreatedAt() {
      if (this.createdAt) {
        return this.formatDate(new Date(this.createdAt));
      } else {
        return '';
      }

    },
    formattedContent() {
      return this.content.replace(/\n/g, '<br>');
    },

    formattedTruncatedContent() {
      const truncated = this.truncatedContent.replace(/\n/g, '<br>');
      return truncated;
    },

    truncatedContent() {
      if (this.content.length > this.maxContentLength) {
        return this.content.slice(0, this.maxContentLength) + '...';
      } else {
        return this.content;
      }
    },

  },
  components: {
    detailQuestionVue,
  },
  created() {
    this.likesCount = this.likes;
  },


  methods: {
    editQuestion() {
      // Gửi sự kiện "edit" lên component cha
      this.$emit('edit', { id: this.id, title: this.title, content: this.content, _id: this._id });
    },
    formatDate(date) {
      if (date) {
        return format(date, 'dd/MM/yyyy HH:mm'); // Thay đổi định dạng tùy ý ở đây
      } else {
        return '';
      }
    },

    async likeQuestion() {
      // Tăng lượt thích và cập nhật giá trị mới
      this.likesCount++;

      try {
        // Gửi yêu cầu lên máy chủ để cập nhật lượt thích
        await updateLike(this.id);
      } catch (error) {
        console.error("Lỗi khi cập nhật lượt thích: ", error);
      }
    },
    toggleContent() {
      this.showFullContent = !this.showFullContent;
    },
    openDetailQuestion(event) {
      // Ngăn chặn sự kiện click lan tỏa ra bên ngoài
      event.stopPropagation();
      this.$refs.childRef.childFunction(); // Gọi hàm ở component con
    },


    onReplyInputChange() {
      console.log('123');
    },
    sendReply() {
      if (this.replyText.trim() !== '') {
        this.replyText = '';
      }
    },

    handleDropdownCommand(command) {
      if (command === 'edit') {
        this.editQuestion();
      } else if (command === 'delete') {
        this.confirmDelete();
      }
    },
    confirmDelete() {
      this.$confirm(`Xác nhận xóa`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning',
      })
        .then(() => {
          handleDelete(this.id)
            .then(({ data }) => {
              if (data.success) {
                this.$emit('pinnedStatusUpdated');
              }
            })
            .finally(() => {
              this.$wrLoading(false);
            });
        })
        .catch();
    },
    toggleEdit() {

    }
  },
};
</script>



<style scoped>
.question {
  /* Khoảng cách giữa các phần câu hỏi */
  border: 1px solid #ccc;
  border-radius: 10px;
  /* Bo tròn các góc của phần câu hỏi */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Đổ bóng cho phần câu hỏi */
  transition: transform 0.2s ease-in-out;
  /* Hiệu ứng khi hover */
  background-color: white !important;
  z-index: 999;
}



.info {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.author {
  margin-left: 10px;
  font-weight: bold;
  color: rgb(7, 131, 7);
}

.date {
  margin-left: 10px;
  font-size: 11px;
  color: #a7a7a7;
}



/* CSS cho biểu tượng lượt thích và phản hồi */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.like-container,
.comment-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.fa-heart-o {
  font-size: 16px;
  color: red;
  /* Màu sắc của biểu tượng lượt thích */
}

.likes,
.comments {
  font-size: 14px;
  margin-left: 4px;
  color: #555;
  /* Màu sắc của số liệu lượt thích và phản hồi */
}

/* CSS cho ô nhập phản hồi */
.reply-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  border: 1px solid #333;
  /* Đặt đường viền cho ô nhập phản hồi */
  border-radius: 20px;
  /* Bo tròn các góc của ô nhập phản hồi */
  padding: 5px;
  background-color: #f1e8e8;
  /* Màu nền của ô nhập phản hồi */
  font-weight: bold;
}

.avatar {
  margin-right: 10px;
}

.title {
  font-weight: bold;
  margin-bottom: 6px;
}

.input-box {
  flex-grow: 1;
  background-color: #f1e8e8;
  ;
  /* Đặt màu nền của ô nhập phản hồi giống màu nền của phần câu hỏi */
}

.reply-input {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  background-color: #f1e8e8;
  ;
  /* Đặt màu nền của ô input */
  color: rgb(12, 11, 11);
  /* Màu văn bản trong ô nhập phản hồi */
}

.send-button {
  cursor: pointer;
}




/* CSS cho "Xem thêm" và thu gọn */

.toggle-button-full-content,
.toggle-button-truncated-content {
  text-align: right;
  /* Đặt nút "Xem thêm" ở bên phải */
  margin-top: 5px;
  /* Khoảng cách giữa nút và nội dung */
  cursor: pointer;
  opacity: 0.5;
  font-size: smaller;
}

.toggle-button-full-content {
  /* Cài đặt cho nút "Xem thêm" trong nội dung đầy đủ */
  display: block;
  /* Hiển thị nút "Xem thêm" */
}

.toggle-button-truncated-content {
  /* Cài đặt cho nút "Xem thêm" trong nội dung cắt bớt */
  display: inline;
  /* Hiển thị nút "Xem thêm" cùng hàng với nội dung */
}
</style>