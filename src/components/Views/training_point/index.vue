<template>
  <div>
    <el-card class="table-info center">
      <h4 class="table-title">BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN (HỌC KỲ)</h4>
      <el-row>
  <el-col :span="6">
    <el-form  label-width="80px">
      <el-form-item label="Học kỳ" class="bold-text">
        <el-input v-model="semester" placeholder="Nhập học kỳ" class="custom-input"></el-input>
      </el-form-item>
    </el-form>
  </el-col>
  <el-col :span="6">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="Năm học" class="bold-text">
        <el-input v-model="schoolYear" placeholder="Nhập năm học" class="custom-input"></el-input>
      </el-form-item>
    </el-form>
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
      <el-descriptions title="Kết quả">
          <el-descriptions-item :content-style="{'color': ' #FDE2E2'}" label="Sinh viên tự chấm">{{ Total_selfAssessment }}</el-descriptions-item>
          <el-descriptions-item :labelStyle="{'color': ' #FDE2E2'}" label="Lớp chấm">{{ Total_groupAssessment }}</el-descriptions-item>
          <el-descriptions-item label="Cố vấn chấm">{{ Total_consultantAssessment }}</el-descriptions-item>
      </el-descriptions>
      
      <el-button type="primary" @click="handleSave">Lưu</el-button>
      <el-button type="primary" @click="handleSubmit">Nộp</el-button>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'training_point';
import { saveData,getDetail } from '@/api/detailTrainingPoint';
import { getSemester1Data, updateSemester2AndWholeYear,savePoint } from '@/api/resultTrainingPoint';
import { getAll } from '@/api/training_point';

export default {
  data() {
    return {
      criteriaList: [],
      criteriaLists: [],
      resultArray: [],
      semester1Data: [],
      totalScore: 0,
      Total_selfAssessment: 0,
      Total_groupAssessment: 0,
      Total_consultantAssessment: 0,
      semester: '',
      schoolYear: '',
      isEditMode: false,
    };
  },
  created() {
    // Lấy ID từ định tuyến
    const id = this.$route.params.id;

    // Nếu có ID, đang ở chế độ chỉnh sửa, nếu không, tải mẫu
    if (id) {
      this.isEditMode = true;
      this.loadDetailTrainingPoint(id);
    } else {
      this.isEditMode = false;
      this.loadData();
    }
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
      this.resultArray = flattenedList;

      return flattenedList;
    },
  },
  methods: {
    Update_Total_selfAssessment() {
      this.Total_selfAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) => total + Number(criteria.selfAssessment || 0),
        0
      );
    },
    Update_Total_groupAssessment() {
      this.Total_groupAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) => total + Number(criteria.groupAssessment || 0),
        0
      );
    },
    Update_Total_consultantAssessment() {
      this.Total_consultantAssessment = this.flattenedCriteriaList.reduce(
        (total, criteria) => total + Number(criteria.consultantAssessment || 0),
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

    loadDetailTrainingPoint(id) {
      getDetail(id)
        .then(response => {
          if (response && response.data && response.data.success) {
            const detailTrainingPoint = response.data.detailTrainingPoint;
            this.criteriaList = detailTrainingPoint.criteriaList;
            this.semester = detailTrainingPoint.semester;
            this.schoolYear = detailTrainingPoint.schoolYear;
          } else {
            console.error("Không thành công hoặc dữ liệu không đúng định dạng: ", response.data);
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải chi tiết phiếu điểm: ", error);
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

      const criteriaLists = {
        user: this.$store.getters.user._id,
        semester: this.semester,
        schoolYear: this.schoolYear,
        criteriaList: criteriaList,
        Total_selfAssessment: this.Total_selfAssessment,
        Total_groupAssessment: this.Total_groupAssessment,
        Total_consultantAssessment: this.Total_consultantAssessment,
      };

      return criteriaLists;
    },

    handleSave() {
      // Kiểm tra xem học kỳ và năm học có được nhập không
      if (!this.semester || !this.schoolYear) {
        this.$message.error('Vui lòng nhập học kỳ và năm học.');
        return;
      }

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
    handleSubmit() {
      if (!this.semester || !this.schoolYear) {
        this.$message.error('Vui lòng nhập học kỳ và năm học.');
        return;
      }

      // Khởi tạo object dữ liệu với các giá trị mặc định
      const data = {
        schoolYear: this.schoolYear,
        semester1: {
          point: '',
          classify: '',
          note: '',
        },
        semester2: {
          point: '',
          classify: '',
          note: '',
        },
        wholeYear: {
          point: '',
          classify: '',
          note: '',
        },
        user: this.$store.getters.user._id,
      };

      // Dựa vào giá trị của semester, gán giá trị cho kỳ học tương ứng
      if (this.semester === '1') {
        data.semester1.point = this.Total_consultantAssessment;
        data.semester1.classify = this.getClassification(this.Total_consultantAssessment);
        data.semester1.note = 'Ghi chú';

        // Lưu dữ liệu
      savePoint(data)
        .then(response => {
          if (response && response.data) {
            this.$message.success('Lưu dữ liệu thành công nha');
          } else {
            this.$message.error('Lưu dữ liệu không thành công');
          }
        })
        .catch(error => {
          console.error('Lỗi khi lưu dữ liệu: ', error);
          this.$message.error('Lỗi khi lưu dữ liệu');
        });

        return;
      } else if (this.semester === '2') {
        data.semester2.point = this.Total_consultantAssessment;
        data.semester2.classify = this.getClassification(this.Total_consultantAssessment);
        data.semester2.note = 'Ghi chú';

        // Tính điểm trung bình cả năm và xếp loại
        data.wholeYear.point = ((parseFloat(data.semester1.point) || 0) + (parseFloat(data.semester2.point) || 0)) / 2;
        data.wholeYear.classify = this.getClassification(data.wholeYear.point);
        data.wholeYear.note = 'Ghi chú';

        // Lấy dữ liệu điểm kỳ 1
        getSemester1Data(this.$store.getters.user._id, this.schoolYear)
          .then(response => {
            if (response && response.data && response.data.success) {
              this.semester1Data = response.data.semester1Data;
            } else {
              console.error("Không thành công: ", response.data);
            }
          })
          .catch(error => {
            console.error("Lỗi khi tải điểm kỳ 1: ", error);
          });

        // Cập nhật điểm kỳ 2 và cả năm
        updateSemester2AndWholeYear(this.$store.getters.user._id, this.schoolYear, data.semester2,data.wholeYear);
      }

      
    },

    getClassification(score) {
      if (score >= 90) {
        return 'Xuất sắc';
      } else if (score >= 80) {
        return 'Giỏi';
      } else if (score >= 70) {
        return 'Khá';
      } else if (score >= 60) {
        return 'Trung bình';
      } else {
        return 'Yếu';
      }
    },
  },
};
</script>


<style>
.custom-input .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed; /* Bạn có thể tùy chỉnh màu đường biên */
  border-radius: 0; /* Tùy chọn: Loại bỏ đường cong biên */
}

.table-info {
  margin-bottom: 20px;
}

.table-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.bold-text {
  font-weight: bold;
}
.custom-input .el-form-item__label {
  font-weight: bold;
}
</style>
