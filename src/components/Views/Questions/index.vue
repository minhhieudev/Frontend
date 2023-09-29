<template>
  <div class="user">
    <el-card>
      <div class="d-flex justify-content-between my-2">
        <div></div>
        <div>
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
        </div>
      </div>
      <el-table
        :data="$store.getters.questions"
        style="width: 100%">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="content" label="Nội dung">
          <template slot-scope="{row}">
            {{ row.content }} 
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày, tháng đăng">
  <template slot-scope="{ row }">
    {{ formatDate(row.createdAt) }} <!-- Gọi hàm formatDate để định dạng ngày tháng -->
  </template>
</el-table-column>
<el-table-column prop="user.fullname" label="Người đăng">
  <template slot-scope="{ row }">
    {{ row.user.fullname }}
  </template>
</el-table-column>


        
        <el-table-column  label="Thao tác" width="150">>
        <!-- :fixed="$isMobile?false:'right'" -->
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
          :page-size.sync="pagination.page_size" :total="$store.getters.total_questions" :current-page.sync="pagination.current_page"
          @current-change="loadData" @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'question';
import { getCollection, handleDelete } from '@/api/question';
import { format } from 'date-fns';
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
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
      getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.success) {
          this.setData({
            key: 'questions',
            data: {
              docs: data.docs,
              total: data.total
            }
          })
        }
        console.log(data);
      })
    },
    handlePageSizeChange() {
      this.pagination.current_page = 1
      this.loadData()
    },
     formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },
  }
}
</script>

<style scoped>
/* Thêm lớp first-row cho dòng đầu tiên */

/* Tùy chỉnh màu nền cho các hàng xen kẽ */
.user.el-table .el-table__body-wrapper .el-table__body tbody tr.el-table__row:nth-child(even) {
   background-color: rgb(199, 16, 77) !important; /* Thêm !important để ghi đè */
}

/* Thay đổi màu nền cho tiêu đề của bảng */
.user.el-table .el-table__header-wrapper th {
  background-color: rgb(53, 25, 207) !important; /* Thêm !important để ghi đè */
  color: rgb(8, 1, 1) !important; /* Thêm !important để ghi đè */
}
</style>
