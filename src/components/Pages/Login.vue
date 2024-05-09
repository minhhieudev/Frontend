<template>
  <div class="wrapper-login">
    <el-main class="m-3" :class="$isMobile?'':'h-100'">
      <div class="row" :class="$isMobile?'':'h-100'">
        <div class="col-md-6 d-flex justify-content-center align-items-center">
        </div>
        <div class="col-md-6 d-flex align-items-center text-center">
          <div class="" style="width: inherit; max-width: 500px ;z-index: 999;">
            <LoginFormSection />
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>
<script>
import _ from "lodash";
import CodeInput from "../Globals/CodeInput";
import {
  sendVerificationCode,
  verifyCode,
  forgotPassword,
  saveNewPassword,
} from "@/api/login";
import { destroyOne } from "@/utils/app";
import { setOne } from "../../utils/app";
import LoginFormSection from "@/components/Sections/System/LoginForm";
export default {
  components: {
    CodeInput,
    LoginFormSection
  },
  data() {
    const validatorPass = (_rule, value, callback) => {
      if (this.formForgot.new_password !== value) {
        callback(new Error("Password confirmation is not match"));
      } else {
        callback();
      }
    };
    return {
      form: {
        email: "",
        password: "",
      },
      alert: {
        show: false,
        variant: "danger",
        message: "",
      },
      isLoading: false,
      currentForm: "login",
      forgotPassword: {
        email: "",
      },
      verifyCode: "",
      codeLength: 6,
      countdownCounter: 0,
      verification: {
        code: "",
        hash: "",
        user_id: "",
        is_trust: false,
      },
      authenticationMethod: "by_email",
      captchaResponse: "",
      authType: "",
      formForgot: {
        new_password: "",
        confirm_password: "",
      },
      saveNewPasswordRules: {
        new_password: [
          { required: true, trigger: "blur", message: "Password is required" },
        ],
        confirm_password: [
          {
            validator: validatorPass,
          },
        ],
      },
      isTrust: false,
    };
  },
  watch: {
    isValidVerifyCode(value) {
      if (value) {
        // this.validateVerifyCodeChange()
      }
    },
  },
  methods: {
    afterSuccessfulLogin(clients) {
      setTimeout(() => {
        this.$router.push("/");
      }, 1000);
    },
    handleSelect2FactorMethod() {
      if (this.authenticationMethod) {
        this.currentForm = "verify_code";
      }
    },
    validateVerifyCodeChange: _.debounce(async function () {
      this.handleVerify();
    }, 1000),
    async handleVerify() {
      this.isLoading = true;
      const params = { ...this.verification, type: this.authType };
      const { success, token, user, trust_hash } = await verifyCode(params)
        .then((res) => res.data)
        .catch(() => ({ success: false }));
      this.isLoading = false;
      if (success) {
        if (this.authType === "two_factor") {
          this.$store.dispatch("setLoginData", { user, token });
          this.afterSuccessfulLogin(user.clients);
          if (trust_hash) {
            setOne("auth", "trust_computer_hash", trust_hash);
          }
        } else if (this.authType === "forgot_password") {
          this.currentForm = "new_password";
        }
      }
    },
    handleCountdown() {
      const countdown = async () => {
        await new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        });
        if (this.countdownCounter >= 1) {
          this.countdownCounter -= 1;
          return countdown();
        }
        return false;
      };
      this.countdownCounter = -1;
      setTimeout(() => {
        this.countdownCounter = 60;
        countdown();
      }, 1500);
    },
    async handleForgotPassword() {
      if (!this.forgotPassword.email) {
        this.$notify({
          title: "Error",
          message: "The email field cannot be empty",
          type: "error",
        });
        return;
      }
      this.isLoading = true;
      const data = await forgotPassword({
        email: this.forgotPassword.email,
        response: this.captchaResponse,
      })
        .catch(() => false)
        .then((res) => res.data);
      this.isLoading = false;
      if (data) {
        if (data.success) {
          this.authType = "forgot_password";
          if (data.default_method) {
            this.authenticationMethod = data.default_method;
            this.currentForm = "verify_code";
          } else {
            this.currentForm = "select_2_factor_method";
          }
          this.verification.hash = data.hash;
          this.verification.user_id = data.user_id;
          this.verification.code = "";
        } else {
          this.forgotPassword.email = "";
          this.handleResetReCaptcha();
        }
      }
    },
    handleResetReCaptcha() {
      const { recaptcha } = this.$refs;
      if (recaptcha) {
        recaptcha.reset();
      }
    },
    handleChangeCode(code) {
      this.verification.code = code;
    },
    async sendVerificationCode() {
      this.isLoading = true;
      const { success, code } = await sendVerificationCode({
        method: this.authenticationMethod,
        user_id: this.verification.user_id,
        hash: this.verification.hash,
        type: this.authType,
      })
        .then((res) => res.data)
        .catch(() => ({ success: false }));
      this.isLoading = false;
      if (success) {
        if (code) {
          setTimeout(() => {
            prompt("Verification code: ", code);
          }, 1000);
        }
        this.handleCountdown();
      }
    },
    async handleCodeInputMounted() {
      this.sendVerificationCode();
    },
    async handleSubmitCode() {
      this.handleVerify();
    },
    handleCaptChaResponse(response) {
      this.captchaResponse = response;
    },
    async handleSaveNewPassword() {
      const { formForgotPassword } = this.$refs;
      const isOK = await formForgotPassword.validate();
      if (!isOK) {
        return false;
      }
      this.isLoading = true;
      const params = { ...this.formForgot, hash: this.verification.hash };
      const data = await saveNewPassword(params)
        .catch(() => false)
        .then((res) => res.data);
      this.isLoading = false;
      if (data && data.success) {
        this.currentForm = "login";
      }
    },
    async handleSelectClient(client) {
      await this.$store.dispatch("setClient", client.code);
      setTimeout(() => {
        this.$router.push("/");
      }, 500);
    },
  },
  computed: {
    isValidVerifyCode() {
      return this.verification.code.length == this.codeLength;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-login {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/slide1.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;
}
.wrapper-login::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Màu đen với độ mờ 0.5 */
    z-index: 2;
}
.box-login {
  background: #fff;
  margin-top: 40px;
  border-radius: 0;

  h5 {
    background: var(--green);
    color: #fff;
    padding: 10px;
    text-align: center;
  }

  .form-login {
    padding: 15px;
  }

  .footer-box {
    margin-top: 8px;
  }
}
.progress-bar {
  position: absolute;
  width: 100%;
  height: 3px;
  top: 0;
  left: 0;
  animation: progressbar infinite 2s;
}

.gradient-background {
  background-color: #fbab7e;
  background-image: linear-gradient(98deg, #fbab7e 35%, #ffbb00 77%);
}
</style>
