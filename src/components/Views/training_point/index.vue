<template>

  <div style="font-weight: 500;z-index: 999;" class="ml-3">
    <div class="content-container">

      <el-card class="table-info center">
        <h4 class="table-title text-center">BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN (HỌC KỲ)</h4>
        <div style="max-height: 76vh; overflow-y: auto;">

          <el-row>
            <el-col :span="6" :offset="6">
              <el-form label-width="80px">
                <el-form-item label="Học kỳ" class="bold-text">
                  <el-input v-model="semester" placeholder="Nhập học kỳ" class="custom-input-trainingPoints "
                    size="mini"></el-input>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="6">
              <el-form label-width="80px">
                <el-form-item label="Năm học" class="bold-text">
                  <el-input v-model="schoolYear" placeholder="Nhập năm học" class="custom-input-trainingPoints"
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
                      class="custom-input-trainingPoints"></el-input>
                  </el-form-item>
                  <el-form-item label="Lớp" class="bold-text">
                    <el-input v-model="formData.className" placeholder="Lớp"
                      class="custom-input-trainingPoints"></el-input>
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
                      class="custom-input-trainingPoints"></el-input>
                  </el-form-item>
                  <el-form-item label="Khoa" class="bold-text">

                    <el-select v-model="formData.department" placeholder="Khoa" filterable class="custom-input-cv">
                      <el-option v-for="item in  this.$store.getters.khoaList" :key="item" :label="item"
                        :value="item"></el-option>
                    </el-select>
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
                  <el-input v-model="scope.row.selfAssessment" placeholder="Nhập điểm"
                    @input="Update_Total_selfAssessment" v-if="scope.row.stt && scope.row.level == 1"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="Lớp chấm" width="70" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.groupAssessment" placeholder="Nhập điểm"
                    @input="Update_Total_groupAssessment" v-if="scope.row.stt && scope.row.level == 1"></el-input>
                </template>
              </el-table-column>

              <el-table-column v-if="this.$store.getters.user.role !== 'student'" label="Cố vấn (xét duyệt)" width="70"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.consultantAssessment" placeholder="Nhập điểm"
                    @input="Update_Total_consultantAssessment" v-if="scope.row.stt && scope.row.level == 1"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-form label-width="140px" class="d-flex justify-content-around mt-2">
            <el-form-item label="Sinh viên tự chấm" class="bold-text">
              <div>{{ Total_selfAssessment }}</div>
            </el-form-item>
            <el-form-item label="Lớp chấm" class="bold-text">
              <div>{{ Total_groupAssessment }}</div>

            </el-form-item>

            <el-form-item label="Cố vấn chấm" class="bold-text">
              <div>{{ Total_consultantAssessment }}</div>

            </el-form-item>

          </el-form>
        </div>

        <div class="d-flex justify-content-between">
          <el-button type="primary" round @click="confirmSubmit">Nộp</el-button>
          <el-button type="info" round @click="loadDetailTrainingPointCopy">Chấm tiếp</el-button>
          <el-button type="warning" round @click="handleSaveCopy">Lưu nháp</el-button>
          <el-button v-if="this.$store.getters.user.role != 'student'" type="success" round @click="handleSubmit"
            class="text-left">Xác nhận</el-button>
        </div>
       

      </el-card>

    </div>


  </div>
</template>

<script>
const ModelCode = 'training_point';
import { saveData, getDetail, updateStatus } from '@/api/detailTrainingPoint';
import { getSemester1Data, updateSemester2AndWholeYear, savePoint } from '@/api/resultTrainingPoint';
import { getAll, } from '@/api/training_point';
import { saveDataCopy, getData, handleDeleteCopy } from '@/api/detailTrainingPointNhap';
import { saveDataStatistic, updateIsComplete } from '@/api/statistic';



export default {
  data() {
    return {
      criteriaList: [],
      resultArray: [],
      semester1Data: '',
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
      id_nhap: '',
      listMaxCores: [],

      idUserForSubmit: '',
      isShow: null
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

    getListMaxCore() {
      this.criteriaList.forEach(item => {
        const listMaxCore = [];
        item.content.forEach(item => { listMaxCore.push(item.maxScore) });
        this.listMaxCores.push(listMaxCore)
      })
    },
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
              this.isShow = firstTranningPoint.isShow
              this.getListMaxCore

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
            this.Total_consultantAssessment = detailTrainingPoint.Total_consultantAssessment
            this.Total_selfAssessment = detailTrainingPoint.Total_selfAssessment
            this.Total_groupAssessment = detailTrainingPoint.Total_groupAssessment
            this.formData.className = detailTrainingPoint.studentDetails.className;
            this.formData.department = detailTrainingPoint.studentDetails.department;
            this.formData.fullName = detailTrainingPoint.studentDetails.fullName;
            this.formData.studentCode = detailTrainingPoint.studentDetails.studentCode;

            this.idUserForSubmit = detailTrainingPoint.userDetails._id;

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
        semester: String(this.semester),
        schoolYear: this.schoolYear,
        department: this.formData.department,
        className: this.formData.className,
        criteriaList: criteriaList,
        Total_selfAssessment: this.Total_selfAssessment,
        Total_groupAssessment: this.Total_groupAssessment,
        Total_consultantAssessment: this.Total_consultantAssessment,
      };

      return criteriaLists;
    },
    createResult() {
      const data = {
        className: this.formData.className,
        studentCode: this.formData.studentCode,
        fullName: this.formData.fullName,
        user: this.$store.getters.user._id,
        semester: this.semester,
        schoolYear: this.schoolYear,
        isComplete: true,
      }
      saveDataStatistic(data);
    },
    handleSave() {
      if (!this.validateInputData()) {
        return;
      }
      if (this.Total_groupAssessment == 0) {
        this.Total_groupAssessment = this.Total_selfAssessment
      }
      saveData(this.combineObjects(this.resultArray))
        .then(response => {
          if (response && response.data && response.data.success) {
            this.loadData()
            this.resetText()
            this.createResult()

          } else {

          }
        })
        .catch(error => {
          console.error('Lỗi khi lưu dữ liệu: ', error);
        });
    },

    confirmSubmit() {
      this.$confirm(
        'Bạn có chắc chắn muốn nộp phiếu điểm không?',
        'Xác nhận',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      )
        .then(() => {
          this.handleSave();
        })
        .catch(() => {
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
      getData(this.$store.getters.user._id)
        .then(response => {
          if (response && response.data && response.data.success) {
            handleDeleteCopy(this.$store.getters.user._id)
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

          } else {
            console.error("Có lỗi ! ", response.data);
          }
        })
        .catch(error => {
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

        });
    },
    async handleSubmit() {
      if (!this.semester || !this.schoolYear) {
        this.$message.error('Vui lòng nhập học kỳ và năm học.');
        return;
      }

      const data = {
        department: this.formData.department,
        className: this.formData.className,
        schoolYear: this.schoolYear,
        semester1: { point: '', classify: '', note: '' },
        semester2: { point: '', classify: '', note: '' },
        wholeYear: { point: '', classify: '', note: '' },
        user: this.idUserForSubmit,
      };

      try {
        if (this.semester === '1') {
          if (this.Total_consultantAssessment === 0) {
            this.Total_consultantAssessment = this.Total_selfAssessment
          }
          data.semester1.point = this.Total_consultantAssessment;
          data.semester1.classify = this.getClassification(this.Total_consultantAssessment);
          data.semester1.note = 'Ghi chú';

          const response = await savePoint(data);

          if (response && response.data) {
            //this.$message.success('Lưu dữ liệu thành công ');
            await updateStatus(this.$route.params.id, this.Total_selfAssessment);
            this.$router.push({ name: 'detailTrainingPoint_main' })
          } else {
            this.$message.error('Lưu dữ liệu không thành công');
          }
        } else if (this.semester === '2') {
          const response = await getSemester1Data(this.idUserForSubmit, this.schoolYear);

          if (response && response.data && response.data.success) {
            if (this.Total_consultantAssessment === 0) {
              this.Total_consultantAssessment = this.Total_selfAssessment
            }
            this.semester1Data = response.data.semester1Data.semester1.point;
            data.semester2.point = this.Total_consultantAssessment;
            data.semester2.classify = this.getClassification(this.Total_consultantAssessment);
            data.semester2.note = 'Ghi chú';

            data.wholeYear.point = ((parseFloat(this.semester1Data) || 0) + (parseFloat(data.semester2.point) || 0)) / 2;
            data.wholeYear.classify = this.getClassification(data.wholeYear.point);
            data.wholeYear.note = 'Ghi chú';

            await updateSemester2AndWholeYear(this.idUserForSubmit, this.schoolYear, data.semester2, data.wholeYear);
            await updateStatus(this.$route.params.id);
            this.$router.push({ name: 'detailTrainingPoint_main' })
          } else {
            console.error("Không thành công: ", response.data);
          }
        }
      } catch (error) {
        console.error('Có lỗi xảy ra: ', error);
        this.$message.error('Có lỗi xảy ra');
      }
    },

    getClassification(score) {
      if (score >= 90) {
        return 'Xuất sắc';
      } else if (score >= 80 && score <= 89) {
        return 'Tốt';
      } else if (score >= 65 && score <= 79) {
        return 'Khá';
      } else if (score >= 50 && score <= 64) {
        return 'Trung bình';
      } else if (score >= 35 && score <= 49) {
        return 'Yếu';
      } else {
        return 'Kém';
      }
    },
    hasAsterisk(str) {
      return str.includes('*');
    },

    validateInputData() {
      // Kiểm tra các điều kiện của dữ liệu đầu vào
      if (!this.semester || !this.schoolYear) {
        this.$message.error('Vui lòng nhập học kỳ và năm học.');
        return false;
      }

      // Kiểm tra định dạng của schoolYear và loại bỏ khoảng trắng
      const schoolYearRegex = /^\d{4}\s*-\s*\d{4}$/;
      // Loại bỏ khoảng trắng trong chuỗi schoolYear
      this.schoolYear = this.schoolYear.replace(/\s+/g, '');

      if (!schoolYearRegex.test(this.schoolYear)) {
        this.$message.error('Năm học không hợp lệ. Vui lòng nhập theo định dạng YYYY-YYYY.');
        return false;
      }

      // Kiểm tra giá trị của semester
      if (this.semester != 1 && this.semester != 2) {
        this.$message.error('Học kỳ không hợp lệ. Vui lòng nhập giá trị 1 hoặc 2.');
        return false;
      }

      // Kiểm tra các ô nhập điểm
      let i = 0
      for (const criteria of this.flattenedCriteriaList) {
        if (criteria.level === 1) {
          const numbersOnly = this.listMaxCores[i].filter(item => typeof item === 'number');

          let isNotInArray = false
          for (let j = 0; j < numbersOnly.length; j++) {
            if (criteria.selfAssessment == numbersOnly[j]) { isNotInArray = true };
          }

          if (!isNotInArray) { this.$message.error('Điểm nhập không hợp lệ.'); return false }
          i++
        }
      }
      return true;

    },
    resetText() {
      this.Total_selfAssessment = 0;
      this.Total_groupAssessment = 0;
      this.Total_consultantAssessment = 0;
    },
    Active() {
      // updateStatus().then(response => {
      //   if (response.data.success) {
      //     this.isShow = !this.isShow
      //   }
      // })
      //   .catch(error => {
      //   });
      // if (this.isShow) {
      //   updateIsComplete()
      // }
    },


  }
}
</script>


<style scoped>
.custom-input-trainingPoints .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 0;
  width: 10%;

}

.custom-input-trainingPoints input {
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

.custom-input-trainingPoints .el-form-item__label {
  font-weight: bold;
}

.input-trainingPoint .el-input__inner {
  border: none;
  border-bottom: #333;
  font-weight: bold;
  color: black;
}




.content-container .el-card.is-always-shadow {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.content-container .el-card {
  border-radius: 25px;
  background-color: white;
}
</style>
