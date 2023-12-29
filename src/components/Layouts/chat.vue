<template>
  <div>
    <el-button @click="openChat" type="primary" class="chat">
      Open Chat
    </el-button>

    <el-drawer title="ChatGPT Demo" :visible.sync="drawer" :with-header="false">
      <main id="app" class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-2xl mx-auto">
          <div class="mb-4">
            <h1 class="text-4xl font-bold text-center">ChatGPT Demo in 1 file</h1>
          </div>
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flow-root">
              <div class="mt-6">
                <!-- Chat Input -->
                <form @submit.prevent="sendMessage">
                  <div class="flex space-x-3">
                    <input type="text" v-model="userInput" placeholder="Type your message here..."
                      class="flex-1 rounded-md shadow-sm p-2">
                    <button type="submit" class="px-4 py-2
                          bg-blue-500 text-white rounded-md
                          hover:bg-blue-600">
                      <svg v-if="isLoading" aria-hidden="true"
                        class="w-4 relative -top-0.5 mr-1 inline-block text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- SVG paths here -->
                      </svg>
                      Send
                    </button>
                  </div>
                </form>
              </div>

              <!-- Chat Messages -->
              <ul class="divide-y divide-gray-200">
                <li class="py-3 sm:py-4" v-for="message in messages">
                  <div class="flex items-center space-x-4" v-if="message.role !== 'system'"
                    :class="messageClasses(message.role)">
                    <div class="flex-shrink-0">
                      <img v-if="message.role === 'assistant'" class="w-8 h-8 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTagONv1r-0HPnlnWClF12amS_KdrPX83zlhcXHyek&s"
                        alt="ChatGPT Icon" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-800 break-normal whitespace-pre-line"
                        :class="messageClasses(message.role)">
                        <span v-if="message.role === 'user'" class="font-bold">Code Dạo: </span>
                        {{ message.content }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </el-drawer>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      drawer: false,
      userInput: '',
      messages: [
        {
          role: 'system',
          content: "You're a helpful chat bot. Answer short and concise in 150 tokens only."
        }
      ],
      isLoading: false,
      chatGPTKey: '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',
      openAiEndpoint: 'https://api.openai.com/v1',
      requestCount: 0,
      requestTimer: null,
      lastRequestTime: null,
      cooldownTime: 60000, // 60 seconds cooldown time
      maxRequestsPerCooldown: 5,
      cooldownTimer: null,
      cooldownActive: false,
    };
  },
  methods: {
    openChat() {
      this.drawer = true;
    },
    async sendMessage() {
      const currentTime = new Date().getTime();

      // Check if cooldown is active
      if (this.cooldownActive) {
        console.log('Too many requests. Please wait and try again later.');
        return;
      }

      // Check if cooldown is required
      if (this.requestCount >= this.maxRequestsPerCooldown && currentTime - this.lastRequestTime < this.cooldownTime) {
        console.log('Too many requests. Waiting for cooldown...');
        this.startCooldown();
        return;
      }

      // Increment request count
      this.requestCount++;

      this.messages.push({
        role: 'user',
        content: this.userInput
      });

      try {
        this.isLoading = true;
        this.userInput = '';

        const response = await axios.post(
          `${this.openAiEndpoint}/chat/completions`,
          {
            model: 'gpt-3.5-turbo-1106',
            messages: this.messages,
            temperature: 0.6,
            max_tokens: 100,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.chatGPTKey}`,
            },
          }
        );

        this.messages.push({
          role: 'assistant',
          content: response.data.choices[0].message.content
        });

        // Reset cooldown if the request is successful
        this.resetCooldown();

      } catch (error) {
        console.error('There was an error with the API request', error);

        if (error.response && error.response.status === 429) {
          console.log('Too many requests. Waiting for cooldown...');
          this.startCooldown();
        }
      } finally {
        this.isLoading = false;
      }
    },
    startCooldown() {
      this.cooldownActive = true;
      this.cooldownTimer = setTimeout(() => {
        this.resetCooldown();
        console.log('Cooldown period ended. You can now send requests.');
      }, this.cooldownTime);
    },
    resetCooldown() {
      this.requestCount = 0;
      this.lastRequestTime = new Date().getTime();
      this.cooldownActive = false;

      // Clear cooldown timer if active
      if (this.cooldownTimer) {
        clearTimeout(this.cooldownTimer);
      }
    },
    messageClasses(role) {
      return {
        'text-right justify-end': role === 'user',
        'text-left justify-start': role === 'assistant',
      };
    },
  },
};
</script>

<style scoped>
.chat {
  position: fixed;
  bottom: 40px;
  right: 20px;
}
</style>
