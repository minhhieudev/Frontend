<template>
  <div class="answer">
    <div class="info">
      <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
      </el-avatar>
      <div>
        <div>
          <span class="author">{{ user }}</span>
          <span class="date">{{ createdAt }}</span>
        </div>
      </div>

    </div>
    <div class="content">{{ content }}</div>
    
    <!-- Hiển thị biểu tượng lượt thích và biểu tượng phản hồi -->
    <div class="actions">
      <div class="like-container">
        <i class="fa fa-heart-o" aria-hidden="true"></i>
        <span class="likes">{{ likes }}</span>
      </div>
    </div>
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

export default {
  props: {
    content: String,
    user: String,
    createdAt: String,
    photoURL: String,
    likes: Number,
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedDate() {
      return this.createdAt ? this.formatDate(this.createdAt) : '';
    },
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
  color:rgb(7, 131, 7);

}

.date {
  margin-left: 10px;
  font-size: 11px;
  color: #a7a7a7;
}

.content {
  margin-left: 30px;
}

/* CSS cho biểu tượng lượt thích và phản hồi */
.actions {
  display: flex;
  align-items: center;
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

.likes {
  font-size: 14px;
  margin-left: 4px;
  color: #555; /* Màu sắc của số liệu lượt thích và phản hồi */
}

</style>
