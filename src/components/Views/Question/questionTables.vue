<template>
  <div class="Questions">
    <el-card>
      <div class="search-bar">
        <!-- Lọc theo lớp -->
        <el-input
          v-model="search"
          size="medium"
          placeholder="Nhập để tìm kiếm"
          class="custom-input search-input"
          @input="applyFilters"
        >
          <el-button slot="prepend" icon="el-icon-search" class="search-icon"></el-button>
        </el-input>
      </div>

      <el-table :data="filteredTableData" style="width: 100%" class="custom-table">
        <el-table-column type="index" label="STT"></el-table-column>

        <el-table-column prop="title" label="Tiêu đề">
          <template slot-scope="{ row }">
            {{ row.title }}
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái"  align="center">
          <template slot-scope="{ row }">
            <el-button @click.prevent="gotoDetail(row)" type="success" size="mini">
              Chưa trả lời
            </el-button>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="Ngày, tháng đăng">
          <template slot-scope="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="user.fullname" label="Người đăng">
          <template slot-scope="{ row }">
            {{ row.user.fullname }}
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150">
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
          background
          layout="jumper, prev, pager, next, sizes, total"
          :page-sizes="[10, 25, 50, 100]"
          :page-size.sync="pagination.page_size"
          :total="totalData"
          :current-page.sync="pagination.current_page"
          @current-change="loadData"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAll, handleDelete } from '@/api/question';
import { format } from 'date-fns';

const ModelCode = "Question";
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25,
      },
      totalData: 0,
      filteredTableData: [],
      search: '',
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` });
    },
    gotoDetail(row) {
      this.$router.push({ name: `question_detail`, params: { id: row._id } });
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning',
      })
        .then(() => {
          handleDelete(row._id)
            .then(({ data }) => {
              console.log(data);
              if (data.success) {
                this.loadData();
              }
            })
            .finally(() => {
              this.$wrLoading(false);
            });
        })
        .catch();
    },
    loadData() {
      const params = {
        page: this.pagination.current_page,
        size: this.pagination.page_size,
      };

      getAll(params)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.questions;
            this.totalData = response.data.total;
            this.applyFilters();
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải câu hỏi: ", error);
        });
    },

    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },
    applyFilters() {
  const filteredData = this.tableData.filter(data =>
    (!this.search || data.content.toLowerCase().includes(this.search.toLowerCase()))
  );

  const startIndex = (this.pagination.current_page - 1) * this.pagination.page_size;
  const endIndex = startIndex + this.pagination.page_size;

  // Lấy một phần của dữ liệu đã lọc dựa trên các chỉ mục được tính toán
  this.filteredTableData = filteredData.slice(startIndex, endIndex);
  this.totalData = filteredData.length;
},

    handlePageSizeChange(size) {
      this.pagination.page_size = size;
      this.loadData();
    },
  },
};
</script>

<style >
/* .custom-table th {
  background-color: #bff5d4 !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #f8d0cf !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
} */

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #f08294;
  color: #fff;
  border-radius: 50%;
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.filter-input {
  order: -1;
}

.custom-input {
  width: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
}
</style>
