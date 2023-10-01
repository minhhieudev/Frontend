<template>
  <div>
    <el-card class="table-info center">
      <h4 class="table-title">BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN (HỌC KỲ)</h4>
      <el-row>
        <el-col :span="6">
          <el-input v-model="semester" placeholder="Nhập học kỳ"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="schoolYear" placeholder="Nhập năm học"></el-input>
        </el-col>
      </el-row>

      <el-table :data="flattenedCriteriaList" style="width: 100%" border>
        <el-table-column label="STT" width="50" style="font-weight: bold;">
          <template slot-scope="scope">
            <span :class="{ 'bold-text': scope.row.stt }">{{ scope.row.stt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Nội dung và tiêu chí đánh giá">
          <template slot-scope="scope">
            <span :class="{ 'bold-text': scope.row.criteria }">
              {{ scope.row.level === 1 ? scope.row.criteria : scope.row.text }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Mức điểm tối đa" width="50">
          <template slot-scope="scope">
            {{ scope.row.criteria ? '' : scope.row.maxScore }}
          </template>
        </el-table-column>

        <el-table-column label="Điểm" height="5">
          <el-table-column label="SV tự chấm" width="70">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.selfAssessment"
                placeholder="Nhập điểm"
                @input="Update_Total_selfAssessment"
                v-if="!scope.row.stt && !scope.row.criteria"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Lớp chấm" width="70">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.groupAssessment"
                placeholder="Nhập điểm"
                @input="Update_Total_groupAssessment"
                v-if="!scope.row.stt && !scope.row.criteria"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="Cố vấn (xét duyệt)" width="70">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.consultantAssessment"
                placeholder="Nhập điểm"
                @input="Update_Total_consultantAssessment"
                v-if="!scope.row.stt && !scope.row.criteria"
              ></el-input>
            </template>
          </el-table-column>
        </el-table-column>

      </el-table>
      <p style="text-align: center;color: red;font-size: bold;">Total: {{ Total_selfAssessment }}</p>
      <p style="text-align: center;color: rgb(38, 212, 22);font-size: bold;">Total: {{ Total_groupAssessment }}</p>
      <p style="text-align: center;color: rgb(38, 212, 22);font-size: bold;">Total: {{ Total_consultantAssessment }}</p>

      <el-button type="primary" @click="handleSubmit">Gửi</el-button>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'training_point';
import { saveData } from '@/api/detailTrainingPoint';
import { getAll } from '@/api/training_point';
export default {
  data() {
    return {
      criteriaList: [],
      criteriaLists:[],
      resultArray: [],
      totalScore: 0,
      Total_selfAssessment: 0,
      Total_groupAssessment: 0,
      Total_consultantAssessment:0,
      semester: '',
      schoolYear: '',
    };
  },
  created() {
    this.loadData();

  },
  computed: {
    flattenedCriteriaList() {
      const flattenedList = [];
      let stt = 0;

      this.criteriaList.forEach(item => {
        if (item.criteria) {
          stt++;
        }
        flattenedList.push({
          stt: item.criteria ? stt : '',
          level: 1,
          criteria: item.criteria,
        });
        item.content.forEach(contentItem => {
          flattenedList.push({
            level: 2,
            text: contentItem.text,
            
              maxScore: contentItem.maxScore,
              selfAssessment: contentItem.selfAssessment,
              groupAssessment: contentItem.groupAssessment,
              consultantAssessment: contentItem.consultantAssessment,
          });
        });
      });
      this.resultArray=flattenedList;
      
      return flattenedList;
    }
    
  },
  methods: {
    Update_Total_selfAssessment() {
      this.Total_selfAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) =>
          total +
          Number(criteria.selfAssessment || 0),
        0
      );
    },
    Update_Total_groupAssessment() {
      this.Total_groupAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) =>
          total +
          Number(criteria.groupAssessment || 0),
        0
      );
    },
    Update_Total_consultantAssessment() {
      this.Total_consultantAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) =>
          total +
          Number(criteria.consultantAssessment || 0),
        0
      );
    },
    loadData() {
      getAll()
        .then(response => {
          if (response && response.data && Array.isArray(response.data.tranningPoints)) {
            const firstTranningPoint = response.data.tranningPoints[0];
            if (firstTranningPoint && Array.isArray(firstTranningPoint.criteriaList)) {
              this.criteriaList = firstTranningPoint.criteriaList;
            } else {
              console.error("criteriaList không tồn tại hoặc không phải là mảng.");
            }
          } else {
            console.error("Không thành công hoặc dữ liệu không đúng định dạng: ", response.data);
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải câu hỏi: ", error);
        });
    },
    combineObjects(inputArray) {
  const criteriaList = [];
  let currentObject = null;

  inputArray.forEach(obj => {
    if (obj.criteria) {
      // Nếu có thuộc tính "criteria", bắt đầu một đối tượng mới
      currentObject = {
        stt: obj.stt,
        criteria: obj.criteria,
        content: [],
      };
      criteriaList.push(currentObject);
    } else if (currentObject) {
      // Nếu không có "criteria" và đã bắt đầu đối tượng mới
      currentObject.content.push({
        text: obj.text,
        maxScore: obj.maxScore,
        selfAssessment: obj.selfAssessment,
        groupAssessment: obj.groupAssessment,
        consultantAssessment: obj.consultantAssessment,
      });
    }
  });

  return { criteriaList };
},


    handleSubmit() {
      
     
      

    
      saveData(this.combineObjects(this.resultArray))
        .then(response => {
          if (response && response.data) {
            this.$message.success('Lưu dữ liệu thành công');
          } else {
            this.$message.error('Lưu dữ liệu không thành công');
          }
        })
        .catch(error => {
          console.error('Lỗi khi lưu dữ liệu: ', error);
          this.$message.error('Lỗi khi lưu dữ liệu');
        });

    },

  },
};
</script>

<style>
.table-info {
  margin-bottom: 20px;
}

.table-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.custom-table {
  border: 1px solid #000;
}
.bold-text {
  font-weight: bold;
}
</style>
