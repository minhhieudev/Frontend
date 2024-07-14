<template>
  <div>

    <el-button @click="openChat" class="chat" circle> <img src="../../assets/robot.png" class="avatar" /></el-button>
    <div class="speech-bubble">Hello, I'm a chatbot!</div>
    <el-drawer :visible.sync="drawer" :with-header="false">
      <main class="min-h-screen  ">
        <div class="max-w-2xl" style="border-radius: 25px;">
          <div class=" d-flex justify-content-center  bg-green-300" style="background-color: aquamarine;">
            <h3 class="text-4xl font-bold text-center mt-3">TÔI LÀ CHATBOT</h3>
            <img src="../../assets/robot.png" class="avatar my-3" />

          </div>
          <div>
            <div class="  rounded-lg p-6 ">
              <div class="chat-box chat-container">
                <div v-for="(message, index) in chatHistory" :key="index" :class="['chat-message', message.sender]">
                  <img v-if="message.sender === 'user'" src="../../assets/user.png" class="avatar" />
                  <img v-else src="../../assets/robot.png" class="avatar" />

                  <div class="message-content">
                    <div class="message-text">
                      <p>{{ message.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-between  input-container mt-2 p-2">
                <input class="input-cus" v-model="userInput" size="medium" placeholder="Nhập nội dung......"
                  @keyup.enter="sendMessage"></input>
                <button style="border: none;background-color: white;" @click="sendMessage">

                  <i class="fa fa-paper-plane mr-2" style="color:rgb(22, 77, 228);font-size:large;"
                    aria-hidden="true"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </el-drawer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      drawer: false,
      userInput: '',
      chatHistory: [],
      userAvatar: "../../assets/user.png",  // Đường dẫn tới ảnh avatar của người dùng
      botAvatar: "../../assets/robot.png",  // Đường dẫn tới ảnh avatar của bot
    };
  },
  methods: {
    openChat() {
      this.drawer = true;
    },
    async sendMessage() {
      if (this.userInput.trim() === '') return;

      // Add user's message to chat history
      this.chatHistory.push({ text: this.userInput, sender: 'user' });

      // Scroll to bottom after adding a new message
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        const response = await axios.post('https://chatbot-glgn.onrender.com/chat', { message: this.userInput });
        // Add bot's response to chat history
        this.chatHistory.push({ text: response.data.response, sender: 'bot' });

        // Scroll to bottom after adding a new message
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.response ? error.response.data : error.message);
        // Add error message to chat history
        this.chatHistory.push({ text: 'Có lỗi xảy ra. Vui lòng thử lại.', sender: 'bot' });

        // Scroll to bottom after adding a new message
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }


      // Clear user input
      this.userInput = '';
    },
    scrollToBottom() {
      const container = this.$el.querySelector('.chat-container');
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style scoped>
.chat {
  position: fixed;
  bottom: 50%;
  right: 3px;
}

.speech-bubble {
  position: fixed;
  bottom: 58%;
  right: 50px;
  background: white;
  border-radius: 25px;
  padding: 10px;
  width: 150px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: none;
  /* Initially hidden */
  z-index: 1000;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  /* At the bottom of the bubble */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: white;
  /* Color of the arrow */
}

/* Show speech bubble on button hover */
.chat:hover+.speech-bubble {
  display: block;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 83vh;
  overflow-y: auto;
}

.chat-box {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.chat-message {
  display: flex;
  margin: 5px 0;
  max-width: 70%;
}

.chat-message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-message.bot {
  align-self: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.message-content {
  position: relative;
  display: flex;
  align-items: center;
}

.message-text {
  padding: 10px;
  border-radius: 10px;
  position: relative;
}

.message-text::before {
  content: '';
  position: absolute;
  top: 10px;
  width: 0;
  height: 0;
  border-style: solid;
}

.chat-message.user .message-text {
  background-color: #d5f0f7;
}

.chat-message.user .message-text::before {
  right: -10px;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #d5f0f7;
}

.chat-message.bot .message-text {
  background-color: #f8d9d1;
  /* Light blue color for bot messages */
}

.chat-message.bot .message-text::before {
  left: -10px;
  border-width: 10px 10px 10px 0;
  border-color: transparent #f8d9d1 transparent transparent;
  /* Match the bot message background color */
}

.input-container {
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.input-cus {
  border: none;
  font-weight: bold;
}

.input-container {
  border: 2px solid #4f9ef1;
  /* Blue border color */
  border-radius: 20px;
  margin-left: 10px;
  box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.3);
  /* Light blue shadow */
}

.input-container el-button:hover {
  background-color: #0056b3;
}

.icon {
  font-size: 20px;
  margin-right: 5px;
}

.input-cus:focus,
.input-cus:focus-visible,
.input-cus:hover {
  border-color: #007bff;
  outline: none;
}
</style>
