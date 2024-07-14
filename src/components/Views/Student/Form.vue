<template>
  <div class="ml-3 form-sv">
    <el-card >
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="col-md-6 mt-3">
        <el-form ref="form_data" label-width="150px" label-position="left" :model="form">
          <el-form-item label="MSV" required>
            <el-input v-model="form.studentCode" autofocus />
          </el-form-item>
          <el-form-item label="Tên" required>
            <el-input v-model="form.fullName" autofocus />
          </el-form-item>
          <el-form-item label="Email" required>
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="Lớp" required>
            <el-input v-model="form.className" />
          </el-form-item>
          <el-form-item label="Khoa" required>
            <el-input v-model="form.department" type="text" />
          </el-form-item>

        </el-form>
      </div>
      <el-button @click="triggerFileInput" type="primary" plain>Import từ file CSV</el-button>
      <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
    </el-card>

  </div>
</template>

<script>
const ModelCode = 'student'
import { saveData, getDetail, getAll, saveStudents } from "@/api/student";
import Papa from "papaparse";  // You need to install papaparse to parse CSV files

export default {
  data: function () {
    return {
      hasChange: false,
      form: {
        studentCode: '',
        fullName: '',
        email: '',
        className: '',
        department: '',
      }
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
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {

            const dataSlice = results.data.slice(0, results.data.length - 1);


            // Tạo mảng mới từ results.data
            const newData = dataSlice.map(item => ({
              fullname: item.fullName,
              email: item.email,
              password: item.studentCode,
            }));
            console.log(newData)

            this.processCSVData(dataSlice, newData);


          }
        });
      }
    },

    saveAndContinue() {
      this.handleSave(true);
    },
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
    loadDataStudent() {
      getAll()
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.posts;
            this.posts = this.tableData.reverse();
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi bài đăng: ", error);
        });
    },
    handleSave: function (isContinue = false) {
      let currentId;
      this.$refs.form_data.validate(async (valid) => {
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)

          await saveData(this.form).then(({ data }) => {
            if (data.success == true) {
              if (isContinue === false) {
                this.$router.push({ name: `${ModelCode}_main` });
              } else {
                if (data.doc) {
                  currentId = data.doc._id;
                } else {
                  currentId = null;
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
    async processCSVData(data, user) {

      await saveStudents(data, user);

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
