<template>
  <div class="user">
    <el-card>
      <h4 class="font-weight-bold text-success text-center mb-5">DANH SÁCH SINH VIÊN</h4>
      <div class="action-student mb-4">
        <i class="fa-solid fa-rotate-right" @click="resetData"></i>
        <i class="fa-solid fa-download"></i>
        <i style="color: rgb(3, 49, 49);" class="fa-solid fa-filter"></i>

        <!-- Khoa Dropdown -->
        <el-select v-model="selectedKhoa" placeholder="Khoa" filterable class="input-student">
          <el-option v-for="item in khoaList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <!-- Ngành Dropdown -->
        <el-select v-model="selectedNganh" placeholder="Ngành" filterable class="input-student">
          <el-option v-for="item in nganhList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <!-- Lớp Dropdown -->
        <el-select v-model="selectedLop" filterable placeholder="Lớp" class="input-student">
          <el-option v-for="className in lopList" :key="className" :label="className" :value="className"></el-option>
        </el-select>

        <el-input v-model="search" size="medium" placeholder="Tìm theo tên, email..." class="search-input">
        </el-input>
        <i class="fa-solid fa-magnifying-glass"></i>
        <div class="">
          <el-button @click="goToAddNewPage()" type="success" round size="medium">Tạo mới</el-button>
        </div>
      </div>

      <el-table :data="currentPageData" style="width: 100%" class="custom-table">
        <el-table-column label="STT" width="50">
          <template slot-scope="{ $index, row }">
            <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentCode" label="MSV" width="100" align="center">
          <template slot-scope="{ row }">
            {{ row.studentCode }}
          </template>
        </el-table-column>
        <el-table-column prop="fullName" label="Tên sinh viên" align="center">
          <template slot-scope="{ row }">
            {{ row.fullName }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" align="center">
          <template slot-scope="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>
        <el-table-column prop="className" label="Lớp" align="center">
          <template slot-scope="{ row }">
            {{ row.className }}
          </template>
        </el-table-column>
        <el-table-column prop="department" label="Khoa" align="center">
          <template slot-scope="{ row }">
            {{ row.department }}
          </template>
        </el-table-column>
        <el-table-column prop="majors" label="Nghành" align="center">
          <template slot-scope="{ row }">
            {{ row.majors }}
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150">
          <template slot-scope="{ row }">
            <el-button type="primary" icon="el-icon-edit" @click.prevent="gotoDetail(row)" size="small"
              circle></el-button>
            <el-button type="danger" @click.prevent="confirmDelete(row)" icon="el-icon-delete" size="small"
              circle></el-button>
          </template>
        </el-table-column>
      </el-table>
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
const ModelCode = 'student';
import { getAll, handleDelete } from '@/api/student';

import { format } from 'date-fns';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25,
      },
      totalData: 0,
      search: '',
      selectedKhoa: '',
      selectedNganh: '',
      selectedLop: '',
      khoaList: [],
      nganhList: [],
      lopList: [],
    };
  },
  created() {
    this.loadData();
    this.loadInfoToFilter();

  },

  methods: {
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning'
      }).then(() => {
        handleDelete(row._id).then(({ data }) => {
          if (data.success) {
            this.loadData()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    },
    loadData() {
      getAll()
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.students;
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải điểm rèn luyện: ", error);
        });

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

    resetData() {
      this.selectedKhoa = '';
      this.selectedNganh = '';
      this.selectedLop = '';
      this.search = ''
    },
    loadInfoToFilter() {
      this.khoaList = this.$store.getters.khoaList
      this.nghanhList = this.$store.getters.nghanhList
      this.lopList = this.$store.getters.lopList
    }
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search || data.fullName.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.selectedKhoa || data.department === this.selectedKhoa) &&
        (!this.selectedNganh || data.nganh === this.selectedNganh) &&
        (!this.selectedLop || data.className === this.selectedLop)
      );
    },

    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;

      return this.filteredTableData.slice(start, end);


    },
  },
};
</script >

<style >
.action-student {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.input-student {
  width: auto;
  font-weight: bold;
  border: none;
  border-right: 1px solid #6d7583;
  color: black;
  /* Màu đường biên bên phải */
}

.input-student .el-input__inner {
  border: none !important;
  background-color: white;
  font-weight: bold;
  
}



.search-icon {
  color: #1890ff;
}

.search-input {
  width: auto;
  border: none;
  font-weight: bold;

}

.search-input .el-input__inner {
  border: none;
  background-color: white;
  font-weight: bold;

}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #cdf3aa;
  color: #fff;
  border-radius: 50%;
}
</style>
