<template>
  <div class="answer">
    <div class="info">
      <el-avatar :size="avatarSize" :src="avatarUrl">
      </el-avatar>
      <div>
        <div class="custom-flex">
          <span class="author">{{ user }}</span>
          <span class="date">{{ createdAt }}</span>

        </div>

      </div>
      <div class="actions ml-4">
        <div class="like-container">
          <i class="fa fa-heart-o" aria-hidden="true" @click.stop="likeAnswers"></i>
          <span class="likes">{{ likesCount }}</span>
        </div>
      </div>

    </div>
    <div class="content">{{ content }}</div>

    <!-- Hiển thị biểu tượng lượt thích và biểu tượng phản hồi -->

  </div>
  <!-- Biểu mẫu để thêm phản hồi mới -->
  <!-- <el-card>
      <el-form @submit.prevent="addResponse">
        <el-form-item label="Thêm phản hồi">
          <el-input v-model="newResponse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">Gửi</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
</template>



<script>
import { formatRelative } from 'date-fns';
import { updateLike } from '../../../api/reply';


export default {
  props: {
    _id: String,
    content: String,
    user: String,
    createdAt: String,
    avatarUrl: String,
    likes: Number,
  },
  data() {
    return {
      likesCount: 0,
    };
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedDate() {
      return this.createdAt ? this.formatDate(this.createdAt) : '';
    },
  },
  created() {
    this.likesCount = this.likes;
  },

  methods: {
    formatDate(seconds) {
      let formattedDate = '';

      if (seconds) {
        formattedDate = formatRelative(
          new Date(seconds * 1000),
          new Date()
        );

        formattedDate =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      }

      return formattedDate;
    },
    async likeAnswers() {
      this.likesCount++;

      try {
        await updateLike(this._id);
      } catch (error) {
        console.error("Lỗi khi cập nhật lượt thích: ", error);
      }
    },
  },
};
</script>

<style scoped>
/* CSS cho giao diện của thành phần phản hồi */
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
  font-size: 11px;
  color: #a7a7a7;
}

.content {
  background-color: #eef7e6;
  border-radius: 25px;
  padding: 8px;
  margin-bottom: 3px;

}

/* CSS cho biểu tượng lượt thích và phản hồi */


.like-container,
.comment-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 3px;
}

.fa-heart-o {
  font-size: 16px;
  color: red;
  /* Màu sắc của biểu tượng lượt thích */
}

.likes {
  font-size: 14px;
  color: #555;
  /* Màu sắc của số liệu lượt thích và phản hồi */
}

.custom-flex {
  display: flex;
  flex-direction: column;
  align-items: first baseline;
}
</style>
