<template>
  <div class="">
    <el-card>
      <div class="d-flex justify-content-between my-2">
        <div></div>
        <div>
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
        </div>
      </div>
      <el-table :data="$store.getters.users" style="width: 100%" i:indent="0" class="custom-table">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
<el-table-column label="Tên">
   <template slot-scope="{ row }">
      {{ row.studentInfo ? row.studentInfo.fullName : '' }}
   </template>
</el-table-column>
<el-table-column prop="role" label="Quyền">
   <template slot-scope="{ row }">
      {{ roleMap[row.role] }}
   </template>
</el-table-column>
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
          :page-sizes="[5, 50, 100]"
          :pager-count="5"
          :page-size.sync="pagination.page_size"
          :total="$store.getters.total_users"
          :current-page.sync="pagination.current_page"
          @current-change="loadData"
          @size-change="handlePageSizeChange"
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

<style >
.custom-table th {
  background-color: #c9f1d9 !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #e0f8e4 !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
}
</style>