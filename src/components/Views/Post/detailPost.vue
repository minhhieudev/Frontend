<template>
  <div style="z-index: 9999;">
    <el-dialog :visible.sync="isInviteMemberVisible">
      <div class="post p-1 ">
        <div class="info ">
          <el-avatar :size="avatarSize" :src="avatarUrl"></el-avatar>
          <div class="custom-flex">
            <span class="author">{{ user }}</span>
            <span class="date">{{ createdAt }}</span>
          </div>
        </div>
        <div class="title">
          {{ title }}
        </div>
        <div class="content" v-html="formattedContent"></div>
        <div class="actions">
          <div class="like-container">
            <i class="fa fa-heart-o" aria-hidden="true"></i>
            <span class="likes">{{ likes }}</span>
          </div>
          <div class="comment-container">
            <el-icon style="color: rgb(24, 61, 228);" class="el-icon-chat-dot-square"></el-icon>
            <span class="comments">{{ comments }}</span>
          </div>
        </div>
        <div class="attachments" v-if="attachmentPath.length > 0">
          <p><strong>Đính kèm:</strong></p>
          <ul>
            <li v-for="(attachment, index) in attachmentPath" :key="index">
              <a :href="attachment.path" target="_blank" :download="attachment.filename"
                @click.prevent="downloadAttachment(attachment)">
                <i :class="getFileIconClass(attachment.filename).class"
                  :style="{ color: getFileIconClass(attachment.filename).color }"></i>
                {{ attachment.filename }}
              </a>
            </li>
          </ul>
        </div>
        <div class="reply-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" :src=this.$store.getters.currentUser.avatarUrl></el-avatar>
          </div>
          <div class="input-box">
            <input v-model="replyText"  @keyup.enter="sendReply"
              placeholder="Nhập phản hồi của bạn..." class="reply-input" />
          </div>
          <div class="emoji-button " @click="showEmojiPicker">
            😃
          </div>

          <div class="send-button mr-3" @click="sendReply">
            <i class="fa fa-paper-plane" style="color: rgb(12, 126, 233)" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <emoji-picker v-if="isEmojiPickerVisible" @emoji-selected="insertEmoji" />
      <div class="answer-list mt-2" style="max-height: 200px; overflow-y: auto;">
        <answer v-for="ans in reply" :key="ans.id" :content="ans.content" :avatarUrl="ans.user.avatarUrl"
          :user="ans.user.fullname" :createdAt="formatDate(ans.createdAt)" :likes="ans.likes" />
      </div>

    </el-dialog>

  </div>
</template>


<script>
import Answer from '../Question/Answer';
import { saveData, getReplyByPostId } from '@/api/reply'
import { format } from 'date-fns';
import EmojiPicker from '../Question/EmojiPicker';
import { updateComments } from '@/api/post';
import axios from 'axios';



export default {
  props: {
    title: String,
    content: String,
    id: String,
    user: String,
    createdAt: String,
    avatarUrl: String,
    likes: Number,
    attachmentPath: {
      type: Array,
      default: () => [],
    },
    comments: Number,

  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedContent() {
      return this.content.replace(/\n/g, '<br>');
    },

    formattedDate() {
      if (this.createdAt) {
        if (this.createdAt > 0) {
          return this.formatDate(this.createdAt);
        } else {
          return 'Ngày tạo không hợp lệ';
        }
      } else {
        return 'Ngày tạo không xác định';
      }
    },
    replyCount() {
      return this.reply.length;
    }
  },
  created() {

  },
  data() {
    return {
      replyText: '',
      reply: [],
      isInviteMemberVisible: false,
      isEmojiPickerVisible: false,
    };
  },
  components: {
    Answer,
    EmojiPicker,
  },
  methods: {

    formatDate(date) {
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm'));
    },
    showEmojiPicker() {
      this.isEmojiPickerVisible = true;
    },

    insertEmoji(emoji) {
      this.replyText += emoji;
      this.isEmojiPickerVisible = false;
    },

    loadReply() {
      getReplyByPostId(this.id)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.reply = response.data.reply;
            updateComments(this.id, this.reply.length);
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải câu trả lời: ", error);
        });
    },
    childFunction() {
      this.isInviteMemberVisible = true;
    this.loadReply();

    },
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },

    sendReply(event) {
      if (this.replyText.trim() !== "") {
        const newReply = {
          content: this.replyText,
          reply: this.id,
          user: this.$store.getters.user._id
        };
        saveData(newReply)
          .then((response) => {
            if (response && response.status === 200) {
              const responseData = response.data;

              if (responseData && responseData.success) {
                this.loadReply();

                this.replyText = "";
              } else {
                console.error("Lỗi khi lưu phản hồi: ", responseData);
              }
            } else {
              console.error("Lỗi khi gửi phản hồi, phản hồi không hợp lệ: ", response);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi gửi phản hồi: ", error);
          });
      }
    }
    ,

    validatePhotoURL(url) {
      if (typeof url === 'string') {
        return url;
      } else {
        return '';
      }
    },
    toggleInviteMemberDialog() {
      this.internalIsInviteMemberVisible = !this.internalIsInviteMemberVisible;
    },
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
    getFileIconClass(filename) {
      const fileExtension = filename.split('.').pop().toLowerCase();
      let icon = {
        class: 'fas fa-file',
        color: '#333',
      };

      switch (fileExtension) {
        case 'pdf':
          icon.class = 'fas fa-file-pdf';
          icon.color = '#ff0000';
          break;
        case 'doc':
        case 'docx':
          icon.class = 'fas fa-file-word';
          icon.color = '#2b5797';
          break;
        case 'xls':
        case 'xlsx':
          icon.class = 'fas fa-file-excel';
          icon.color = '#1f8a70';
          break;
        default:
          break;
      }
      return icon;
    },
  },
};
</script>

<style >
.popup {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.post {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  background-color: rgb(245, 246, 247);
  width: 100%;
}



.info {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
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

.content {
  margin-left: 4px;
}

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
}

.likes,
.comments {
  font-size: 14px;
  margin-left: 4px;
  color: #555;
}

.reply-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 2px;
  background-color: #f1e8e8;
}

.avatar {
  margin-right: 10px;
}

.emoji-button:hover {
  cursor: pointer;
}

.input-box {
  flex-grow: 1;
  background-color: #f1e8e8;
}

.reply-input {
  width: 100%;
  border: none;
  outline: none;
  background-color: #f1e8e8;
  ;
  color: rgb(12, 11, 11);
}

.send-button {
  cursor: pointer;
  padding: 3px;

}

.replies {
  max-height: 70vh;
  overflow-y: auto;
}

.title {
  font-weight: bold;
  margin-bottom: 6px;
  margin-left: 4px;
}

.custom-flex {
  display: flex;
  flex-direction: column;
  align-items: first baseline;
}

.el-dialog__header {
  /* padding: 20px; */
  /* padding-bottom: 10px; */
  padding: 0;
}

.el-dialog__body {
  padding: 3px 2px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
</style>   