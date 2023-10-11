<template>
  <div class="user">
    <el-card>
      <el-table :data="tableData" style="width: 100%">

        <el-table-column type="index" label="STT" align="center"></el-table-column>

        <el-table-column prop="fullName" label="Tên sinh viên"  align="center">
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
            this.tableData = response.data.consultants;
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
  },
};
</script>

<style scoped>
</style>
