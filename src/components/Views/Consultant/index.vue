<template>
  <div class="Consultant">
    <el-card>
      <div class="search-bar">
        <!-- Lọc theo lớp -->

        <el-input
          v-model="search"
          size="medium"
          placeholder="Type to search"
          class="custom-input search-input"
          @input="applyFilters"
        >
          <el-button slot="prepend" icon="el-icon-search" class="search-icon"></el-button>
        </el-input>
      </div>

      <el-table  :data="filteredTableData" style="width: 100%" class="custom-table" >

        <el-table-column type="index" label="STT" align="center"></el-table-column>

        <el-table-column prop="fullName" label="Tên cố vấn"  align="center">
          <template slot-scope="{ row }">
            {{ row.fullName }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email"  align="center">
          <template slot-scope="{ row }">
            {{ row.email }}
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


        <el-table-column prop="dateOfBirth" label="Chức năng"  align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
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
          :total="this.totalData"
          :current-page.sync="pagination.current_page"
          @current-change="loadData"
          @size-change="handlePageSizeChange"
          
        />
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'consultant';
import { getAll } from '@/api/consultant';
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
      filteredTableData: [],
      search:'',
    };
  },
  created() {
    this.loadData();
    console.log(this.totalData.length);
  },
  methods: {
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } });
    },

    loadData() {
      getAll()
        .then((response) => {
          if (response && response.data && response.data.success) {
            this.tableData = response.data.consultants;
            this.applyFilters();
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
    applyFilters() {
      this.filteredTableData = this.tableData.filter(data =>
        (!this.search || data.fullName.toLowerCase().includes(this.search.toLowerCase())) 
      );
      this.totalData = this.filteredTableData.length;
    },
  },
};
</script>

<style >

.custom-table th {
  background-color: #7ab7e0 !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #ecf0f1 !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #db8ceb;
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
