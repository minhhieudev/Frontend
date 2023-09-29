<template>
  <el-card>
    <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
    <el-form ref="form" :model="form" label-position="top">
      <el-form-item label="IP cho phép check in">
        <div class="d-flex">
          <el-input v-model="form.app_ip"></el-input>
          <el-button class="ml-2" type="primary" @click="getCurrentIP">IP hiện tại</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { saveData, getCollection } from '@/api/setting';
export default {
  data() {
    return {
      form: {},
      hasChange: false
    }
  },
  watch: {
    form: {
      handler() {
        this.hasChange = true
      },
      deep: true
    }
  },
  created() {
    getCollection().then(({ data }) => {
      let formData = {}
      data.settings.forEach(item => {
        formData[item.key] = item.data
      });
      this.form = formData
    })
  },
  computed: {
    toolbarButtons() {
      let disabled = true;
      if (this.hasChange) {
        disabled = false;
      }

      return [
        {
          label: "Lưu",
          disabled: disabled,
          callback: this.handleSave,
          type: "primary",
        },
      ];
    },
  },
  methods: {
    getCurrentIP() {

    },
    handleSave() {
      saveData(this.form).then()
    }
  }
}
</script>

<style>

</style>