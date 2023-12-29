<template>
<el-container style="height: 500px; border: 1px solid #eee">
    <el-aside  style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
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
            <el-menu-item index="2-1">Chương trình đào tạo</el-menu-item>
            <el-menu-item index="2-2">Quyết định sinh viên</el-menu-item>
            <el-menu-item index="2-3">Kết quả rèn luyện</el-menu-item>
            <el-menu-item index="2-4">Kết quả học tập</el-menu-item>
            <el-menu-item index="2-5">Biểu mẫu - giấy xác nhận</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container >
      <el-main class="p-0 mt-0 ml-2">
        <trainingPoint/>

      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import trainingPoint from './trainingPoint.vue';
export default {
  components: {
    trainingPoint
  },
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    };
    return {
      tableData: Array(20).fill(item)
    }
  }
};
</script>

<style>


.el-aside {
  color: #333;
}
</style>















