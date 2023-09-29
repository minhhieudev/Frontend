<template>
  <div class="">
    <el-card>
      <div class="d-flex justify-content-between my-2">
        <div>
    <!-- Thanh lọc theo vai trò -->
    <el-select v-model="selectedRole" placeholder="Chọn vai trò" @change="loadData">
      <el-option label="Tất cả" value="all"></el-option>
      <el-option label="Sinh viên" value="student"></el-option>
      <el-option label="Cố vấn" value="consultant"></el-option>
      <el-option label="Admin" value="admin"></el-option>
    </el-select>
  </div>
        <div>
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
        </div>
      </div>
      <el-table 
        :data="$store.getters.users"
        style="width: 100%" indent>
         <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="fullname" label="Tên"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="phone" label="SĐT"></el-table-column>
        <el-table-column prop="role" label="Quyền">
          <template slot-scope="{row}">
            {{ roleMap[row.role] }}
          </template>
        </el-table-column>
        <el-table-column 
        
        label="Thao tác" width="150">
        <!-- :fixed="$isMobile?false:'right'"  -->
          <template slot-scope="scope">
            <el-button @click.prevent="gotoDetail(scope.row)" type="success" size="mini">
              Xem
            </el-button>
            <el-button @click.prevent="confirmDelete(scope.row)" type="danger" size="mini">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[25, 50, 100]" :pager-count="5"
          :page-size.sync="pagination.page_size" :total="$store.getters.total_users" :current-page.sync="pagination.current_page"
          @current-change="loadData" @size-change="handlePageSizeChange"
        />
      </div>
      
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'user';
import { getCollection, handleDelete } from '@/api/user';
export default {
  data() {
    return {
      pagination: {
        current_page: 1,
        page_size: 25
      },
      roleMap: {
        admin: 'Quản trị',
        consultant: 'Quản trị nhóm',
        student: 'Sinh viên',
      },
      selectedRole: 'all' // Mặc định hiển thị tất cả
    };
  },
  created () {
    this.loadData()
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
      this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning'
      }).then(() => {
        handleDelete(row._id).then(({data}) => {
          console.log(data);
          if (data.success) {
            this.loadData()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    },
    loadData() {
      const params = {
        pagination: this.pagination,
        role: this.selectedRole === 'all' ? undefined : this.selectedRole // Truyền vai trò chỉ khi đã chọn
      };

      getCollection(params).then(({ data }) => {
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
    }
  }
}
</script>

<style>
/* Thêm lớp first-row cho dòng đầu tiên */


/* Tùy chỉnh màu nền cho các hàng xen kẽ */
.el-table .el-table__body-wrapper .el-table__body tbody tr.el-table__row:nth-child(even) {
   background-color: rgb(229, 241, 232); /* Thay #your-desired-color bằng mã màu bạn muốn */
 /* Thay #your-even-row-color bằng mã màu bạn muốn */
}

/* Thay đổi màu nền cho tiêu đề của bảng */
.el-table .el-table__header-wrapper th {
  background-color: rgb(199, 233, 247); /* Thay #your-desired-color bằng mã màu bạn muốn */
  color: rgb(8, 1, 1); /* Thay #your-text-color bằng mã màu bạn muốn cho văn bản trong tiêu đề */
}

</style>