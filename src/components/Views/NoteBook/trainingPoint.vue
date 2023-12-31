<template>
  <div class="card-container">
    <el-card v-for="(item, index) in data" :key="index" :style="getCardColor(index)" class="box-card">
      <div slot="header" class="clearfix">
        <span>NĂM HỌC: {{ item.schoolYear }}</span>
        <el-button style="float: right; padding: 3px 0" type="text">NĂM {{ index + 1}}</el-button>
      </div>
      <el-row>
        <el-col v-for="(semester, key) in ['semester1', 'semester2', 'wholeYear']" :key="key" :span="8">
          <div class="items">
            <p :style="getColorStyle(key)">{{ getSemesterLabel(key) }}</p>
            <p>ĐIỂM: {{ item[semester].point }}</p>
            <p>XL: {{ item[semester].classify }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getDetailForUser } from '@/api/resultTrainingPoint'

export default {
  data() {
    return {
      data: [],
    }
  },
  created() {
    this.getData();
  },
  methods: {
   
    getData() {
      getDetailForUser(this.$store.getters.user._id)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.data = response.data.trainingPointStudent;
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy điểm rèn luyện: ", error);
        });
    },
    getCardColor(index) {
      const colors = [
        "rgb(168, 245, 219)",
        "rgb(171, 223, 243)",
        "rgb(248, 215, 241)",
        "rgb(243, 226, 150)",
      ];
      const color = colors[index % colors.length];
      return { backgroundColor: color };
    },
    getColorStyle(key) {
      const colorStyles = [
        "rgba(6, 109, 14, 0.856)",
        "rgb(45, 7, 184)",
        "rgb(199, 7, 65)",
      ];
      const color = colorStyles[key];
      return { color };
    },
    getSemesterLabel(key) {
      const labels = [
        "HỌC KỲ 1",
        "HỌC KỲ 2",
        "CẢ NĂM",
      ];
      return labels[key];
    },
  },
};
</script>

<style>
.clearfix {
  margin-bottom: 2px;
  border-bottom: 2px solid black;
  padding-bottom: 8px;
  text-shadow: 1px 1px 0 #d40f0f;
  font-weight: bold;
  color: red;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.items {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #2c2c2c;
  font-weight: bold;
  font-family: "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif;
  text-transform: uppercase;
}

.box-card {
  width: 100%;
  border-radius: 25px;
}
</style>
