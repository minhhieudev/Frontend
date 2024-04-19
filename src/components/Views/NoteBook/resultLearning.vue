<template>
  <div style="overflow-x: hidden;">
    <div class="main-content">
      
      <!-- Lặp qua mảng dataList để tạo các card -->
      <el-row :gutter="10">
        <el-col :span="12" v-for="(item, index) in dataList" :key="index">
          <el-card shadow="always" class="card-item">
            <div slot="header" style="display: flex;align-items: center;justify-content: space-between;">
              <p class="card-title">{{ item.kyandnam }}</p>
              <el-button type="success" round><a
                  href="http://dangkymonhoc.pyu.edu.vn/Default.aspx?page=xemdiemthi&id=211ctt009">Chi tiết</a></el-button>
            </div>
            <el-row v-for="(data, dataIndex) in item.data" :key="dataIndex">
              <el-col :span="12">
                <p>{{ data.label }}</p>
              </el-col>
              <el-col :span="12" style="text-align: center;color: rgb(12, 128, 236);">
                <p>{{ data.score }}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getData } from '@/api/search'


export default {
  data() {
    return {
      dataList: []
    };
  },
  created() {
    this.fetchDataFromApi();
  },
  mounted() {

  },
  methods: {
    fetchDataFromApi() {
      console.log('Gọi api')
      const codeStudent = "20574802010015"
      //const codeStudent = this.$store.getter.user._id
      if (codeStudent != "") {
        getData(codeStudent)
          .then(response => {
            this.dataList = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }
    }
  },
}
</script>

<style>
.main-title {
  font-weight: bold;
  color: blue;
  text-align: center;
  padding: 4px;
}

.main-content {}

.card-item {
  border-radius: 25px;
  margin-top: 7px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;

}

.card-title {
  text-transform: uppercase;
  color: rgb(248, 76, 24);
}
</style>
