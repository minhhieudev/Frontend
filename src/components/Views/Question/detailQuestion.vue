<template>
  <div style="z-index: 9999;" >
    <el-dialog class="custom-dialog " :visible.sync="isInviteMemberVisible">
      <div class="question p-1 ">
        <div class="info ">
          <el-avatar :size="avatarSize" :src="avatarUrl"></el-avatar>
          <div class="custom-flex">
            <span class="author">{{ user }}</span>
            <span class="date">{{ createdAt }}</span>
          </div>

        </div>
        <div class="title">
          [Câu hỏi] {{ title }}
        </div>
        <div class="content" v-html="formattedContent"></div>
        <div class="actions">
          <div class="like-container">
            <i class="fa fa-heart-o" aria-hidden="true"></i>
            <span class="likes">{{ likes }}</span>
          </div>
          <div class="comment-container">
            <el-icon style="color: rgb(24, 61, 228);" class="el-icon-chat-dot-square"></el-icon>
            <span class="comments">{{ answersCount }}</span>
          </div>
        </div>
        <div class="reply-container">
          <div class="avatar">
            <el-avatar :size="avatarSize" :src=this.$store.getters.currentUser.avatarUrl></el-avatar>
          </div>
          <div class="input-box" :class="{ 'disabled': isPostButtonDisabled }">
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
        <answer v-for="ans in answers" :key="ans.id" :_id="ans._id" :content="ans.content" :avatarUrl="ans.user.avatarUrl"
          :user="ans.user.fullname" :createdAt="formatDate(ans.createdAt)" :likes="ans.likes" />
      </div>
    </el-dialog>

  </div>
</template>


<script>
import Answer from './Answer';
import { saveData, getAnswersByQuestionId } from '@/api/answer'
import { updateComments } from '@/api/question'
import { format } from 'date-fns';
import EmojiPicker from './EmojiPicker';
import { updateStatus } from '@/api/question';
import { saveNotification } from '@/api/notification';
import { addNotification } from '@/api/user';


export default {
  props: {
    title: String,
    content: String,
    _id: String,
    id: String,
    user: String,
    createdAt: String,
    avatarUrl: String,
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
    },
    isPostButtonDisabled() {

      //return (this.$store.getters.user._id !== this._id) && (this.$store.getters.user.role === student) ;
    },
  },
  created() {

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
    async saveAnswerCount() {
      try {
        await updateComments(this.id, this.answers.length);
      } catch (error) {
        console.error("Lỗi khi cập nhật lượt thích: ", error);
      }
    },
    loadAnswers() {
      getAnswersByQuestionId(this.id)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.answers = response.data.answers;
            this.saveAnswerCount();


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
      this.loadAnswers();

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
                updateStatus(this.id);
                addNotification(this._id, {
                  user: {
                    _id: this.$store.getters.currentUser._id,
                    fullname: this.$store.getters.currentUser.fullname,
                    avatarUrl: this.$store.getters.currentUser.avatarUrl
                  },
                  content: " đã trả lời câu hỏi của bạn: " + newReply.content,
                })

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

<style>
.question {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  background-color: white;
  width: 100%;
}

.custom-dialog .el-dialog__header {
  background-color: #333;
  color: #fff;
  font-size: 16px;
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
  padding: 2px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.disabled {
  opacity: 0.5;
  /* Adjust the opacity to make it visually disabled */
  pointer-events: none;
  /* Disable click events */
}

.custom-dialog .el-dialog {
  border-radius: 20px;
}
</style>