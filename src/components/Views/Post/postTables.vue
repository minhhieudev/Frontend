<template>
  <div class="Posts">
    <el-card>
      <div class="action-post justify-content-between mb-4">
        <div class="d-flex justify-content-start">
          <div class="d-flex align-items-center p-2" style="color: rgb(1, 6, 12);">
            <i class="fa-solid fa-rotate-right" @click="resetFilters"></i>
            <div class="d-flex  align-items-center ml-5 border-right">
              <i style="color: rgb(20, 197, 197);" class="fa-solid fa-filter  mr-3"></i>
              
              <!-- Khoa Dropdown -->
              <el-select v-model="selectedType" placeholder="Loại" class="custom-input-post">
                <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>

          <div class="d-flex  align-items-center p-2">
            <el-input
              v-model="search"
              size="medium" 
              placeholder="Tìm theo tên Tài liệu / Bài đăng..."
              class="custom-input-post"
            >
            </el-input>
            <el-button icon="el-icon-search" class="ml-2" type="success" circle></el-button>
          </div>
        </div>

        <el-button @click="goToAddNewPage()" type="success" round>Tạo mới</el-button>
      </div>

      <el-table :data="currentPageData" style="width: 100%" class="custom-table">
        <el-table-column label="STT" width="80">
    <template slot-scope="{ $index, row }">
      <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
    </template>
  </el-table-column>
        <el-table-column prop="title" label="Tên Tài liệu / Bài đăng" width="500">
          <template slot-scope="{ row }">
            <span style="font-weight: bold; color: #09af09;">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Loại" width="160">
          <template slot-scope="{ row }">{{ row.postType }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày, tháng đăng">
          <template slot-scope="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>

        <el-table-column label="Đính kèm">
          <template slot-scope="{ row }" class="d-flex">
           <div class="d-flex">
            <div v-for="attachment in row.attachmentPath" :key="attachment._id" class="mx-2">
              <el-dropdown @command="(command) => handleCommand(command, attachment) " >
                <el-button type="text" :class="getFileButtonClass(attachment)">
                  <i class="size-icon" :class="getFileIconClass(attachment.filename).class" :style="{ color: getFileIconClass(attachment.filename).color }"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>{{ attachment.filename }}</el-dropdown-item>
                  <el-dropdown-item divided icon="el-icon-download" command="download">Tải xuống</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-arrow-up" command="preview">Xem trực tiếp</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-top-right" command="open-in-new-tab">Mở trong tab mới</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
           </div>
          </template>
        </el-table-column>

        <el-table-column prop="user.fullname" label="Người đăng">
          <template slot-scope="{ row }">{{ row.user.fullname }}</template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150">
          <template slot-scope="scope">
            <router-link :to="{ name: 'Post', params: { id: scope.row._id } }" @click="scrollToQuestion(scope.row._id)">
  <el-button type="primary" icon="el-icon-view" size="small" circle></el-button>
</router-link>
            <el-button v-if="!isStudentRole" class="ml-3" type="danger" @click.prevent="confirmDelete(scope.row)" icon="el-icon-delete" size="small" circle></el-button>
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
import { getAll, handleDelete } from '@/api/post';
import { format } from 'date-fns';
import axios from 'axios'; // Add this line
import '@fortawesome/fontawesome-free/css/all.css';

const ModelCode = "Post";
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 10,
      },
      search: '',
      typeList: ['Thông báo', 'Tài liệu', 'Bài đăng'],
      selectedType: ''
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search || data.title.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.selectedType || data.postType === this.selectedType)
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
      this.$router.push({ name: 'post_main' })
    },
    handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
    },
    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
    },
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
            console.log('text' + url);

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
      this.$router.push({ name: 'post_main' });
    },
    
    gotoDetail(row) {
      this.$router.push({ name: `Post`, params: { id: row._id } });
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
  
  getAll()
    .then((response) => {
      if (response && response.data && response.data.success) {
        this.tableData = response.data.posts.reverse();
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

    

    getFileIconClass(filename) {
      const fileExtension = filename.split('.').pop().toLowerCase();
      let icon = {
        class: 'fas fa-file', // Mặc định là biểu tượng file
        color: '#333', // Màu mặc định
      };

      switch (fileExtension) {
        case 'pdf':
          icon.class = 'fas fa-file-pdf';
          icon.color = '#ff0000'; // Đỏ cho PDF
          break;
        case 'txt':
          icon.class = 'fa-solid fa-file-lines';
          icon.color = '#00CCFF'; 
          break;
        case 'doc':
        case 'docx':
          icon.class = 'fas fa-file-word';
          icon.color = '#2b5797'; 
          break;
        case 'csv':
        case 'csvx':
        case 'xsl':
        case 'xslx':
          icon.class = 'fa-solid fa-file-excel';
          icon.color = '#1f8a70'; 
          break;
        default:
          break;
      }

      return icon;
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
    resetFilters() {
      this.selectedType = ''; 
      this.search=''
    },
  },
};
</script>


<style >


.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #f08294;
  color: #fff;
}

.action-post {
  display: flex;
  align-items: center;
}

.filter-input {
  order: -1;
}

.custom-input-post  {
  width: 250px;
  font-weight: bold;
  border: none;
  }
  
 
  .custom-input-post .el-input__inner {
    border: none;
  background-color: white;
  font-weight: bold;
}
  .custom-input-post input {
    color: #333;
  border: none;
  font-weight: bold;
  }


.size-icon {
  font-size: x-large;
}

.el-dropdown-menu {
  border-radius: 5px;
}
</style>
