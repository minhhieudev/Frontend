<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="Đổi mật khẩu" width="30%" @close="resetDialog" center>
      <el-form ref="passForm" :model="passForm" label-width="180px" :rules="rules">
        <el-form-item label="Nhập mật khẩu cũ" prop="passOld">
          <el-input type="text" v-model="passForm.passOld" :show-password="showPassword.passOld" @click-password="togglePassword('passOld')"></el-input>
        </el-form-item>
        <el-form-item label="Nhập mật khẩu mới" prop="passNew">
          <el-input type="password" v-model="passForm.passNew" :show-password="showPassword.passNew" @click-password="togglePassword('passNew')"></el-input>
        </el-form-item>
        <el-form-item label="Nhập lại mật khẩu mới" prop="confirmPassNew">
          <el-input type="password" v-model="passForm.confirmPassNew" :show-password="showPassword.confirmPassNew" @click-password="togglePassword('confirmPassNew')"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFields">Reset</el-button>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handlePassChange">Xác nhận</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/user';

export default {
  data() {
    return {
      dialogVisible: false,
      passForm: {
        passOld: '',
        passNew: '',
        confirmPassNew: ''
      },
      showPassword: {
        passOld: false,
        passNew: false,
        confirmPassNew: false
      },
      rules: {
        passOld: [
          { required: true, message: 'Vui lòng nhập mật khẩu cũ', trigger: 'blur' }
        ],
        passNew: [
          { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' }
        ],
        confirmPassNew: [
          { required: true, message: 'Vui lòng nhập lại mật khẩu mới', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value !== this.passForm.passNew) {
              callback(new Error('Mật khẩu xác nhận không khớp'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    togglePassword(field) {
      this.showPassword[field] = !this.showPassword[field];
    },
    resetFields() {
      for (let field in this.passForm) {
        this.passForm[field] = '';
        this.showPassword[field] = false;
      }
      this.$refs.passForm.clearValidate();
    },
    resetDialog() {
      this.dialogVisible = false;
      this.resetFields();
    },
    handlePassChange() {
      this.$refs.passForm.validate((valid) => {
        if (valid) {
          const { passOld, passNew } = this.passForm;
          changePassword(this.$store.getters.user._id, { currentPassword: String(passOld), newPassword: passNew })
            .then(response => {
              if (response.success) {
                this.$message.success('Đổi mật khẩu thành công');
                this.resetDialog();
              } 
            })
            .catch(error => {
              console.error('Lỗi khi đổi mật khẩu:', error);
              this.$message.error('Đổi mật khẩu thất bại');
            });
        }
      });
    }
  }
};
</script>
