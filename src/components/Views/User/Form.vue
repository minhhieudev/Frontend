<template>
  <div class="ml-3 form-sv">
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="col-md-6 mt-3">
        <el-form ref="form_data" label-width="150px" label-position="left" :model="form">
          <el-form-item label="Tên" required>
            <el-input v-model="form.fullname" autofocus />
          </el-form-item>
          <el-form-item label="Email" required>
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item v-if="!form._id" label="Password" required>
            <el-input v-model="form.password" />
          </el-form-item>
          <el-form-item v-else label="Renew Password">
            <el-input v-model="form.renew_password" />
          </el-form-item>

          <el-form-item label="Quyền">
            <el-select v-model="form.role" placeholder="Select">
              <el-option label="Sinh viên" value="student"></el-option>
              <el-option label="Cố vấn" value="consultant"></el-option>
              <el-option label="Admin" value="Admin"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="Verified">
            <el-switch v-model="form.verified"/>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'user'
import { saveData, getDetail } from "@/api/user";
import { getFullNameCV } from "@/api/consultant";
import { getFullNameSV } from "@/api/student";
export default {
  data: function () {
    return {
      form: {
        fullname: '',
        role: 'student'
      },
      hasChange: false,
    }
  },
  watch: {
    form: {
      handler: function () {
        this.hasChange = true;
      },
      deep: true,
    },
  },
  computed: {
    toolbarButtons() {
      let disabled = true;
      if (this.hasChange) {
        disabled = false;
      }

      return [
        { label: "Quay lại", route: `${ModelCode}_main` },
        {
          label: "Lưu và tiếp tục",
          disabled: disabled,
          callback: this.saveAndContinue,
          type: "primary",
        },
        {
          label: "Lưu",
          disabled: disabled,
          callback: this.handleSave,
          type: "primary",
        },
      ];
    },
  },
  created() {
    this.loadData(this.$route.params.id)
  },
  methods: {
    loadData(currentId) {
      if (currentId) {
        if (!currentId && this.$route.params.id) {
          currentId = this.$route.params.id
        }

        this.$wrLoading(true);
        getDetail(currentId).then(({ data }) => {
          if (data.success) {
            this.$set(this, 'form', data.doc)
            this.hasChange = false;
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.$wrLoading(false);
        })
      }
    },
    saveAndContinue() {
      this.handleSave(true);
    },
    async handleSave(isContinue = false) {
      // Gọi setFullName để cập nhật fullname trước khi lưu
      if (this.form.fullname == '') {
        await this.setFullName();
      }
      this.$refs.form_data.validate(async (valid) => {
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)
          let currentId
          await saveData(this.form).then(({ data }) => {
            if (data.success == true) {
              //this.loadAllUsers()
              if (isContinue === false) {
                this.$router.push({ name: `${ModelCode}_main` });
              } else {
                if (data.doc) {
                  currentId = data.doc._id;
                } else {
                  currentId = this.form._id;
                }
              }
            }
          })

          this.$wrLoading(false)

          if (currentId) {
            if (!this.$route.params.id) {
              this.$router.push({
                name: `${ModelCode}_edit`,
                params: { id: currentId },
              });
            }

            this.loadData(currentId)
            this.$store.dispatch("reRender")
          }
        }
      })
    },
    async setFullName() {
      try {

        const emailValue = String(this.form.email); // Chuyển đổi thành chuỗi

        if (this.form.role == 'consultant') {

          const response = await getFullNameCV({ email: emailValue });
          if (response && response.data && response.data.success) {
            this.form.fullname = response.data.fullName;
          } else {
            console.error("Không thành công: ", response.data);
          }
          return;
        } else if (this.form.role == 'student') {

          const response = await getFullNameSV({ email: emailValue });
          if (response && response.data && response.data.success) {
            this.form.fullname = response.data.fullName;
          } else {
            console.error("Không thành công: ", response.data);
          }
          return;
        }

      } catch (error) {
        console.error("Lỗi khi lấy tên: ", error);
      }
    },
  }
}
</script>
<style scoped>
.form-sv .el-card.is-always-shadow {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.form-sv .el-card {
  border-radius: 25px;
  background-color: white;
}
</style>
