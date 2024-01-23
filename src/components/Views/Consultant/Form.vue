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
          <el-form-item label="Tên cố vấn" required>
            <el-input v-model="form.fullName" autofocus />
          </el-form-item>
          <el-form-item label="Email" required>
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="Chức vụ/ chức danh, đơn vị" required>
            <el-input v-model="form.position" />
          </el-form-item>
          <el-form-item label="Nhiệm vụ" required>
            <el-input v-model="form.mission" type="text"/>
          </el-form-item>
         
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'consultant'
import { saveData, getDetail,getAll } from "@/api/consultant";
export default {
  data: function () {
    return {
      hasChange: false,
       form: {
        fullName: '',
        email: '',
        position:'',
        mission: '',
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
    loadData (currentId) {
      if ( currentId) {
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
      }
    },
    saveAndContinue() {
      this.handleSave(true);
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
      console.log(this.form.Json + 'alo');
      let currentId;
      this.$refs.form_data.validate(async (valid) => {
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)
          
          await saveData(this.form).then(({data}) => {
            if (data.success == true) {
             // this.loadDataStudent()
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
    


  }
}
</script>
