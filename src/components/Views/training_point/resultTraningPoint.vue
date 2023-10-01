<template>
    <div class="user">
      <el-card>
        <el-table :data="$store.getters.questions" style="width: 100%">
          <el-table-column type="index" label="STT"></el-table-column>
          <el-table-column prop="content" label="MSV">
            <template slot-scope="{row}">
              {{ row.content }}
            </template>
          </el-table-column>
  
          <el-table-column prop="user.fullname" label="Họ và tên" height="40">
            <template slot-scope="{ row }">
              {{ row.user.fullname }}
            </template>
          </el-table-column>
  
          <el-table-column prop="user.fullname" label="Lớp" height="40">
            <template slot-scope="{ row }">
              {{ row.user.fullname }}
            </template>
          </el-table-column>

          <el-table-column prop="user.fullname" label="Khoa" height="40">
            <template slot-scope="{ row }">
              {{ row.user.fullname }}
            </template>
          </el-table-column>
  
          <el-table-column prop="user.fullname" label="Năm học" height="40">
            <template slot-scope="{ row }">
              {{ row.user.fullname }}
            </template>
          </el-table-column>
  
          <el-table-column label="Kỳ 1" height="5">
            <el-table-column label="Điểm" height="5">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Xếp loại">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Ghi chú">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="Kỳ 2" height="5">
            <el-table-column label="Điểm" height="5">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Xếp loại">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Ghi chú">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="Cả năm" height="5" >
            <el-table-column label="Điểm" height="5">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Xếp loại">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
              </template>
            </el-table-column>
            <el-table-column label="Ghi chú">
              <template slot-scope="{ row }">
                {{ row.user.fullname }}
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
  const ModelCode = 'training_point';
  import { getAll } from '@/api/training_point';
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
        getCollection({ pagination: this.pagination }).then(({ data }) => {
          if (data.success) {
            this.setData({
              key: 'questions',
              data: {
                docs: data.docs,
                total: data.total
              }
            });
          }
          console.log(data);
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
  