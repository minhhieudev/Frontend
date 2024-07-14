<template>
  <div class="customs ml-3">
    <el-card>
      <h4 class="font-weight-bold text-success text-center mb-3">DANH SÁCH PHIẾU ĐIỂM</h4>
      <div class="action-trainingPoint mb-3">
        <i class="fa-solid fa-rotate-right" @click="resetData"></i>
        <div class="filter-options-duyet ">
          <span v-for="(option, index) in filterOptions" :key="index" :class="{ 'selected': selectedFilter === option }"
            @click="selectFilter(option)">
            {{ option }}
          </span>
        </div>

        <el-select v-model="selectedNam" placeholder="Năm học" filterable class="w-5">
          <el-option v-for="item in namList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <el-select v-model="selectedSemester" placeholder="Kỳ" filterable>
          <el-option label="Kỳ 1" :value="1"></el-option>
          <el-option label="Kỳ 2" :value="2"></el-option>
        </el-select>


        <el-select v-model="selectedKhoa" placeholder="Khoa" filterable>
          <el-option v-for="item in khoaList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <!-- <el-select v-model="selectedNganh" placeholder="Ngành" filterable>
          <el-option v-for="item in nganhList" :key="item" :label="item" :value="item"></el-option>
        </el-select> -->

        <el-select v-model="selectedLop" filterable placeholder="Lớp">
          <el-option v-for="className in lopList" :key="className" :label="className" :value="className"></el-option>
        </el-select>

        <i @click="loadDetailTrainingPoint()" class="fa-solid fa-filter"></i>

        <el-input v-model="search" size="medium" placeholder="Tìm theo tên, email..."
          class="search-input-trainingPoint">
        </el-input>
        <el-button icon="el-icon-search" class="ml-2" type="success" circle></el-button>


      </div>
      <div style="max-height: 69vh; overflow-y: auto;">

        <el-table :data="currentPageData" align="center" class="custom-table">
          <el-table-column label="STT" width="50">
            <template slot-scope="{ $index, row }">
              <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="studentCode" label="MSV" width="100" align="center">
            <template slot-scope="{ row }">
              {{ row.studentDetails.studentCode }}
            </template>
          </el-table-column>

          <el-table-column label="Xem phiếu điểm " width="120" align="center">
            <template slot-scope="{ row }">
              <el-button @click.prevent="gotoDetail(row)" type="warning" plain size="mini" round>
                Phiếu điểm
              </el-button>
            </template>
          </el-table-column>

          <!-- Trạng thái Column -->
          <el-table-column label="Trạng thái" align="center" width="130">
            <template slot-scope="{ row }">
              <el-button v-if="row.status" type="success" size="mini" round class="answered-button">
                Đã duyệt
              </el-button>
              <el-button v-else type="danger" size="mini" round class="unanswered-button">
                Chưa duyệt
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="fullName" label="Tên sinh viên" width="180" align="center">
            <template slot-scope="{ row }">
              {{ row.studentDetails.fullName }}
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="Ngày chấm" align="center">
            <template slot-scope="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>

          <el-table-column label="Điểm rèn luyện" align="center">
            <el-table-column prop="Total_selfAssessment" label="SV tự chấm" align="center">
              <template slot-scope="{ row }">
                {{ row.Total_selfAssessment }}
              </template>
            </el-table-column>
            <el-table-column prop="Total_groupAssessment" label="Lớp chấm" align="center">
              <template slot-scope="{ row }">
                {{ row.Total_groupAssessment }}
              </template>
            </el-table-column>
            <el-table-column prop="Total_consultantAssessment" label="Cố vấn" align="center">
              <template slot-scope="{ row }">
                {{ row.Total_consultantAssessment }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Thao tác" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click.prevent="confirmDelete(scope.row)" icon="el-icon-delete" size="small"
                circle></el-button>

            </template>
          </el-table-column>

        </el-table>
      </div>

      <div class="mt-2">
        <el-pagination background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[10, 25, 50, 100]"
          :page-size.sync="pagination.page_size" :total="filteredTableData.length"
          :current-page.sync="pagination.current_page" @current-change="handleCurrentPageChange"
          @size-change="handlePageSizeChange" />
      </div>

    </el-card>
  </div>
</template>

<script>
import { getAll, handleDelete } from '@/api/detailTrainingPoint';
import { format } from 'date-fns';
import '@fortawesome/fontawesome-free/css/all.css';


export default {
  data() {
    return {
      tableData: [],
      namList: [],
      pagination: {
        current_page: 1,
        page_size: 10
      },
      totalData: 0,
      search: '',
      selectedKhoa: '',
      selectedNganh: '',
      selectedLop: '',
      khoaList: [],
      nganhList: [],
      lopList: [],
      filterOptions: ['Tất cả', 'Chưa duyệt', 'Đã duyệt'],
      selectedFilter: 'Tất cả', // default filter option
      selectedSemester: '',
      selectedNam: ''
    };
  },
  created() {

    this.loadInfoToFilter()

  },
  computed: {

    filteredTableData() {
      return this.tableData.filter(data =>
        // Lọc theo tên hoặc email (tìm kiếm)
        (!this.search || data.studentDetails.fullName.toLowerCase().includes(this.search.toLowerCase())) &&

        // Lọc theo khoa đã chọn
        (!this.selectedKhoa || data.studentDetails.department === this.selectedKhoa) &&

        // Lọc theo ngành đã chọn
        (!this.selectedNganh || data.studentDetails.nganh === this.selectedNganh) &&

        // Lọc theo lớp đã chọn
        (!this.selectedLop || data.studentDetails.className === this.selectedLop) &&

        // Lọc theo năm đã chọn
        (!this.selectedNam || data.schoolYear == this.selectedNam) &&

        // Lọc theo kỳ đã chọn
        (!this.selectedSemester || data.semester == this.selectedSemester) &&

        // Lọc theo trạng thái đã chọn (Tất cả, Chưa duyệt, Đã duyệt)
        (
          (this.selectedFilter === 'Tất cả') ||
          (this.selectedFilter === 'Chưa duyệt' && !data.status) ||
          (this.selectedFilter === 'Đã duyệt' && data.status)
        )
      );
    },

    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;

      return this.filteredTableData.slice(start, end);
    },
    uniqueSchoolYears() {
      const uniqueYears = [...new Set(this.tableData.map(item => item.schoolYear))];
      return uniqueYears;
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
      this.namList = years;
      this.selectedNam = this.namList[this.namList.length - 2];
    },
    gotoDetail(row) {
      this.$router.push({ name: 'detailTrainingPoint_edit', params: { id: row._id } });
    },
    loadDetailTrainingPoint() {
      getAll(this.selectedNam, this.selectedSemester, this.selectedKhoa, this.selectedLop)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.detailTrainingPoints;
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải điểm rèn luyện: ", error);
        });
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa phiếu điểm`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning',
      })
        .then(() => {
          handleDelete(row._id)
            .then(({ data }) => {
              console.log(data);
              if (data.success) {
                this.loadDetailTrainingPoint();
              }
            })
            .finally(() => {
              this.$wrLoading(false);
            });
        })
        .catch();
    },
    handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
    },

    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },

    selectFilter(option) {
      this.selectedFilter = option;
    },
    loadInfoToFilter() {
      this.khoaList = this.$store.getters.khoaList
      this.nghanhList = this.$store.getters.nghanhList
      this.lopList = this.$store.getters.lopList
      this.generateSchoolYears()
    },
    resetData() {
      this.selectedKhoa = '';
      this.selectedNganh = '';
      this.selectedLop = '';
      this.search = '';
      this.selectedSemester = '';
      this.selectedNam = '';
    }
  },
  watch: {

  },
}
</script>
<style scoped>
.action-trainingPoint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #f8be97;
  color: #fff;
  border-radius: 50%;
}

.custom-input-trainingPoint {
  width: 100px;
  font-weight: bold;
  background-color: #eaeaea;
  border: none;
}

.custom-input-trainingPoint .el-input__inner {
  border: none;
  border-right: 1px solid #e4e7ed;
  border-radius: 0;
}

.search-input-trainingPoint {
  width: auto;
  border: none;
  width: 140px;

}

.custom-input-trainingPoint input {
  color: #333;
  border: none;
  border-bottom: 1px solid #e4e7ed;
  width: 20%
}

.custom-input-trainingPoint input {
  color: #333;
  /* Màu chữ */
}


/* Add these styles for button width and colors */
.answered-button,
.unanswered-button {
  width: 95px;
  /* Adjust the width as needed */
}

.answered-button {
  background-color: #67c23a;
  /* Green color for answered */
  color: #fff;
  /* White text for contrast */
}

.unanswered-button {
  background-color: #f56c6c;
  /* Red color for unanswered */
  color: #fff;
  /* White text for contrast */
}

.filter-options-duyet span.selected {
  background-color: #0c8eca;
  color: #fff;
}

.filter-options-duyet {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-options-duyet span {
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  font-weight: bold;
  width: 100px;
  min-width: auto;
  margin-left: 4px;
  border-radius: 35px;
  text-align: center;
}


.el-select {
  width: 10%;
}

.customs .el-card.is-always-shadow {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.customs .el-card {
  border-radius: 25px;
  background-color: white;
}
</style>
