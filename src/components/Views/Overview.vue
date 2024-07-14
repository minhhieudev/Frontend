<template>
  <div id="dashboard" v-loading="loading" v-if="this.$store.getters.user.role != 'student'">
    <div class=" ml-2 ">
      <section id="content">
        <main>
          <ul class="box-info p-0">

            <li class="bg-white">
              <i class="bx bxs-dollar-circle fa-solid el-icon-date"></i>
              <span class="text">
                <h3 class="A1">
                  <el-select v-model="selectedSemester" size="large" style="" filterable class="custom-input-tk ">
                    <el-option :value="1" label="Kỳ 1"></el-option>
                    <el-option :value="2" label="Kỳ 2"></el-option>
                  </el-select>
                </h3>
                <p>
                  <el-select v-model="selectedSchoolYear" size="large" class="custom-input-tk ">
                    <el-option v-for="year in schoolYears" :key="year" :value="year" :label="year"></el-option>
                  </el-select>
                </p>
              </span>
            </li>

            <li class="bg-white">
              <i class='bx bxs-calendar-check'></i>
              <span class="text">
                <h3>{{ countComplete() }} / {{ this.listClass.length }}</h3>
                <p style="font-weight: bold;">Lớp đã hoàn thành</p>
              </span>
            </li>
            <li class="bg-white ">
              <i class=" bx bxs-group fa-solid el-icon-s-release"></i>

              <span class="text">
                <h3>{{ getCountPhieu }} / {{ this.listPhieu.length }}</h3>
                <p style="font-weight: bold;">Số phiếu chưa duyệt</p>
              </span>
            </li>

          </ul>

          <div class="table-data" style="display: flex;height: 67vh">
            <div class="order"
              style="background-color: white;box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;">
              <div class="head">
                <h5 class="font-weight-bold">DANH SÁCH - {{ getClassTitle }} </h5>
                <!-- Lớp Dropdown -->
                <div class="d-flex align-items-center justify-content-end font-weight-bold">
                  <div class="d-flex align-items-center justify-content-end font-weight-bold ">
                    <el-select v-model="selected" filterable placeholder="Tình trạng" class="input-select3 mr-3"
                      size="mini">
                      <el-option v-for="option in List" :key="option.label" :label="option.label"
                        :value="option.value"></el-option>
                    </el-select>

                    <el-input v-model="search" size="mini" placeholder="Tìm theo tên ... " class="input-tk1 mr-1">
                    </el-input>
                    <i class="fa-solid fa-magnifying-glass mr-2"></i>
                  </div>
                </div>
              </div>

              <div style="max-height: 55vh; overflow-y: auto;">
                <el-table :data="filteredTableData" style="width: 100%;">
                  <el-table-column prop="fullName" label="Họ và tên" align="center">
                    <template slot-scope="{ row }">
                      {{ row.fullName }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="studentCode" label="Mã sinh viên">
                    <template slot-scope="{ row }">
                      {{ row.studentCode }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="isComplete" label="Tình trạng">
                    <template slot-scope="{ row }">
                      <el-button class="p-1 w-40" v-if="row.isComplete" type="success" plain>Hoàn thành</el-button>
                      <el-button class="p-1 w-40" v-else type="danger" plain>Còn thiếu</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="todo" style="background-color: white;">
              <div class="head">
                <h6 class="font-weight-bold">TÌNH TRẠNG CHẤM ĐIỂM </h6>
                <!-- Lớp Dropdown -->
                <div class="d-flex align-items-center justify-content-end font-weight-bold">


                  <div class="d-flex align-items-center justify-content-end  font-weight-bold ">
                    <div class="d-flex justify-content-around">
                      <i class="fa-solid el-icon-refresh-left mr-3" @click="resetData"></i>
                      <el-select v-model="selected2" filterable placeholder="Khoa" class="input-select mr-3"
                        size="mini">
                        <el-option v-for="option in this.$store.getters.khoaList" :key="option" :label="option"
                          :value="option"></el-option>
                      </el-select>
                    </div>
                    <el-input v-model="search2" size="mini" placeholder="Tìm theo lớp ..." class="input-tk2 mr-1">
                    </el-input>
                    <i class="fa-solid fa-magnifying-glass mr-2"></i>

                  </div>
                </div>
              </div>

              <div style="max-height: 55vh; overflow-y: auto;">
                <ul class="p-0">
                  <li v-for="item in filteredTableData2" :key="item.id" class="mt-4 rounded p-1"
                    @click="findClassByName(item.className)"
                    :class="{ 'border border-primary bg': selectedItem === item.className }">
                    <div class="d-flex justify-content-between">
                      <p class="text-info font-weight-bold">{{ item.className }}</p>
                      <p class="text-danger font-weight-bold">{{ calculateStudentSummary(item) }}</p>
                    </div>
                    <el-progress :stroke-width="15" :percentage="calculateIncompletePercentage(item)"
                      :status="calculateIncompletePercentage(item) == 100 ? 'success' : 'exception'"></el-progress>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </main>
      </section>
    </div>

  </div>
</template>

<script>
import { getCondition } from '@/api/detailTrainingPoint';
import { getConditionStatistic } from '@/api/statistic';

export default {
  data() {
    return {
      loading: false,
      listClass: [],
      listStudents: [],
      dataFilter: [],
      selectedItem: null,
      classTitle: '',
      selected: null,
      selected2: null,
      List: [
        { label: 'Tất cả', value: null },
        { label: 'Đã hoàn thành', value: true },
        { label: 'Còn thiếu', value: false }
      ],
      search: '',
      search2: '',
      studentList: [],
      listPhieu: [],
      selectedSemester: 1,
      selectedSchoolYear: '',
      schoolYears: [],
    };
  },

  created() {
    if (this.$store.getters.user.role == 'student') {
      this.$router.push({ name: 'post_main' })
    }
    else {
      this.generateSchoolYears();
    }
  },

  computed: {

    getClassTitle() {
      return this.classTitle
    },
    getCountPhieu() {
      return this.listPhieu.filter(item => !item.status).length;
    },

    getClassList() {
      const list = []
      this.listClass.filter(data => {
        list.push(data.className)
      });

      return list
    },
    filteredTableData() {
      return this.dataFilter.filter(data => {
        const nameMatches = !this.search || data.fullName.toLowerCase().includes(this.search.toLowerCase());
        const statusMatches = this.selected === null || data.isComplete === this.selected;

        return nameMatches && statusMatches;
      });
    },


    filteredTableData2() {
      return this.listClass.filter(data => {
        const classMatches = !this.search2 || data.className.toLowerCase().includes(this.search2.toLowerCase());
        const statusMatches = this.selected2 === null || data.listStudents[0].department === this.selected2;

        return classMatches && statusMatches;
      });
    },

  },

  methods: {
    generateSchoolYears() {
      const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
      const startYear = 2021; // Năm bắt đầu là 2021
      const endYear = currentYear; // Năm kết thúc là năm hiện tại cộng thêm một năm
      const years = [];

      // Lặp qua các năm từ startYear đến endYear
      for (let year = startYear; year <= endYear; year++) {
        // Tạo chuỗi năm học dạng "YYYY - YYYY"
        const schoolYear = `${year}-${year + 1}`;
        // Thêm vào danh sách
        years.push(schoolYear);
      }

      // Cập nhật danh sách schoolYears trong dữ liệu
      this.schoolYears = years;
      this.selectedSchoolYear = this.schoolYears[this.schoolYears.length - 1];
      this.setSemesterBasedOnCurrentDate();
    },
    setSemesterBasedOnCurrentDate() {
      const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (tháng trong JavaScript bắt đầu từ 0)
      if (currentMonth >= 1 && currentMonth <= 6) {
        return
      } else {
        this.selectedSemester = 2;
      }
    },
    fetchConditionData() {
      // Lấy phiếu điểm theo điều kiện để thống kê
      getCondition(this.selectedSemester, this.selectedSchoolYear).then((response) => {
        if (response && response.data && response.data.success) {
          this.listPhieu = response.data.result;
        } else {
          console.error("Không thành công: ", response.data);
        }
      })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách phiếu điểm: ", error);
        });
    },

    count(item) {
      if (item && Array.isArray(item.listStudents)) {
        const totalStudents = item.listStudents.length;
        const completeStudents = item.listStudents.filter(student => student.isComplete).length;

        if (completeStudents === totalStudents && totalStudents > 0) {
          return 1;
        }
      }
      return 0;
    },

    countComplete() {
      let totalCompleteClasses = 0;

      this.listClass.forEach(item => {
        totalCompleteClasses += this.count(item);
      });

      // Cập nhật giá trị đếm vào biến hoặc giao diện
      this.totalCompleteClasses = totalCompleteClasses;
      return totalCompleteClasses
    },

    calculateStudentSummary(item) {
      if (item && Array.isArray(item.listStudents)) {
        const totalStudents = item.listStudents.length;
        const completeStudents = item.listStudents.filter(student => student.isComplete).length;
        return `${completeStudents}/${totalStudents}`;
      } else {
        return '0/0';
      }
    },

    calculateIncompletePercentage(item) {
      if (item && Array.isArray(item.listStudents)) {
        const totalStudents = item.listStudents.length;
        const incompleteStudents = item.listStudents.filter(student => student.isComplete).length;
        const percentage = totalStudents === 0 ? 0 : (incompleteStudents / totalStudents) * 100;
        return Math.round(percentage);
      } else {
        return 0;
      }
    },

    findClassByName(className) {
      this.selected = this.search = null
      this.selectedItem = className;
      this.classTitle = className
      const result = this.listClass.find(item => item.className == className);
      // Trả về phần tử đã tìm được, nếu không tìm được trả về undefined
      this.dataFilter = result.listStudents;
    },


    resetData() {
      this.selected2 = null;
      this.search2 = ''
    },
    fetchStatisticData() {
      this.dataFilter = [];
      this.selectedItem = null;

      getConditionStatistic(this.selectedSemester, this.selectedSchoolYear).then((response) => {
        if (response && response.data && response.data.success) {
          this.listClass = response.data.statistic;
          this.countComplete()
        } else {
          console.error("Không thành công: ", response.data);
        }
      })
        .catch((error) => {
          console.error("Lỗi: ", error);
        });
    },
  },
  watch: {
    // Gọi khi chọn năm hoặc kì
    selectedSemester(newSemester, oldSemester) {
      this.fetchConditionData();
      this.fetchStatisticData();
    },
    selectedSchoolYear(newSchoolYear, oldSchoolYear) {
      this.fetchConditionData();
      this.fetchStatisticData();
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

a {
  text-decoration: none;
}

li {
  list-style: none;
  cursor: pointer
}

:root {
  --poppins: 'Poppins', sans-serif;
  --lato: 'Lato', sans-serif;

  --light: #F9F9F9;
  --blue: #3C91E6;
  --light-blue: #CFE8FF;
  --grey: #eee;
  --dark-grey: #AAAAAA;
  --dark: #342E37;
  --red: #DB504A;
  --yellow: #FFCE26;
  --light-yellow: #FFF2C6;
  --orange: #FD7238;
  --light-orange: #FFE0D3;
}

/* CONTENT */
#content {
  widows: 100%;
}

/* MAIN */
#content main {
  width: 100%;
  padding: 0 10px;
  font-family: var(--poppins);
}

#content main .box-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 24px;
}

#content main .box-info li {
  padding: 24px;
  background: var(--light);
  border-radius: 20px;
  display: flex;
  align-items: center;
  grid-gap: 24px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

}

#content main .box-info li .bx {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#content main .box-info li:nth-child(1) .bx {
  background: #FFF2C6;
  color: var(--yellow);
}

#content main .box-info li:nth-child(2) .bx {
  background: var(--light-blue);
  color: var(--blue);
}

#content main .box-info li:nth-child(3) .bx {
  background: #FFE0D3;
  color: var(--orange);
}

#content main .box-info li .text h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--dark);
}

#content main .box-info li .text p {
  color: var(--dark);
}





#content main .table-data {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 24px;
  margin-top: 24px;
  width: 100%;
  color: var(--dark);

}

#content main .table-data>div {
  border-radius: 20px;
  background: var(--light);
  padding: 24px;
  overflow-x: auto;
}

#content main .table-data .head {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
}

#content main .table-data .head h3 {
  margin-right: auto;
  font-size: 24px;
  font-weight: 600;
}

#content main .table-data .head .bx {
  cursor: pointer;
}

#content main .table-data .order {
  flex-grow: 1;
  flex-basis: 500px;

}

#content main .table-data .order table {
  width: 100%;
  border-collapse: collapse;
}

#content main .table-data .order table th {
  padding-bottom: 12px;
  font-size: 13px;
  text-align: left;
  border-bottom: 1px solid var(--grey);
}

#content main .table-data .order table td {
  padding: 16px 0;
}

#content main .table-data .order table tr td:first-child {
  display: flex;
  align-items: center;
  grid-gap: 12px;
}

#content main .table-data .order table td img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

#content main .table-data .order table tbody tr:hover {
  background: var(--grey);
}

#content main .table-data .todo {
  flex-grow: 1;
  flex-basis: 300px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

}

#content main .table-data .todo .todo-list {
  width: 100%;
}

#content main .table-data .todo .todo-list li {
  width: 100%;
  margin-bottom: 16px;
  background: var(--grey);
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

#content main .table-data .todo .todo-list li .bx {
  cursor: pointer;
}

#content main .table-data .todo .todo-list li.completed {
  border-left: 10px solid var(--blue);
}

#content main .table-data .todo .todo-list li.not-completed {
  border-left: 10px solid var(--orange);
}

#content main .table-data .todo .todo-list li:last-child {
  margin-bottom: 0;
}

::after .el-progress-bar__inner .el-progress-bar__inner .el-progress-bar__inner {
  background-color: #FFCE26 !important
}


.custom-input-tk .el-input__inner input {
  border: none !important;
  background-color: white;
  font-weight: bold;
  color: black;
}



.custom-input-sl .el-input__inner {
  border: none !important;
  background-color: white;
  font-weight: bold;
  font-size: 20px;
  width: 150px;

}

.custom-input-tk .el-input__inner {
  border: none !important;
  background-color: white;
  font-weight: bold;
  font-size: 18px;
  width: 150px;

}

.input-tk2 .el-input__inner {
  width: 120px;
}

.input-tk1 .el-input__inner {
  width: 120px;
}

.input-select {
  width: 130px;

}

.input-select3 {
  width: 160px;

}
.bg{
  background-color: #dfedfa
}
</style>
