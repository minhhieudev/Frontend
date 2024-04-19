<template>
  <el-container style="height: 100vh; ">
    <el-aside style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '2']" @select="handleMenuSelect">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>Trang cá nhân</template>
          <el-menu-item-group>
            <el-menu-item index="1-1">Thông tin</el-menu-item>
            <el-menu-item index="1-2">Thông báo</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>Học tập</template>
          <el-menu-item-group>
            <el-menu-item index="2-1">Kết quả rèn luyện</el-menu-item>
            <el-menu-item index="2-2">Kết quả học tập</el-menu-item>
            <el-menu-item index="2-3">Chương trình đào tạo</el-menu-item>
            <el-menu-item index="2-4">Quyết định sinh viên</el-menu-item>
            <el-menu-item index="2-5">Biểu mẫu - giấy xác nhận</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main class="p-0 mt-0 ml-2">
        <trainingPoint v-if="selectedMenuItem === '2-1'" />
        <resultLearning v-if="selectedMenuItem === '2-2'" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import trainingPoint from './trainingPoint';
import resultLearning from './resultLearning';

export default {
  components: {
    trainingPoint,
    resultLearning
  },
  data() {
    return {
      selectedMenuItem: '', // Set a default value here
      // your other data...
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.selectedMenuItem = index;
    }
  }
};
</script>

<style>
.el-submenu__title {
  background-color: rgb(115, 226, 228);
}

.el-aside {
  color: #333;
}
</style>
