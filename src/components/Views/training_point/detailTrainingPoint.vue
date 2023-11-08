<template>
  <div class="user">
    <el-card>
      <el-table  :data="listDetailTrainingPoint"  align="center" class="custom-table">
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
          :page-sizes="[25, 50, 100]"
          :pager-count="5"
          :page-size.sync="pagination.page_size"
          :total="this.tableData.length"
          :current-page.sync="pagination.current_page"
          @current-change="loadDetailTrainingPoint"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAll } from '@/api/detailTrainingPoint';
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
      listDetailTrainingPoint:[],
    };
  },
  created () {
    this.loadDetailTrainingPoint()
  },
  methods: {
  
    gotoDetail(row) {
      this.$router.push({ name: 'detailTrainingPoint_edit', params: { id: row._id } });
    },
    loadDetailTrainingPoint() {
  getAll()
    .then((response) => {
      if (response && response.data && response.data.success) {
        this.listDetailTrainingPoint = response.data.detailTrainingPoints;
      } else {
        console.error("Không thành công: ", response.data);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải điểm rèn luyện: ", error);
    });
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
    background-color: #f8be97;
    color: #fff;
    border-radius: 50%;
}
</style>


