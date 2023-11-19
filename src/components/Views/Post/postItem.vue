<template>
    <div>
      <div :id="id" class="question"  @click="openDetailQuestion($event)" ref="questionContainer">

        <!-- @click="openDetailQuestion($event)" -->
        <div class="info" >
 <div style="display: flex;justify-content: center;align-items: center;">
  <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
        

        <div style="display: flex;flex-direction: column;">
          <span class="author ml-2">{{ user }}</span>
        <span class="date">{{ createdAt }}</span>
        </div>
 </div>

      </div>
      <p class="font-weight-bold mt-1">
      <span class="post-type" :class="getPostTypeClass()">{{ getPostType() }}</span>
    </p>
        <!-- Hiển thị nội dung câu hỏi -->
        <div class="content" v-if="showFullContent" >
        {{ content }}
        <div class="toggle-button-full-content" v-if="content.length > maxContentLength" @click.stop="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>
      <div class="content" v-else>
        {{ truncatedContent }}
        <div class="toggle-button-truncated-content"  v-if="content.length > maxContentLength"  @click="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>

      <div class="attachments" v-if="attachmentPath.length > 0">
  <p><strong>Đính kèm:</strong></p>
  <ul>
    <li v-for="(attachment, index) in attachmentPath" :key="index">
      <a :href="attachment.path" target="_blank" :download="attachment.filename" @click.prevent="downloadAttachment(attachment)">
      <i :class="getFileIconClass(attachment.filename).class" :style="{ color: getFileIconClass(attachment.filename).color }"></i>
      {{ attachment.filename }}
    </a>
  </li>


  </ul>
</div>

          
        <!-- Hiển thị biểu tượng lượt thích và biểu tượng phản hồi -->
        <div class="actions">
          <div class="like-container">
            <i class="fa fa-heart-o" aria-hidden="true"  @click.stop="likeQuestion"></i>
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
            <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
          </div>
          <div class="input-box">
            <input
              v-model="replyText"
              @input="onReplyInputChange"
              placeholder="Nhập phản hồi của bạn..."
              class="reply-input" 
            />
          </div>
          <div class="send-button mr-3">
            <i class="fa fa-paper-plane" style="color:rgb(22, 77, 228)" @click="sendReply" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      
  
    </div>
  </template>
  
  
  <script>
  import { formatRelative, parseISO } from 'date-fns';
  import { format } from 'date-fns';
  import { updateLike } from '../../../api/post';
  import { id } from 'date-fns/locale';
  import '@fortawesome/fontawesome-free/css/all.css';

  import axios from 'axios'; // Add this line
  
  
  export default {
    props: {
    title:String,
    content: {
    type: [String, Array], // adjust the type based on your requirements
    default: "", // or default: [] for an array
  },
  postType: String,

  attachmentPath: {
    type: Array,
    default: () => [],
  },
    id:String,
    user: String,
    createdAt: String,
    photoURL: String,
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
  
  truncatedContent() {
  if (this.content && typeof this.content === 'string' && this.content.length) {
    return this.content.slice(0, this.maxContentLength) + '...';
  } else {
    // Handle the case when this.content is undefined or not a string
    return this.content;
  }
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
          console.log( 'text' + url);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', attachment.filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Lỗi khi tải xuống tệp:', error);
          // Xử lý lỗi, ví dụ hiển thị thông báo cho người dùng
        });
    },
      formatDate(date) {
      if (date) {
        return format(date, 'dd/MM/yyyy HH:mm'); // Thay đổi định dạng tùy ý ở đây
      } else {
        return '';
      }
      },
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
    // Thêm các trường hợp khác tùy thuộc vào nhu cầu của bạn
    default:
      break;
  }

  return icon;
},

      
      async likeQuestion() {
      // Tăng lượt thích và cập nhật giá trị mới
      this.likesCount++;
      console.log(this.id);
  
      try {
        // Gửi yêu cầu lên máy chủ để cập nhật lượt thích
        await updateLike(this.id);
        console.log("Cập nhật lượt thích thành công");
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


    },
  };
  </script>
  
  
  
  <style scoped>
  
  /* CSS cho phần câu hỏi */
  .question {
    margin: 10px; /* Khoảng cách giữa các phần câu hỏi */
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 10px; /* Bo tròn các góc của phần câu hỏi */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng cho phần câu hỏi */
    transition: transform 0.2s ease-in-out; /* Hiệu ứng khi hover */
    background-color: white !important;
    z-index: 999;
  }
  
  .question:hover {
    transform: scale(1.01); /* Hiệu ứng phóng to khi hover */
  }
  .info {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .author {
    margin-left: 5px;
    font-weight: bold;
    color:rgb(7, 131, 7);
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
    color: red; /* Màu sắc của biểu tượng lượt thích */
  }
  
  .likes,
  .comments {
    font-size: 14px;
    margin-left: 4px;
    color: #555; /* Màu sắc của số liệu lượt thích và phản hồi */
  }
  
  /* CSS cho ô nhập phản hồi */
  .reply-container {
    display: flex;
    align-items: center;
    margin-top: 10px;
    border: 1px solid #333; /* Đặt đường viền cho ô nhập phản hồi */
    border-radius: 20px; /* Bo tròn các góc của ô nhập phản hồi */
    padding: 5px;
    background-color: #f1e8e8; /* Màu nền của ô nhập phản hồi */
  }
  
  .avatar {
    margin-right: 10px;
  }
  
  .input-box {
    flex-grow: 1;
    background-color: #f1e8e8;; /* Đặt màu nền của ô nhập phản hồi giống màu nền của phần câu hỏi */
  }
  
  .reply-input {
    width: 100%;
    padding: 5px;
    border: none;
    outline: none;
    background-color: #f1e8e8;; /* Đặt màu nền của ô input */
    color: rgb(12, 11, 11); /* Màu văn bản trong ô nhập phản hồi */
  }
  
  .send-button {
    cursor: pointer;
  }
  
  
  
  
  /* CSS cho "Xem thêm" và thu gọn */
  
  .toggle-button-full-content,
  .toggle-button-truncated-content {
    text-align: right; /* Đặt nút "Xem thêm" ở bên phải */
    margin-top: 5px; /* Khoảng cách giữa nút và nội dung */
    cursor: pointer;
    opacity: 0.5;
    font-size: smaller;
  }
  
  .toggle-button-full-content {
    /* Cài đặt cho nút "Xem thêm" trong nội dung đầy đủ */
    display: block; /* Hiển thị nút "Xem thêm" */
  }
  
  .toggle-button-truncated-content {
    /* Cài đặt cho nút "Xem thêm" trong nội dung cắt bớt */
    display: inline; /* Hiển thị nút "Xem thêm" cùng hàng với nội dung */
  }
  
  
  
  
  /* CSS cho phần đính kèm */
.attachments {
  margin-top: 10px;
}
/* Trong phần CSS của bạn */
.attachments i {
  font-size: 24px; /* Đặt kích thước icon */
  margin-right: 5px; /* Khoảng cách giữa icon và tên file */
  color: #007bff; /* Đặt màu sắc cho icon, bạn có thể thay đổi thành màu mong muốn */
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
  </style>
   