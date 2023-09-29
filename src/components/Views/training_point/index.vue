<template>
  <div>
    <el-card class="table-info center">
      <h4 class="table-title">BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN (HỌC KỲ)</h4>
      <el-row>
        <el-col :span="6">
          <p>Học kỳ: ...</p>
          <p>Năm học: ...</p>
          <p>Khóa học: ...</p>
        </el-col>
        <el-col :span="6">
          <p>Họ và tên: ...</p>
          <p>Lớp: ...</p>
          <p>Khoa: ...</p>
        </el-col>
      </el-row>
      <el-table :data="flattenedCriteriaList" style="width: 100%" border >
      <el-table-column label="STT" width="50" style="font-weight: bold;">
        <template slot-scope="scope">
      <span :class="{ 'bold-text': scope.row.stt }">{{ scope.row.stt }}</span>
    </template>
      </el-table-column>
      <el-table-column label="Nội dung và tiêu chí đánh giá"  >
        <template slot-scope="scope">
      <span  :class="{ 'bold-text': scope.row.criteria }">
        {{ scope.row.level === 1 ? scope.row.criteria : scope.row.content.text }}
      </span>
    </template>
      </el-table-column>
      <el-table-column label="Mức điểm tối đa" width="50">
        <template slot-scope="scope">
          {{ scope.row.criteria ?   '':scope.row.content.maxScore }}
        </template>
      </el-table-column>

      <el-table-column label="SV tự đánh giá" width="70">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.selfAssessment"
            placeholder="Nhập điểm"
            @input="Update_Total_selfAssessment"
            v-if="!scope.row.stt && !scope.row.criteria" 
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Tập thể đánh giá" width="70">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.groupAssessment"
            placeholder="Nhập điểm"
            @input="Update_Total_groupAssessment"
            v-if="!scope.row.stt && !scope.row.criteria" 
          ></el-input>
        </template>
      </el-table-column>
      
    </el-table>
    <p style="text-align: center;color: red;font-size: bold;">Total: {{ Total_selfAssessment }}</p>
    <p style="text-align: center;color: rgb(38, 212, 22);font-size: bold;">Total: {{ Total_groupAssessment }}</p>
    </el-card>
    
    
  </div>
</template>

<script>
const ModelCode = 'training_point';
import { getAll } from '@/api/training_point';
export default {
  data() {
    return {
      criteriaList: [
      ],
      totalScore: 0,
      Total_selfAssessment: 0,
      Total_groupAssessment:0
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    flattenedCriteriaList() {
      // Chuyển đổi danh sách tiêu đề và nội dung thành danh sách phẳng
      const flattenedList = [];
      let stt = 0; // Khởi tạo STT từ 0
      this.criteriaList.forEach(item => {
        if (item.criteria) {
          // Nếu có criteria, tăng STT lên 1
          stt++;
        }
        flattenedList.push({
          stt: item.criteria ? stt : '', // STT chỉ được thêm khi có criteria
          level: 1,
          criteria: item.criteria,
          maxScore: item.criteria ? item.maxScore : '', // Max score chỉ được hiển thị khi có criteria
          selfAssessment: item.selfAssessment,
          groupAssessment: item.groupAssessment
        });
        item.content.forEach(contentItem => {
          flattenedList.push({
            level: 2,
            content: contentItem,
            maxScore: item.criteria ? item.maxScore : '', // Sử dụng maxScore từ tiêu đề
            selfAssessment: 0,
            groupAssessment: 0
          });
        });
      });
      return flattenedList;
    }
  },
  methods: {
    Update_Total_selfAssessment() {
      // Tính tổng điểm từ danh sách phẳng
      this.Total_selfAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) =>
          total +
          Number(criteria.selfAssessment || 0) ,
        0
      );
    },
    Update_Total_groupAssessment() {
      // Tính tổng điểm từ danh sách phẳng
      this.Total_groupAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) =>
          total +
          Number(criteria.groupAssessment || 0) ,
        0
      );
    },


    loadData() {
  getAll()
    .then((response) => {
      if (response && response.data && Array.isArray(response.data.tranningPoints)) {
        // Kiểm tra xem response.data.tranningPoints là một mảng
        const firstTranningPoint = response.data.tranningPoints[0]; // Lấy phần tử đầu tiên trong mảng

        if (firstTranningPoint && Array.isArray(firstTranningPoint.criteriaList)) {
          // Kiểm tra xem firstTranningPoint.criteriaList là một mảng
          this.criteriaList = firstTranningPoint.criteriaList;
        } else {
          console.error("criteriaList không tồn tại hoặc không phải là một mảng.");
        }
      } else {
        console.error("Không thành công hoặc dữ liệu không đúng định dạng: ", response.data);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải câu hỏi: ", error);
    });
},


  }
};
</script>

<style >
/* Tùy chỉnh CSS cho phần thông tin */
.table-info {
  margin-bottom: 20px;
}

.table-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.custom-table {
  border: 1px solid #000; /* Độ đậm của viền và màu sắc viền */
}
.bold-text{
  font-weight: bold;
}

/* Thêm CSS tùy chỉnh cho component tại đây */
</style>
