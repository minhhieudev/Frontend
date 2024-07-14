<template>
  <div class="Questions ml-3">
    <el-card>
      <div class="search-bar">
        <!-- Lọc theo lớp -->
        <div class="d-flex justify-content-start">
          <div class="d-flex align-items-center p-2" style="color: rgb(1, 6, 12);">
            <i class="fa-solid fa-rotate-right" @click="resetFilters"></i>
            <div class="d-flex  align-items-center ml-5 border-right">
              <i style="color: rgb(20, 197, 197);" class="fa-solid fa-filter  mr-3"></i>
              <div class="filter-options pr-4">
                <span v-for="(option, index) in filterOptions" :key="index"
                  :class="{ 'selected': selectedFilter === option }" @click="selectFilter(option)">
                  {{ option }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex  align-items-center p-2">
            <el-input v-model="search" size="medium" placeholder="Tìm theo tên câu hỏi..."
              class="custom-input-question">
            </el-input>
            <el-button icon="el-icon-search" class="ml-2" type="success" circle></el-button>
          </div>
        </div>

        <el-button @click="goToAddNewPage()" type="success" round size="medium">Tạo mới</el-button>
      </div>

      <div style="max-height: 71vh; overflow-y: auto;">
        <el-table :data="currentPageData" style="width: 100%" class="custom-table">
          <!-- STT Column -->
          <el-table-column label="STT" width="60">
            <template slot-scope="{ $index, row }">
              <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
            </template>
          </el-table-column>

          <!-- Tên câu hỏi / Bài đăng Column -->
          <el-table-column prop="row.title" label="Tiêu đề câu hỏi">
            <template slot-scope="{ row }">
              <span style="font-weight: bold; color: #09af09;">{{ row.title }}</span>
            </template>
          </el-table-column>

          <!-- Trạng thái Column -->
          <el-table-column label="Trạng thái" align="center">
            <template slot-scope="{ row }">
              <el-button v-if="row.status" type="success" size="mini" round class="answered-button">
                Đã trả lời
              </el-button>
              <el-button v-else type="danger" size="mini" round class="unanswered-button">
                Chưa trả lời
              </el-button>
            </template>
          </el-table-column>

          <!-- Ngày, tháng đăng Column -->
          <el-table-column prop="createdAt" label="Ngày, tháng đăng">
            <template slot-scope="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>

          <!-- Người đăng Column -->
          <el-table-column prop="user.fullname" label="Người đăng">
            <template slot-scope="{ row }">
              <div class="d-flex align-items-center">
                <el-avatar :src="row.user.avatarUrl"></el-avatar>
                <p class="p-1 mt-1">{{ row.user.fullname }}</p>
              </div>
            </template>
          </el-table-column>

          <!-- Thao tác Column -->
          <el-table-column label="Thao tác" width="150">
            <template slot-scope="scope">
              <router-link :to="{ name: 'Question', params: { id: scope.row._id } }"
                @click="scrollToQuestion(scope.row._id)">
                <el-button type="primary" icon="el-icon-view" size="small" circle></el-button>
              </router-link>
              <el-button v-if="!isStudentRole" class="ml-3" type="danger" @click.prevent="confirmDelete(scope.row)"
                icon="el-icon-delete" size="small" circle></el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="mt-2">
        <el-pagination background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[10, 25, 50, 100]"
          :page-size.sync="pagination.page_size" :total="totalItems" :current-page.sync="pagination.current_page"
          @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange" />
      </div>
    </el-card>
  </div>
</template>


<script>
import { getPaginatedQuestions, handleDelete } from '@/api/question';
import { format } from 'date-fns';
import { handleDeleteAnswer } from '@/api/answer'

import '@fortawesome/fontawesome-free/css/all.css';

const ModelCode = "Question";

export default {
  data() {
    return {
      tableData: [],
      totalItems: 0,
      totalPages: 0,
      pagination: {
        current_page: 1,
        page_size: 10,
      },
      search: '',
      filterOptions: ['Tất cả', 'Chưa trả lời', 'Đã trả lời'],
      selectedFilter: 'Tất cả', // default filter option
      selectedQuestionId: null,
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search || data.title.toLowerCase().includes(this.search.toLowerCase())) &&
        (this.selectedFilter === 'Tất cả' || data.status === this.selectedFilter ||
          (this.selectedFilter === 'Chưa trả lời' && !data.status) ||
          (this.selectedFilter === 'Đã trả lời' && data.status))
      );
    },
    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;
      return this.filteredTableData.slice(start, end);
    },
    isStudentRole() {
      return this.$store.getters.user.role === 'student';
    },

  },
  methods: {

    goToAddNewPage() {
      this.$router.push({ name: 'question_main' });
    },
    goToDetail(row) {
      this.$router.push({ name: 'Question', params: { id: row._id } });
    },
    handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
      this.loadData();
    },
    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
      this.loadData();
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa câu hỏi ?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning',
      })
        .then(() => {
          handleDelete(row._id)
            .then(({ data }) => {
              console.log(data);
              if (data.success) {
                handleDeleteAnswer(row._id)
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
      getPaginatedQuestions(this.pagination.current_page, this.pagination.page_size)
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.data.questions;
            this.totalItems = response.data.data.pagination.total;
            this.totalPages = response.data.data.pagination.totalPages;
          } else {
            console.error("Không thành công: ", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải bài đăng: ", error);
        });
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },

    selectFilter(option) {
      this.selectedFilter = option;
    },
    resetFilters() {
      this.search = '';
    },
  },
};
</script>



<style>
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #f08294;
  color: #fff;
  border-radius: 50%;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-input {
  order: -1;
}


.custom-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
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
  width: 95px;
  /* Adjust the width as needed */
}

.answered-button {
  background-color: #67c23a;
  /* Green color for answered */
  color: #fff;
  /* White text for contrast */
}

.unanswered-button {
  background-color: #f56c6c;
  /* Red color for unanswered */
  color: #fff;
  /* White text for contrast */
}


.custom-input-question {
  width: 60%;
  font-weight: bold;
  border: none;

}


.custom-input-question .el-input__inner {
  border: none;
  background-color: white;
  font-weight: bold;
}

.custom-input-question input {
  color: #333;
  border: none;
  font-weight: bold;
  border-right: 1px solid #e4e7ed;
  /* Bạn có thể tùy chỉnh màu đường biên */

}

.Questions .el-card.is-always-shadow {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.Questions .el-card {
  border-radius: 25px;
  background-color: white;
}
</style>
