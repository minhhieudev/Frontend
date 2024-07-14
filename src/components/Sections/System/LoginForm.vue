<template>
  <div class="">
    <el-card class="box-login pt-3 position-relative" v-loading="isLoading">
      <div class="progress-bar gradient-background"></div>
      <!-- FORM LOGIN -->
      <el-form label-position="top" @submit.native.prevent="handleLogin" v-if="currentForm === 'login'">
        <el-form-item>
          <el-input v-model="form.email" autofocus placeholder="Email address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" show-password placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-block" type="primary" icon="el-icon-unlock" native-type="submit">
            Đăng nhập
          </el-button>
        </el-form-item>
        <!-- <div class="text-center">
          <span class="text-secondary font-italic">or Sign In With</span>
        </div> -->
      </el-form>
      <!-- <a href="/"><div class="mt-2">Trang chủ</div></a> -->
      <!-- END FORM NEW PASSWORD -->
    </el-card>
  </div>
</template>


<script>
export default {
  props: ['metaPath'],
  components: {  },
  data () {
    return {
      isLoading: false,
      currentForm: 'login',
      form: {
        email: 'admin',        
        password: '123456',    
      },
    }
  },
  methods: {
    async handleLogin() {
      //this.handleCountdown()
      if (this.form.email === '' || this.form.password === '') {
        this.$notify({
          title: 'Error',
          message: 'Email or password cannot be empty',
          type: 'error'
        })
        return false
      }
      this.isLoading = true
      const success = await this.$store.dispatch('login', this.form).catch(() => ({ data: false }))
      if (success) {
        this.$router.push('/')
      }
      this.isLoading = false
    },
  }
}
</script>

<style>

</style>