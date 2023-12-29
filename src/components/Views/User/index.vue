<template>
  <div class="">
    <el-card>
      <div class="action-user">
        <!-- Lọc theo lớp -->
        <div class="d-flex justify-content-start">
          <div class="d-flex align-items-center p-2" style="color: rgb(1, 6, 12);">
            <i class="fa-solid fa-rotate-right" @click="resetFilters"></i>
            <div class="d-flex  align-items-center ml-5 border-right">
              <i style="color: rgb(3, 17, 17);" class="fa-solid fa-filter  mr-3"></i>
              <div class="filter-options pr-4">
                <span
                  v-for="(option, index) in filterOptions"
                  :key="index"
                  :class="{ 'selected': selectedFilter === option.value }"
                  @click="selectFilter(option.value)"
                >
                  {{ option.label }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex  align-items-center p-2">
            <el-input
              v-model="search"
              size="medium" 
              placeholder="Tìm theo tên và email ..."
              class="custom-input-user"
            >
            </el-input>
            <el-button icon="el-icon-search" class="ml-2"  style="background-color: rgb(57, 139, 247);color: white;" circle></el-button>
          </div>
        </div>

        <el-button @click="goToAddNewPage()" type="success" round size="medium">Tạo mới</el-button>
      </div>
      <el-table :data="currentPageData" style="width: 100%" class="custom-table">
        <el-table-column label="STT" width="120">
    <template slot-scope="{ $index, row }">
      <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
    </template>
  </el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
<el-table-column label="Tên">
   <template slot-scope="{ row }">
      {{  getName(row) }}
   </template>
</el-table-column>
<el-table-column prop="role" label="Quyền">
   <template slot-scope="{ row }">
      {{ getRole(row)}}
   </template>
</el-table-column>
        <el-table-column label="Thao tác" width="150">
          <template slot-scope="{ row }">
           
            <el-button type="primary" icon="el-icon-edit" @click.prevent="gotoDetail(row)" size="small" circle></el-button>
            <el-button type="danger" @click.prevent="confirmDelete(row)" icon="el-icon-delete" size="small" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          background
          layout="jumper, prev, pager, next, sizes, total"
          :page-sizes="[10, 25, 50, 100]"
          :page-size.sync="pagination.page_size"
          :total="filteredTableData.length"
          :current-page.sync="pagination.current_page"
          @current-change="handleCurrentPageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'user';
import { getCollection, handleDelete } from '@/api/user';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  data() {
    return {
      pagination: {
        current_page: 1,
        page_size: 25
      },
      filterOptions: [
       {
        label:'Tất cả',
        value:'All'
       },
       {
        label:'Admin',
        value:'Admin'
       },
       {
        label:'Sinh viên',
        value:'student'
       },
       {
        label:'Cố vấn',
        value:'consultant'
       },
       
      ],
      selectedFilter: 'All', 
      search:''
    };
  },
  created () {
    this.loadData();

  },
  computed: {
    filteredTableData() {
      return this.$store.getters.users.filter(data =>
        (!this.search || data.fullname.toLowerCase().includes(this.search.toLowerCase())) &&
        (this.selectedFilter === 'All' || 
        data.role === this.selectedFilter ||
          (this.selectedFilter === 'Admin' && !data.role) ||
          (this.selectedFilter === 'student' && !data.role) ||
          (this.selectedFilter === 'consultant' && !data.role))
      );
    },
    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;
      return this.filteredTableData.slice(start, end);
    },
  },
  methods: {
    /** some handle methods */

    /** default methods */
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {

      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    },
    confirmDelete(row) {
  if (!row._id) {
    // Xử lý trường hợp _id không được định nghĩa
    console.error("ID người dùng không được định nghĩa.");
    return;
  }

  this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Cảnh báo', {
    confirmButtonText: 'Xóa',
    type: 'warning'
  }).then(() => {
    handleDelete(row._id).then(({ data }) => {
      if (data.success) {
        this.loadData();
      }
    }).finally(() => {
      this.$wrLoading(false);
    });
  }).catch();
},

    loadData() {


      getCollection().then(({ data }) => {
        if (data.success) {
          this.setData({
            key: 'users',
            data: {
              docs: data.docs,
              total: data.total
            }
          });
        }
      });
    },

    handlePageSizeChange() {
      this.pagination.current_page = 1
      this.loadData()
    },
    handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
    },
    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
    },
    selectFilter(option) {
      
          this.selectedFilter = option;
    },
    resetFilters() {
      this.search='';
      this.selectFilter('All');
    },
    getName(row){
    if (row.role == 'Admin') return row.fullname;
    if (row.role == 'student') return row.fullname;
    if (row.role == 'consultant') return row.fullname;
  },
    getRole(row){
    if (row.role == 'Admin') return 'Admin'
    if (row.role == 'student') return 'Sinh viên'
    if (row.role == 'consultant') return 'Cố vấn'
  }
   
  }
}
</script>

<style scoped>
.action-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-input-user .el-input__inner {
  border: none;
  border-right: 1px solid #e4e7ed; /* Bạn có thể tùy chỉnh màu đường biên */
  border-radius: 0; /* Tùy chọn: Loại bỏ đường cong biên */
}
  .custom-input-user input {
    color: #333;  /* Màu chữ */
    border: none;
    border-right: 1px solid #e4e7ed; /* Bạn có thể tùy chỉnh màu đường biên */
  }


  .filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-options span {
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

.filter-options span.selected {
  background-color: #0c8eca;
  color: #fff;
}

/* Add these styles for button width and colors */
.answered-button,
.unanswered-button {
  width: 95px; /* Adjust the width as needed */
}

.answered-button {
  background-color: #67c23a; /* Green color for answered */
  color: #fff; /* White text for contrast */
}

.unanswered-button {
  background-color: #f56c6c; /* Red color for unanswered */
  color: #fff; /* White text for contrast */
}


.custom-input-user  {
  width: auto;
  font-weight: bold;
  border: none;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #74eba9;
  color: #fff;
  border-radius: 50%;
}
</style>