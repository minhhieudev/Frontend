<template>
  <div class="row">
    <div class="col-md-6">
      assa
    </div>
    <div class="col-md-6" style="height: 100vh">
      <div class="row h-100 w-100 align-items-center">
        <el-form class="px-3" @submit="submit">
          <div class="py-1">
            <label class="text-secondary">Email</label>
            <el-input
              placeholder="Please input"
              v-model="info.email"
              clearable>
            </el-input>
          </div>
          <div class="py-1">
            <label class="text-secondary">Password</label>
            <el-input
              show-password
              placeholder="Please input"
              v-model="info.password"
              clearable>
            </el-input>
          </div>
          <div class="py-1">
            <label class="text-secondary">Confirm password</label>
            <el-input
              show-password
              placeholder="Please input"
              v-model="info.confirm_password"
              clearable>
            </el-input>
          </div>
          <el-button class="mt-2" @click="submit" type="primary">Register</el-button>
        </el-form>
      </div>
      
    </div>
  </div>
</template>

<script>
import { register } from '@/api/login'
export default {
  data () {
    return {
      info: {
        email: '',
        password: '',
        confirm_password: ''
      }
    }
  },
  methods: {
    submit() {
      console.log(this.info);
      register(this.info).then(rs => {

      }).catch(er => {})
    }
  }
}
</script>

<style>

</style>
