<template>
  <div class="">
    <el-card>
      <div class="d-flex justify-content-between my-2">
        <div></div>
        <div>
          <el-select v-model="value" placeholder="Quyền" @input="applyFilters">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      >
      
    </el-option>
  </el-select>
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
        </div>
        
      </div>
      <el-table :data="filteredData" style="width: 100%" i:indent="0" class="custom-table">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
<el-table-column label="Tên">
   <template slot-scope="{ row }">
      {{  getName(row) }}
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
        consultant: 'Cố vấn',
        student: 'Sinh viên',
      },
      options: [{
          value: 'All',
          label: 'Tất cả'
        }, {
          value: 'student',
          label: 'Sinh viên'
        }, {
          value: 'consultant',
          label: 'Cố vấn'
        }, {
          value: 'admin',
          label: 'Admin'
        }],
        value: 'All',
        filteredData: [],  
    };
  },
  created () {
    this.loadData();
    this.applyFilters();

  },
  methods: {
    /** some handle methods */

    /** default methods */
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {
      console.log(row.data  + '24124')

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

    applyFilters() {
      // Lấy giá trị quyền được chọn từ el-select
      const selectedRole = this.value;

      this.filteredData = this.$store.getters.users.filter(data => {
        return selectedRole === 'All' || data.role === selectedRole.toLowerCase();
      });
    },
    getName(row){
      if (row.role == 'admin') return row.fullname;
      if (row.role == 'student') return row.studentInfo.fullName;
      if (row.role == 'consultant') return row.fullname;
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