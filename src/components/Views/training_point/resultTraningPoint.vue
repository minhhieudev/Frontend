<template>
  <div class="user">
    <el-card>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="STT" align="center"></el-table-column>

        <el-table-column prop="studentCode" label="MSV" width="80" align="center">
          <template slot-scope="{ row }">
            {{ row.studentDetails.studentCode }}
          </template>
        </el-table-column>

        <el-table-column prop="fullName" label="Tên sinh viên" width="150" align="center">
          <template slot-scope="{ row }">
            {{ row.studentDetails.fullName }}
          </template>
        </el-table-column>

        <el-table-column prop="className" label="Lớp" width="150" align="center">
          <template slot-scope="{ row }">
            {{ row.studentDetails.className }}
          </template>
        </el-table-column>

        <el-table-column label="Kỳ 1" align="center">
          <el-table-column prop="semester1.point" label="Điểm" align="center"></el-table-column>
          <el-table-column prop="semester1.classify" label="Xếp loại" align="center"></el-table-column>
          <el-table-column prop="semester1.note" label="Ghi chú" align="center"></el-table-column>
        </el-table-column>

        <el-table-column label="Kỳ 2" align="center">
          <el-table-column prop="semester2.point" label="Điểm" align="center"></el-table-column>
          <el-table-column prop="semester2.classify" label="Xếp loại" align="center"></el-table-column>
          <el-table-column prop="semester2.note" label="Ghi chú" align="center"></el-table-column>
        </el-table-column>

        <el-table-column label="Cả năm" align="center">
          <el-table-column prop="wholeYear.point" label="Điểm" align="center"></el-table-column>
          <el-table-column prop="wholeYear.classify" label="Xếp loại" align="center"></el-table-column>
          <el-table-column prop="wholeYear.note" label="Ghi chú" align="center"></el-table-column>
        </el-table-column>

      </el-table>
      <div class="mt-2">
        <el-pagination
          background
          layout="jumper, prev, pager, next, sizes, total"
          :page-sizes="[25, 50, 100]"
          :pager-count="5"
          :page-size.sync="pagination.page_size"
          :total="$store.getters.total_questions"
          :current-page.sync="pagination.current_page"
          @current-change="loadData"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

  <script>
  const ModelCode = 'training_point';
  import { getAll } from '@/api/resultTrainingPoint';
  import { format } from 'date-fns';
  
  export default {
    data() {
      return {
        tableData: [],
        pagination: {
          current_page: 1,
          page_size: 25
        },
        totalData: 0
      };
    },
    created() {
      this.loadData();
    },
    methods: {
      gotoDetail(row) {
        this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } });
      },
     
      loadData() {
        getAll()
          .then((response) => {
            if (response && response.data && response.data.success) {
              this.tableData = response.data.resultTrainingPoints;
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
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  