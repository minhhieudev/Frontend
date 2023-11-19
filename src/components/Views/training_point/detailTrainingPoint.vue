<template>
  <div class="">
    <el-card>
      <h4 class="font-weight-bold text-success text-center mb-5">DANH SÁCH PHIẾU ĐIỂM</h4>
      <div class="action-trainingPoint mb-4">
        <i class="fa-solid fa-rotate-right" @click="resetData"></i>
        <i style="color: rgb(3, 49, 49);" class="fa-solid fa-filter"></i>
        
        <el-select v-model="selectedKhoa" placeholder="Khoa" filterable>
          <el-option v-for="item in khoaList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        
        <el-select v-model="selectedNganh" placeholder="Ngành" filterable>
          <el-option v-for="item in nganhList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        
        <el-select v-model="selectedLop" filterable placeholder="Lớp">
  <el-option v-for="className in lopList" :key="className" :label="className" :value="className"></el-option>
</el-select>

        <el-input
          v-model="search"
          size="medium" 
          placeholder="Tìm theo tên, email..."
          class="search-input-trainingPoint"
        >
        </el-input>
        <i class="fa-solid fa-magnifying-glass"></i>
       
      </div>
      <el-table :data="filteredTableData"  align="center" class="custom-table">
        <el-table-column type="index" label="STT" align="center"></el-table-column>
        <el-table-column prop="studentCode" label="MSV" width="100" align="center">
          <template slot-scope="{ row }">
            {{ row.studentDetails.studentCode }}
          </template>
        </el-table-column>

        <el-table-column label="Xem phiếu điểm " width="130" align="center">
          <template slot-scope="{ row }">
            <el-button @click.prevent="gotoDetail(row)" type="success" size="mini">
              Phiếu điểm
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="fullName" label="Tên sinh viên" width="150" align="center">
          <template slot-scope="{ row }">
            {{ row.studentDetails.fullName }}
          </template>
        </el-table-column>

        <el-table-column prop="semester" label="Học kỳ" width="80" align="center">
          <template slot-scope="{ row }">
            {{ row.semester }}
          </template>
        </el-table-column>

        <el-table-column prop="schoolYear" label="Năm học" width="130" align="center">
          <template slot-scope="{ row }">
            {{ row.schoolYear }}
          </template>
        </el-table-column>

        <el-table-column label="Điểm rèn luyện" align="center">
          <el-table-column prop="Total_selfAssessment" label="SV tự chấm" align="center">
            <template slot-scope="{ row }">
              {{ row.Total_selfAssessment }}
            </template>
          </el-table-column>
          <el-table-column prop="Total_groupAssessment" label="Lớp chấm" align="center">
            <template slot-scope="{ row }">
              {{ row.Total_groupAssessment }}
            </template>
          </el-table-column>
          <el-table-column prop="Total_consultantAssessment" label="Cố vấn (xét duyệt)" align="center">
            <template slot-scope="{ row }">
              {{ row.Total_consultantAssessment }}
            </template>
          </el-table-column>
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
import { getAll } from '@/api/detailTrainingPoint';
import { format } from 'date-fns';
import {  getClassList,getKhoaList,getNghanhList} from '@/api/student';
import '@fortawesome/fontawesome-free/css/all.css';


export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
      search: '',
      selectedKhoa: '',
      selectedNganh: '',
      selectedLop: '',
      khoaList: [],
      nganhList: [],
      lopList: [],
    };
  },
  created () {
    this.loadDetailTrainingPoint()
    this.fetchClassLists();

  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search || data.fullName.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.selectedKhoa || data.department === this.selectedKhoa) &&
        (!this.selectedNganh || data.nganh === this.selectedNganh) &&
        (!this.selectedLop || data.className === this.selectedLop)
      );
    },
    
    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;
      
      return this.filteredTableData.slice(start, end);

      
    },
  },
  methods: {
  
    gotoDetail(row) {
      this.$router.push({ name: 'detailTrainingPoint_edit', params: { id: row._id } });
    },
    loadDetailTrainingPoint() {
  getAll()
    .then((response) => {
      if (response && response.data && response.data.success) {
        this.tableData = response.data.detailTrainingPoints;
      } else {
        console.error("Không thành công: ", response.data);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải điểm rèn luyện: ", error);
    });
},

handlePageSizeChange(newSize) {
      this.pagination.page_size = newSize;
      this.pagination.current_page = 1;
    },

    handleCurrentPageChange(newPage) {
      this.pagination.current_page = newPage;
    },
     formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy ');
    },
    fetchClassLists() {
      getClassList()
        .then(response => {
          this.lopList = response.data.classLists;
        })
        .catch(error => {
          console.error('Error fetching Lop list:', error);
        });

        getNghanhList()
        .then(response => {
          this.nganhList = response.data.nganhLists;
        })
        .catch(error => {
          console.error('Error fetching Nganh list:', error);
        });

        getKhoaList()
        .then(response => {
          this.khoaList = response.data.khoaLists;
        })
        .catch(error => {
          console.error('Error fetching Khoa list:', error);
        });
    },
    resetData(){
      this.selectedKhoa='';
      this.selectedNganh='';
      this.selectedLop='';
      this.search=''
    }
  }
}
</script>
<style >

.action-trainingPoint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #f8be97;
    color: #fff;
    border-radius: 50%;
}
.custom-input-trainingPoint  {
    width: 200px;  
    font-weight: bold; 
    background-color: #eaeaea;  
    border: none;
  }
  .custom-input-trainingPoint .el-input__inner {
  border: none;
  border-right: 1px solid #e4e7ed; 
  border-radius: 0; 
}
.search-input-trainingPoint {
  width: auto;
  border: none;
  width: 200px;  

}
  .custom-input-trainingPoint input {
    color: #333;  
    border: none;
    border-bottom: 1px solid #e4e7ed; 
  }
  .custom-input-trainingPoint input {
    color: #333;  /* Màu chữ */
  }
</style>


