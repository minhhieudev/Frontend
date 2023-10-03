<template>
  <div class="user">
    <el-card>
      <el-table :data="listDetailTrainingPoint" style="width: 100%">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="studentCode" label="MSV" width="80">
          <template slot-scope="{ row }">
            {{ row.studentDetails.studentCode }}
          </template>
        </el-table-column>

        <el-table-column prop="fullName" label="Tên người đăng" width="100">
          <template slot-scope="{ row }">
            {{ row.studentDetails.fullName }}
          </template>
        </el-table-column>

        <el-table-column prop="semester" label="Học kỳ" width="80">
          <template slot-scope="{ row }">
            {{ row.semester }}
          </template>
        </el-table-column>

        <el-table-column prop="schoolYear" label="Năm học" width="80">
          <template slot-scope="{ row }">
            {{ row.schoolYear }}
          </template>
        </el-table-column>

        <el-table-column label="Điểm rèn luyện">
          <el-table-column prop="Total_selfAssessment" label="SV tự chấm">
            <template slot-scope="{ row }">
              {{ row.Total_selfAssessment }}
            </template>
          </el-table-column>
          <el-table-column prop="Total_groupAssessment" label="Lớp chấm">
            <template slot-scope="{ row }">
              {{ row.Total_groupAssessment }}
            </template>
          </el-table-column>
          <el-table-column prop="Total_consultantAssessment" label="Cố vấn (xét duyệt)">
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
const ModelCode = 'question';
import { getCollection, handleDelete } from '@/api/question';
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


