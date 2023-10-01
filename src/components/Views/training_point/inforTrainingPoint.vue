<template>
  <div class="user">
    <el-card>
      <el-table :data="listDetailTrainingPoint" style="width: 100%">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="content" label="MSV" width="80">
          <template slot-scope="{ row }">
            {{ row.content }}
          </template>
        </el-table-column>

        <el-table-column prop="" label="Phiếu điểm" width="80">
        </el-table-column>

        <el-table-column prop="user.fullname" label="Tình trạng chấm điểm" width="90">
          <template slot-scope="scope">
            <el-button @click.prevent="gotoDetail(scope.row)" type="success" size="mini">
              Xem
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="Ngày SV chấm" width="80">
          <template slot-scope="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column prop="user.fullname" label="Tên người đăng" width="100">
          <template slot-scope="{ row }">
            {{ row.user.fullname }}
          </template>
        </el-table-column>

        <el-table-column prop="" label="Học kỳ" width="80">
        </el-table-column>

        <el-table-column prop="namhoc" label="Năm học" width="80">
        </el-table-column>

        <el-table-column label="Điểm rèn luyện">
          <el-table-column prop="svTucham" label="SV tự chấm">
          </el-table-column>
          <el-table-column prop="lopCham" label="Lớp chấm">
          </el-table-column>
          <el-table-column prop="coVan" label="Cố vấn (xét duyệt)">
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
        this.questions = response.data.questions;
        this.questions = this.questions.reverse();
      } else {
        console.error("Không thành công: ", response.data);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải câu hỏi: ", error);
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


