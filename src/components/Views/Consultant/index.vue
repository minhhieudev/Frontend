<template>
  <div class="Consultant">
    <el-card>
      <h4 class="font-weight-bold text-success text-center mb-5">DANH SÁCH CỐ VẤN</h4>
      <div class="action-cv justify-content-between mb-4">
        <div class="d-flex justify-content-start">
          <div class="d-flex align-items-center p-2" style="color: rgb(1, 6, 12);">
            <i class="fa-solid fa-rotate-right" @click="resetFilters"></i>
            <div class="d-flex  align-items-center ml-5 border-right">
              <i style="color: rgb(20, 197, 197);" class="fa-solid fa-filter  mr-3"></i>

              <el-select v-model="selectedKhoa" placeholder="Khoa" filterable class="custom-input-cv">
                <el-option v-for="item in khoaLists" :key="item" :label="item" :value="item"></el-option>
              </el-select>

            </div>
          </div>

          <div class="d-flex  align-items-center p-2">
            <el-input v-model="search" size="medium" placeholder="Tìm theo tên, email..." class="search-input">
            </el-input>
            <el-button icon="el-icon-search" class="ml-2" type="success" circle></el-button>
          </div>

        </div>
        <el-button @click="goToAddNewPage()" type="success" round size="medium">Tạo mới</el-button>
      </div>

      <el-table :data="currentPageData" style="width: 100%" class="custom-table">

        <el-table-column label="STT" width="50">
          <template slot-scope="{ $index, row }">
            <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="fullName" label="Tên cố vấn" align="center">
          <template slot-scope="{ row }">
            {{ row.fullName }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email" align="center">
          <template slot-scope="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>

        <el-table-column prop="position" label="Chức vụ/chức danh, đơn vị" align="center">
          <template slot-scope="{ row }">
            {{ row.position }}
          </template>
        </el-table-column>

        <el-table-column prop="mission" label="Nhiệm vụ" align="center" >
          <template slot-scope="{ row }">
            {{ row.mission }}
          </template>
        </el-table-column>
        <!-- 
        <el-table-column prop="dateOfBirth" label="Ngày sinh" width="150" align="center">
          <template slot-scope="{ row }">
            {{ formatDate(row.dateOfBirth) }}
          </template>
        </el-table-column>
 -->


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
const ModelCode = 'consultant';
import { getAll, handleDelete } from '@/api/consultant';
import { getKhoaList } from '@/api/student';
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
      khoaLists: []
    };
  },
  created() {
    this.loadData();
    this.fetchClassLists()
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search ||
          data.fullName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.email.toLowerCase().includes(this.search.toLowerCase())
        ) &&
        (!this.selectedKhoa || data.department === this.selectedKhoa)
      );
    },

    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;

      return this.filteredTableData.slice(start, end);


    },
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
            this.tableData = response.data.consultants;
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải điểm rèn luyện: ", error);
        });
    },
    handlePageSizeChange() {
      this.pagination.current_page = 1;
      this.loadData();
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },

    resetFilters() {
      this.selectedKhoa = '';
      this.search = '';
    },
    fetchClassLists() {

      getKhoaList()
        .then(response => {
          this.khoaLists = response.data.khoaLists;
        })
        .catch(error => {
          console.error('Error fetching Khoa list:', error);
        });
    },
    handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
    },

    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
    },

  },
};
</script>

<style >
/* .custom-table th {
  background-color: #7ab7e0 !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #ecf0f1 !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
} */

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #db8ceb;
  color: #fff;
  border-radius: 50%;
}

.action-cv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.filter-input {
  order: -1;
}



.custom-input-cv .el-input__inner {
  border: none;
  background-color: white;
  font-weight: bold;
  color: black;
}

.custom-input-cv input {
  color: #333;
  border: none;
  font-weight: bold;
}


.search-input {
  width: auto;
  border: none;
}

.search-input .el-input__inner {
  border: none;
  background-color: white;
}

.custom-input-cv:focus {
  border-color: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
}
</style>
