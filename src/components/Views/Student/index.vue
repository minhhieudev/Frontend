<template>
  <div class="user">
    <el-card>
      <div class="search-bar">
        <el-input
          v-model="search"
          size="medium" 
          placeholder="Type to search"
          class="custom-input"
        >
          <el-button slot="append" icon="el-icon-search" class="search-icon"></el-button>
        </el-input>
      </div>
      <el-table   :data="tableData.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase()))"  style="width: 100%">
  
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

          <el-table-column prop="dateOfBirth" label="Ngày sinh" width="150" align="center">
            <template slot-scope="{ row }">
              {{ formatDate(row.dateOfBirth) }}
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
            :total="$store.getters.total_questions"
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
  import { getAll } from '@/api/student';
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
      gotoDetail(row) {
        this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } });
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
    justify-content: flex-end;
    margin-bottom: 10px;
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
  </style>