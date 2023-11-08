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
          <template slot-scope="{ row }">{{ row.title }}</template>
        </el-table-column>
        <el-table-column prop="content" label="Nội dung">
          <template slot-scope="{ row }">{{ row.content }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày, tháng đăng">
          <template slot-scope="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>


        <el-table-column label="Đính kèm">
          <template slot-scope="{ row }">
            <div v-for="attachment in row.attachmentPath" :key="attachment._id">


              <el-dropdown @command="(command) => handleCommand(command, attachment)">
  <el-button type="text" :class="getFileButtonClass(attachment)">
    {{ getFileType(attachment.filename) }}
  </el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item  disabled >{{ attachment.filename }}</el-dropdown-item>
    <el-dropdown-item divided icon="el-icon-download" command="download">
      Tải xuống
    </el-dropdown-item>
    <el-dropdown-item icon="el-icon-arrow-up" command="preview">Xem trực tiếp</el-dropdown-item>
    <el-dropdown-item icon="el-icon-top-right" command="open-in-new-tab">
      Mở trong tab mới
    </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>



            </div>
          </template>
        </el-table-column>




        <el-table-column prop="user.fullname" label="Người đăng">
          <template slot-scope="{ row }">{{ row.user.fullname }}</template>
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
import { getAll, handleDelete } from '@/api/post';
import { format } from 'date-fns';
import axios from 'axios'; // Add this line

const ModelCode = "Post";
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
    handleCommand(command, attachment) {
    if (command === 'download') {
      console.log(command + attachment)
      axios({
        url: attachment.path,
        method: 'GET',
        responseType: 'blob', // Đảm bảo nhận dữ liệu dạng blob
        baseURL: process.env.VUE_APP_BACKEND_URL,
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          console.log( 'text' + url);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', attachment.filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Lỗi khi tải xuống tệp:', error);
        });
      } else if (command === 'preview') {
    // Logic xem trước với tham số 'attachment'
    // Ví dụ, bạn có thể mở một modal hoặc một component mới để xem trước tệp
    this.$message.info(`Xem trước tệp: ${attachment.filename}`);
  } else if (command === 'open-in-new-tab') {
    // Logic mở trong tab mới với tham số 'attachment'
    // Ví dụ, bạn có thể mở một tab trình duyệt mới để xem tệp
    console.error('Lỗi khi tải xuống tệp:', attachment.path);

    // window.open(attachment.path, '_blank');
  }
  },

    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` });
    },
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } });
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
            this.tableData = response.data.posts;
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
      const filteredData = this.tableData.filter((data) =>
        !this.search || data.content.toLowerCase().includes(this.search.toLowerCase())
      );

      const startIndex = (this.pagination.current_page - 1) * this.pagination.page_size;
      const endIndex = startIndex + this.pagination.page_size;

      this.filteredTableData = filteredData.slice(startIndex, endIndex);
      this.totalData = filteredData.length;
    },
    handlePageSizeChange(size) {
      this.pagination.page_size = size;
      this.loadData();
    },
    getFileType(filename) {
      const extension = filename.split('.').pop().toLowerCase();
      if (extension === 'pdf') {
        return 'PDF';
      } else if (extension === 'xls') {
        return 'XLS';
      } else if (extension === 'xlsx') {
        return 'XLSX';
      } else if (extension === 'doc') {
        return 'DOC';
      } else if (extension === 'docx') {
        return 'DOCX';
      } else {
        return 'Khác';
      }
    },
    getFileButtonClass(attachment) {
      const extension = attachment.filename.split('.').pop().toLowerCase();
      if (extension === 'pdf') {
        return 'pdf-button';
      } else if (extension === 'xls' || extension === 'xlsx') {
        return 'excel-button';
      } else if (extension === 'doc' || extension === 'docx') {
        return 'doc-button';
      } else {
        return 'default-button';
      }
    },
    handleDropdownClick(command, attachment) {
      console.log('hello');
     
    },
  },
};
</script>

<style>
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

.pdf-button {
  border-radius: 5px;
  background-color: #ff6347;
  color: #fff;
}

.excel-button {
  border-radius: 5px;
  background-color: #1f8a70;
  color: #fff;
}

.doc-button {
  border-radius: 5px;
  background-color: #2b5797;
  color: #fff;
}

.default-button {
  border-radius: 5px;
  background-color: #d3d3d3;
  color: #000;
}

.el-dropdown-menu {
  border-radius: 5px;
}
</style>
