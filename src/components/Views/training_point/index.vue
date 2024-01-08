<template>
  <div style="font-weight: 500;">
    <el-card class="table-info center">
      <h4 class="table-title text-center">BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN (HỌC KỲ)</h4>

      <el-row>
        <el-col :span="6" :offset="6">
          <el-form label-width="80px">
            <el-form-item label="Học kỳ" class="bold-text">
              <el-input v-model="semester" placeholder="Nhập học kỳ" class="custom-input-trainingPoint "
                size="mini"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form label-width="80px">
            <el-form-item label="Năm học" class="bold-text">
              <el-input v-model="schoolYear" placeholder="Nhập năm học" class="custom-input-trainingPoint"
                size="mini"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-form ref="formData" :model="formData" label-width="80px" class="text-center">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <div class="grid-content ">
              <el-form-item label="Họ và tên" class="bold-text">
                <el-input v-model="formData.fullName" placeholder="Họ và tên"
                  class="custom-input-trainingPoint"></el-input>
              </el-form-item>
              <el-form-item label="Lớp" class="bold-text">
                <el-input v-model="formData.className" placeholder="Lớp" class="custom-input-trainingPoint"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-white"></div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content ">
              <el-form-item label="Mã SV" class="bold-text">
                <el-input v-model="formData.studentCode" placeholder="Mã sinh viên"
                  class="custom-input-trainingPoint"></el-input>
              </el-form-item>
              <el-form-item label="Khoa" class="bold-text">
                <el-input v-model="formData.department" placeholder="Khoa" class="custom-input-trainingPoint"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="flattenedCriteriaList" style="width: 100%">
        <el-table-column label="STT" width="50" style="font-weight: bold;" align="center">
          <template slot-scope="scope">
            <span :class="{ 'bold-text': scope.row.stt }">{{ scope.row.stt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Nội dung và tiêu chí đánh giá">
          <template slot-scope="scope">
            <span :class="{
              'bold-text': scope.row.level === 1,
              'bold-text2': hasAsterisk(scope.row.text)
            }">
              {{ scope.row.level === 1 ? scope.row.text : scope.row.text }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Mức điểm tối đa" width="50" align="center">
          <template slot-scope="scope">
            <span>
              {{ (scope.row.level == 2) && (!hasAsterisk(scope.row.text)) ? scope.row.maxScore : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Điểm" height="5" align="center">
          <el-table-column label="SV tự chấm" width="70" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.selfAssessment" placeholder="Nhập điểm" @input="Update_Total_selfAssessment"
                v-if="scope.row.stt && scope.row.level == 1"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Lớp chấm" width="70" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.groupAssessment" placeholder="Nhập điểm" @input="Update_Total_groupAssessment"
                v-if="scope.row.stt && scope.row.level == 1"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="Cố vấn (xét duyệt)" width="70" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.consultantAssessment" placeholder="Nhập điểm"
                @input="Update_Total_consultantAssessment" v-if="scope.row.stt && scope.row.level == 1"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <el-form label-width="140px" class="d-flex justify-content-around">
        <el-form-item label="Sinh viên tự chấm" class="bold-text">
          <el-input class="input-trainingPoint" placeholder="" v-model="Total_selfAssessment"></el-input>
        </el-form-item>
        <el-form-item label="Lớp chấm" class="bold-text">
          <el-input class="input-trainingPoint" placeholder="" v-model="Total_groupAssessment"></el-input>
        </el-form-item>

        <el-form-item label="Cố vấn chấm" class="bold-text">
          <el-input class="input-trainingPoint" placeholder="" v-model="Total_consultantAssessment"></el-input>
        </el-form-item>

      </el-form>
      <div class="d-flex justify-content-between">
        <el-button type="primary" round @click="handleSave">Nộp</el-button>
        <el-button type="info" round @click="loadDetailTrainingPointCopy">Chấm tiếp</el-button>
        <el-button type="warning" round @click="handleSaveCopy">Lưu nháp</el-button>
        <el-button type="success" round @click="handleSubmit" class="text-left">Xác nhận</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'training_point';
import { saveData, getDetail } from '@/api/detailTrainingPoint';
import { getSemester1Data, updateSemester2AndWholeYear, savePoint } from '@/api/resultTrainingPoint';
import { getAll } from '@/api/training_point';
import { updateStatus } from '@/api/detailTrainingPoint';
import { saveDataCopy, getData, handleDeleteCopy } from '@/api/detailTrainingPointNhap';


export default {
  data() {
    return {
      criteriaList: [],
      resultArray: [],
      semester1Data: [],
      totalScore: 0,
      Total_selfAssessment: 0,
      Total_groupAssessment: 0,
      Total_consultantAssessment: 0,
      semester: '',
      schoolYear: '',
      formData: {

        fullName: '',
        className: '',
        studentCode: '',
        department: '',
      },
      isEditMode: false,
      id_nhap: ''
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
      this.loadData()
    }
  },

  computed: {
    // Chuyển form đăng ký sang các row trong array để hiển thị table
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
          text: item.criteria.text,
          selfAssessment: item.criteria.selfAssessment,
          groupAssessment: item.criteria.groupAssessment,
          consultantAssessment: item.criteria.consultantAssessment,

        });
        item.content.forEach(contentItem => {
          flattenedList.push({
            level: 2,
            text: contentItem.text,
            maxScore: contentItem.maxScore,
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
            console.log(detailTrainingPoint);
            this.criteriaList = detailTrainingPoint.criteriaList;
            this.semester = detailTrainingPoint.semester;
            this.schoolYear = detailTrainingPoint.schoolYear;
            this.Total_consultantAssessment = detailTrainingPoint.Total_consultantAssessment
            this.Total_selfAssessment = detailTrainingPoint.Total_selfAssessment
            this.Total_groupAssessment = detailTrainingPoint.Total_groupAssessment
            this.formData.className = detailTrainingPoint.studentDetails.className;
            this.formData.department = detailTrainingPoint.studentDetails.department;
            this.formData.fullName = detailTrainingPoint.studentDetails.fullName;
            this.formData.studentCode = detailTrainingPoint.studentDetails.studentCode;

          } else {
            console.error("Không thành công hoặc dữ liệu không đúng định dạng: ", response.data);
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải chi tiết phiếu điểm: ", error);
        });
    },

    loadDetailTrainingPointCopy() {
      getData(this.$store.getters.user._id)
        .then(response => {
          if (response && response.data && response.data.success) {
            const detailTrainingPoint = response.data.detailTrainingPointNhap;
            this.criteriaList = detailTrainingPoint.criteriaList;
            this.id_nhap = detailTrainingPoint._id;
            this.semester = detailTrainingPoint.semester;
            this.schoolYear = detailTrainingPoint.schoolYear;
            this.Total_consultantAssessment = detailTrainingPoint.Total_consultantAssessment
            this.Total_selfAssessment = detailTrainingPoint.Total_selfAssessment
            this.Total_groupAssessment = detailTrainingPoint.Total_groupAssessment
            this.formData.className = detailTrainingPoint.studentDetails.className;
            this.formData.department = detailTrainingPoint.studentDetails.department;
            this.formData.fullName = detailTrainingPoint.studentDetails.fullName;
            this.formData.studentCode = detailTrainingPoint.studentDetails.studentCode;
          } else {
            console.error("Có lỗi ! ", response.data);
          }
        })
        .catch(error => {
          this.$message.error('Bạn chưa thực hiện chấm điểm');

        });
    },


    combineObjects(inputArray) {
      const criteriaList = [];
      let currentObject = null;

      inputArray.forEach(obj => {
        if (obj.level == 1) {
          // Nếu có thuộc tính "criteria", bắt đầu một đối tượng mới
          currentObject = {
            stt: obj.stt,
            criteria: {
              text: obj.text,
              selfAssessment: obj.selfAssessment,
              groupAssessment: obj.groupAssessment,
              consultantAssessment: obj.consultantAssessment,
            },
            content: [],
          };
          criteriaList.push(currentObject);
        } else if (currentObject) {
          // Nếu không có "criteria" và đã bắt đầu đối tượng mới
          currentObject.content.push({
            text: obj.text,
            maxScore: obj.maxScore,

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
          if (response && response.data && response.data.success) {
            handleDeleteCopy(this.id_nhap)
            this.loadData()
          } else {

          }
        })
        .catch(error => {
          console.error('Lỗi khi lưu dữ liệu: ', error);
          this.$message.error('Lỗi khi lưu dữ liệu');
        });
    },
    handleSaveCopy() {
      // Kiểm tra xem học kỳ và năm học có được nhập không
      if (!this.semester || !this.schoolYear) {
        this.$alert('Vui lòng nhập thông tin về học kỳ và năm học', 'Thông báo', {
          confirmButtonText: 'OK'
        });
        return;
      }
      handleDeleteCopy(this.id_nhap)
        .then(response => {
          if (response) {
            saveDataCopy(this.combineObjects(this.resultArray))
              .then(response => {
                if (response && response.data) {

                } else {
                }
              })
              .catch(error => {
                console.error('Lỗi khi lưu dữ liệu: ', error);
                this.$message.error('Lỗi khi lưu dữ liệu');
              });
          }
        })


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
              this.$message.success('Lưu dữ liệu thành công ');
              updateStatus(this.$route.params.id);

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
        updateSemester2AndWholeYear(this.$store.getters.user._id, this.schoolYear, data.semester2, data.wholeYear);
        updateStatus(this.$route.params.id);

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
    hasAsterisk(str) {
      return str.includes('*');
    }
  },
};
</script>


<style >
.custom-input-trainingPoint .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 0;
}

.custom-input-trainingPoint input {
  color: #333;
  border: none;
  border-bottom: 1px solid #e4e7ed;
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
  border: none;
}

.bold-text2 {
  font-weight: bold;
  border: none;
  font-style: italic;
}

.custom-input-trainingPoint .el-form-item__label {
  font-weight: bold;
}

.input-trainingPoint .el-input__inner {
  border: none;
  border-bottom: #333;
  font-weight: bold;
  color: black;
}
</style>
