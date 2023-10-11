<template>
  <div>
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="col-md-6 mt-3">
        <el-form
          ref="form_data"
          label-width="150px"
          label-position="left"
          :model="form"
        >
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
          <el-form-item label="SĐT">
            <el-input v-model="form.phone" type="number"/>
          </el-form-item>
          <el-form-item label="Quyền">
            <el-select
              v-model="form.role"
              placeholder="Select">
              <el-option label="Sinh viên" value="student"></el-option>
              <el-option label="Cố vấn" value="consultant"></el-option>
              <el-option label="Quản trị" value="admin"></el-option>
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
export default {
  data: function () {
    return {
      form: {
        address: {},
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
    loadData (currentId) {
      if (!currentId && this.$route.params.id) {
        currentId = this.$route.params.id
      }

      this.$wrLoading(true);
      getDetail(currentId).then(({data}) => {
        if (data.success) {
          this.$set(this, 'form', data.doc)
          this.hasChange = false;
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.$wrLoading(false);
      })
    },
    saveAndContinue() {
      this.handleSave(true);
    },
    handleSave: function (isContinue = false) {
      console.log(this.form);
      this.$refs.form_data.validate(async (valid) => {
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)
          let currentId
          await saveData(this.form).then(({data}) => {
            console.log(data.doc._id);
            if (data.success == true) {
              this.loadAllUsers()
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
    


  }
}
</script>
