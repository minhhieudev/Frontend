<template>
  <div style="z-index: 9999;">
    <el-dialog class="custom-dialog " title="Chi tiết" :visible.sync="isInviteMemberVisible">
      <div class="post p-1 ">
        <div class="info">
          <el-avatar :size="avatarSize"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
          <span class="author">{{ user }}</span>
          <span class="date">{{ createdAt }}</span>
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
        <div class="reply-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" :src="photoURL"></el-avatar>
          </div>
          <div class="input-box">
            <input v-model="replyText" @input="onReplyInputChange" @keyup.enter="sendReply"
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
        <answer v-for="ans in answers" :key="ans.id" :content="ans.content" :photoURL="ans.photoURL"
          :user="ans.user.fullname" :createdAt="formatDate(ans.createdAt)" :likes="ans.likes" />
      </div>

    </el-dialog>

  </div>
</template>


<script>
import Answer from '../Question/Answer';
import { saveData, getAnswersByQuestionId } from '@/api/answer'
import { format } from 'date-fns';
import EmojiPicker from '../Question/EmojiPicker';
import { updateComments } from '@/api/post';


export default {
  props: {
    title: String,
    content: String,
    id: String,
    user: String,
    createdAt: String,
    photoURL: String,
    likes: Number,
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
    answersCount() {
      return this.answers.length;
    }
  },
  created() {
    this.loadAnswers();

  },
  data() {
    return {
      replyText: '',
      answers: [],
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

    loadAnswers() {
      getAnswersByQuestionId(this.id)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.answers = response.data.answers;
            updateComments(this.id, this.answers.length);
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
    },
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },
    onReplyInputChange() {
    },
    sendReply(event) {
      if (this.replyText.trim() !== "") {
        const newReply = {
          content: this.replyText,
          question: this.id,
          user: this.$store.getters.user._id
        };
        saveData(newReply)
          .then((response) => {
            if (response && response.status === 200) {
              const responseData = response.data;

              if (responseData && responseData.success) {
                this.loadAnswers();

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
    }
  },
};
</script>

<style scoped>
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
  width: 98%;
}

.custom-dialog .el-dialog__header {
  background-color: #333;
  color: #fff;
  font-size: 16px;
}

.post:hover {
  transform: scale(1.01);
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

.content {}

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
}
</style>   