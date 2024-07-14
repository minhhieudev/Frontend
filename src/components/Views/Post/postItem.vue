<template>
  <div>
    <div :id="id" class="post my-2 p-3 " @click="openDetailQuestion($event)" ref="postContainer"
      :class="{ 'pinned': pinned }">
      <div class="info">

        <div style="display: flex;justify-content: center">
          <div style="display: flex;justify-content: center;align-items: center;">
            <el-avatar :size="avatarSize" :src="avatarUrl"></el-avatar>
            <div style="display: flex;flex-direction: column;">
              <span class="author ml-2">{{ user }} ( CVHT )</span>
              <span class="date">{{ createdAt }}</span>
            </div>
          </div>

          <div v-if="pinned" class="pinned-indicator">📌 Bài viết đã ghim</div>
        </div>

        <el-dropdown @command="handleDropdownCommand" @click.stop v-if="_id === this.$store.getters.user._id">
          <span class="el-dropdown-link">
            <i class="el-icon-more" @click.stop></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!pinned" icon="fa-solid fa-thumbtack" command="pin">
              Ghim bài
            </el-dropdown-item>
            <el-dropdown-item v-if="pinned" icon="fa-solid fa-thumbtack" command="unpin">
              Huỷ ghim
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-edit" command="edit">
              Sửa
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete" command="delete">Xoá bài</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <p class="font-weight-bold mt-1">
        <span class="post-type" :class="getPostTypeClass()">{{ getPostType() }}</span>
      </p>

      <!-- Hiển thị nội dung bài viết -->
      <div class="content" v-if="showFullContent">
        <div v-html="content"></div>
        <div class="toggle-button-full-content" v-if="content.length > maxContentLength" @click.stop="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>

      <div class="content" v-else>
        <div v-html="truncatedContent"></div>
        <div class="toggle-button-truncated-content" v-if="content.length > maxContentLength"
          @click.stop="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>

      <div class="attachments" v-if="attachmentPath.length > 0">
        <p><strong>Đính kèm:</strong></p>
        <ul>
          <li v-for="(attachment, index) in attachmentPath" :key="index" @click.stop>
            <a :href="attachment.path" target="_blank" :download="attachment.filename"
              @click.prevent="downloadAttachment(attachment)">
              <i :class="getFileIconClass(attachment.filename).class"
                :style="{ color: getFileIconClass(attachment.filename).color }"></i>
              {{ attachment.filename }}
            </a>
          </li>
        </ul>
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
          <el-avatar :size="avatarSize" :src="this.$store.getters.currentUser.avatarUrl"></el-avatar>
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
    <detailPostVue ref="childRef" :id="id" :title="title" :content="content" :avatarUrl="avatarUrl" :user="user"
      :createdAt="createdAt" :likes="likesCount" :comments="comments" :attachmentPath="attachmentPath" />


  </div>
</template>


<script>
import detailPostVue from './detailPost';
import { format } from 'date-fns';
import { updateLike, updatePinnedStatus, } from '../../../api/post';
import { id } from 'date-fns/locale';
import '@fortawesome/fontawesome-free/css/all.css';
import { handleDelete } from '@/api/post';
import { handleDeleteReply } from '@/api/reply';


import axios from 'axios';


export default {
  props: {
    title: String,
    content: {
      type: [String, Array],
      default: "",
    },
    pinned: Boolean,
    postType: String,

    attachmentPath: {
      type: Array,
      default: () => [],
    },
    id: String,
    _id: String,
    user: String,
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
  components: {
    detailPostVue,
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

    truncatedContent() {
      if (this.content && typeof this.content === 'string' && this.content.length) {
        return this.content.slice(0, this.maxContentLength) + '...';
      } else {
        return this.content;
      }
    },
    computedPinned: {
      get() {
        return this.pinned;
      },
      set(newPinnedStatus) {
        this.$emit('update:pinned', newPinnedStatus);
      },
    },
  },

  created() {
    this.likesCount = this.likes;
  },

  methods: {
    downloadAttachment(attachment) {
      axios({
        url: attachment.path,
        method: 'GET',
        responseType: 'blob', // Đảm bảo nhận dữ liệu dạng blob
        baseURL: process.env.VUE_APP_BACKEND_URL,
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', attachment.filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Lỗi khi tải xuống tệp:', error);
        });
    },
    formatDate(date) {
      if (date) {
        return format(date, 'dd/MM/yyyy HH:mm'); // Thay đổi định dạng tùy ý ở đây
      } else {
        return '';
      }
    },
    editPost() {
      // Gửi sự kiện "edit" lên component cha
      this.$emit('edit', { id: this.id, title: this.title, content: this.content, typeof: this.postType, attachmentPath: this.attachmentPath, _id: this._id });
    },
    onReplyInputChange() { },
    getFileIconClass(filename) {
      const fileExtension = filename.split('.').pop().toLowerCase();
      let icon = {
        class: 'fas fa-file', // Mặc định là biểu tượng file
        color: '#333', // Màu mặc định
      };

      switch (fileExtension) {
        case 'pdf':
          icon.class = 'fas fa-file-pdf';
          icon.color = '#ff0000'; // Đỏ cho PDF
          break;
        case 'doc':
        case 'docx':
          icon.class = 'fas fa-file-word';
          icon.color = '#2b5797'; // Màu xanh cho Word
          break;
        case 'xls':
        case 'xlsx':
          icon.class = 'fas fa-file-excel';
          icon.color = '#1f8a70'; // Màu xanh lá cây cho Excel
          break;
        default:
          break;
      }

      return icon;
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
                handleDeleteReply(this.id);
                this.$emit('pinnedStatusUpdated');
              }
            })
            .finally(() => {
              this.$wrLoading(false);
            });
        })
        .catch();
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

    getPostType() {
      return `[ ${this.postType.toUpperCase()} ] ${this.title.toUpperCase()}`;
    },

    getPostTypeClass() {
      switch (this.postType.toLowerCase()) {
        case 'thông báo':
          return 'thong-bao';
        case 'tài liệu':
          return 'tai-lieu';
        case 'bài đăng':
          return 'bai-dang';
        default:
          return '';
      }
    },
    showMoreOptions() {
      this.dropdownVisible = true;
    },

    handleDropdownCommand(command) {
      if (command === 'pin') {
        this.togglePinned(); // Gọi hàm để thực hiện ghim bài
      } else if (command === 'unpin') {
        this.togglePinned();
      } else if (command === 'edit') {
        this.editPost();
      } else if (command === 'unpin') {
        this.togglePinned();
      } else if (command === 'delete') {
        this.confirmDelete();
      }
    },
    async togglePinned() {
      const newPinnedStatus = !this.pinned;

      this.$confirm(`Bạn có chắc chắn muốn ${newPinnedStatus ? 'ghim' : 'huỷ ghim'} bài viết này không?`, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.updatePinnedStatus(newPinnedStatus);
      }).catch(() => {
        console.log('Cancel')
      });
    },

    async updatePinnedStatus(newPinnedStatus) {
      try {
        // Gửi yêu cầu lên máy chủ để cập nhật trạng thái pinned
        await updatePinnedStatus(this.id, newPinnedStatus);
        // Cập nhật trạng thái pinned trong component
        this.computedPinned = newPinnedStatus;
        this.$emit('pinnedStatusUpdated');
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái pinned: ", error);
      }
    },

  },
};
</script>

<style scoped>
.post {
  border: 1px solid black;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
  background-color: white !important;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  width: 98%;
  margin-left: 3px
}


.info {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  
}

.author {
  margin-left: 5px;
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
}

.avatar {
  margin-right: 10px;
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




/* CSS cho phần đính kèm */
.attachments {
  margin-top: 10px;
}

/* Trong phần CSS của bạn */
.attachments i {
  font-size: 24px;
  /* Đặt kích thước icon */
  margin-right: 5px;
  /* Khoảng cách giữa icon và tên file */
  color: #007bff;
}

.attachments ul {
  list-style-type: none;
  padding: 0;
}

.attachments li {
  margin-bottom: 5px;
}





.post-type {
  font-weight: bold;
}

.thong-bao {
  color: red;
}

.tai-lieu {
  color: rgb(177, 42, 230);
}

.bai-dang {
  color: rgb(25, 176, 247);
}

.pinned {
  /* CSS để làm nổi bật bài đăng đã được ghim */
  border: 2px solid rgb(224, 55, 4);
}


.pinned-indicator {
  /* CSS cho biểu tượng hoặc thông báo của bài đăng đã được ghim */
  color: rgb(153, 67, 9);
}
</style>