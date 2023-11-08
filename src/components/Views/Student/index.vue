<template>
  <div class="user">
    <el-card>
      <div class="search-bar ">
        
        

        <el-input
          v-model="search"
          size="medium" 
          placeholder="Type to search"
          class="custom-input"
        >
          <el-button slot="append" icon="el-icon-search" class="search-icon"></el-button>
        </el-input>
        <div class="">
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
          </div>
      </div>
      
      <el-table   :data="tableData.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase()))"  style="width: 100%" class="custom-table">
  
          <el-table-column type="index" label="STT" align="center"></el-table-column>
  
          <el-table-column prop="studentCode" label="MSV" width="80" align="center">
            <template slot-scope="{ row }">
              {{ row.studentCode }}
            </template>
          </el-table-column>
  
          <el-table-column prop="fullName" label="Tên sinh viên"  align="center">
            <template slot-scope="{ row }">
              {{ row.fullName }}
            </template>
          </el-table-column>

          <el-table-column prop="email" label="Email"  align="center">
            <template slot-scope="{ row }">
              {{ row.email }}
            </template>
          </el-table-column>

          <el-table-column prop="className" label="Lớp"  align="center">
            <template slot-scope="{ row }">
              {{ row.className }}
            </template>
          </el-table-column>

          <el-table-column prop="department" label="Khoa"  align="center">
            <template slot-scope="{ row }">
              {{ row.department }}
            </template>
          </el-table-column>

          <!-- <el-table-column prop="dateOfBirth" label="Ngày sinh" width="150" align="center">
            <template slot-scope="{ row }">
              {{ formatDate(row.dateOfBirth) }}
            </template>
          </el-table-column> -->

          <el-table-column label="Thao tác" width="150">
          <template slot-scope="{ row }">
            <el-button @click.prevent="gotoDetail(row)" type="success" size="mini">
              Xem
            </el-button>
            <el-button @click.prevent="confirmDelete(row)" type="danger" size="mini">
              Xóa
            </el-button>
          </template>
        </el-table-column>

  
         
  
        </el-table>
        <div class="mt-2">
          <el-pagination
            background
            layout="jumper, prev, pager, next, sizes, total"
            :page-sizes="[25, 50, 100]"
            :pager-count="5"
            :page-size.sync="pagination.page_size"
            :total="this.tableData.length"
            :current-page.sync="pagination.current_page"
            @current-change="loadData"
            @size-change="handlePageSizeChange"
          />
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  const ModelCode = 'student';
  import { getAll ,handleDelete} from '@/api/student';
  import { format } from 'date-fns';
  
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
      };
    },
    created() {
      this.loadData();
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
        handleDelete(row._id).then(({data}) => {
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
      handlePageSizeChange() {
        this.pagination.current_page = 1;
        this.loadData();
      },
      formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy ');
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:10px ;
  }
  
  .custom-input {
    width: 200px;  /* Điều chỉnh chiều rộng theo nhu cầu */
    font-weight: bold;  /* Đậm hơn */
    background-color: #eaeaea;  /* Màu sắc nền */
  }
  
  .custom-input input {
    color: #333;  /* Màu chữ */
  }
  
  .search-icon {
    color: #1890ff;  /* Màu sắc của icon tìm kiếm */
  }

  .custom-table th {
  background-color: #f1f1cc !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #f8d0cf !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #cdf3aa;
    color: #fff;
    border-radius: 50%;
}
  </style>