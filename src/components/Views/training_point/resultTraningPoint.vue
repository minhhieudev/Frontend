<template>
  <div class="Result custom-scroll-result">
    <el-card>
      <div class="search-bar">
        <i class="fa-solid fa-rotate-right" @click="resetData"></i>

        <el-dropdown @command="handleDownloadCommand">
          <span class="el-dropdown-link">
            <i class="fa-solid fa-download" slot="trigger"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="csv"><i class="fas fa-file-pdf text-success "></i> Export to CSV
            </el-dropdown-item>
            <el-dropdown-item command="word"><i class="fas fa-file-word text-primary"></i> Export to Word
            </el-dropdown-item>
            <el-dropdown-item command="pdf"><i class="fas fa-file-excel text-danger "></i> Export to PDF
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <i style="color: rgb(3, 49, 49);" class="fa-solid fa-filter"></i>

        <el-select v-model="selectedNam" placeholder="Năm học" filterable>
          <el-option v-for="item in namList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <el-select v-model="selectedKhoa" placeholder="Khoa" filterable>
          <el-option v-for="item in khoaList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <el-select v-model="selectedNganh" placeholder="Ngành" filterable>
          <el-option v-for="item in nganhList" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <el-select v-model="selectedLop" filterable placeholder="Lớp">
          <el-option v-for="className in lopList" :key="className" :label="className" :value="className"></el-option>
        </el-select>

        <el-input v-model="search" size="medium" placeholder="Tìm theo tên, email..." class="custom-input-result">
        </el-input>
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>

      <el-table :data="currentPageData" style="width: 100%" class="custom-table">
        <el-table-column label="STT" width="50" align="center">
          <template slot-scope="{ $index, row }">
            <span>{{ ($index + 1) + (pagination.current_page - 1) * pagination.page_size }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="studentCode" label="MSV" width="100" align="center">
          <template slot-scope="{ row }">{{ row.studentDetails.studentCode }}</template>
        </el-table-column>

        <el-table-column prop="fullName" label="Tên SV" width="150" align="center">
          <template slot-scope="{ row }">{{ row.studentDetails.fullName }}</template>
        </el-table-column>

        <el-table-column prop="className" label="Lớp" width="100" align="center">
          <template slot-scope="{ row }">{{ row.studentDetails.className }}</template>
        </el-table-column>

        <el-table-column prop="schoolYear" label="Năm học" width="100" align="center">
          <template slot-scope="{ row }">{{ row.schoolYear }}</template>
        </el-table-column>

        <el-table-column label="Kỳ 1" align="center" width="100">
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
        <el-pagination background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[10, 25, 50, 100]"
          :page-size.sync="pagination.page_size" :total="filteredTableData.length"
          :current-page.sync="pagination.current_page" @current-change="handleCurrentPageChange"
          @size-change="handlePageSizeChange" />
      </div>

      <!-- Thống kê số lượng kết quả rèn luyện -->
      <h4 class="table-title text-center text-success">THỐNG KÊ KẾT QUẢ RÈN LUYỆN</h4>
      <div class="container-statistical">
        <el-card v-for="(semester, key) in [semester1Statistics, semester2Statistics, wholeYearStatistics]" :key="key"
          :style="getCardColor(key)" class="box-card">
          <div slot="header" class="clearfix text-center">
            <p :style="getColorStyle(key)">{{ getSemesterLabel(key) }}</p>
          </div>
          <el-row>
            <el-col :span="12">
              <div class="items" :key="index">
                <p>XUẤT SẮC: {{ semester.excellent }}</p>
                <p>GIỎI: {{ semester.good }}</p>
                <p>KHÁ: {{ semester.fair }}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="items" :key="index">
                <p>TRUNG BÌNH: {{ semester.average }}</p>
                <p>YẾU: {{ semester.weak }}</p>
                <p>KÉM: {{ semester.least }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div class="chart-container mt-2">
        <canvas id="trainingChart"></canvas>
      </div>

    </el-card>
  </div>
</template>

<script>
import { getAll } from '@/api/resultTrainingPoint';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import htmlDocx from 'html-docx-js/dist/html-docx';
import '@fortawesome/fontawesome-free/css/all.css';
import { Chart } from 'chart.js';



export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 10
      },
      totalData: 0,
      search: '',
      selectedNam: '',
      selectedKhoa: '',
      selectedNganh: '',
      selectedLop: '',
      namList: [],
      khoaList: [],
      nganhList: [],
      lopList: [],
      loading: false,
      index: 0,
    };
  },
  mounted() {
    this.createChart();
  },

  created() {
    this.loadData()
    this.loadInfoToFilter()
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(data =>
        (!this.search || data.studentDetails.fullName.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.selectedNam || data.schoolYear === this.selectedNam) &&
        (!this.selectedKhoa || data.studentDetails.department === this.selectedKhoa) &&
        (!this.selectedNganh || data.studentDetails.nganh === this.selectedNganh) &&
        (!this.selectedLop || data.studentDetails.className === this.selectedLop)
      );
    },
    semester1Statistics() {
      return this.calculateStatistics(this.filteredTableData, 'semester1');
    },
    semester2Statistics() {
      return this.calculateStatistics(this.filteredTableData, 'semester2');
    },
    wholeYearStatistics() {
      return this.calculateStatistics(this.filteredTableData, 'wholeYear');
    },

    currentPageData() {
      const start = (this.pagination.current_page - 1) * this.pagination.page_size;
      const end = start + this.pagination.page_size;

      return this.filteredTableData.slice(start, end);


    },
    uniqueSchoolYears() {
      const uniqueYears = [...new Set(this.tableData.map(item => item.schoolYear))];
      return uniqueYears;
    },
    dataChart() {
      const data = {
        labels: ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu', 'Kém'],
        datasets: [
          {
            label: 'Học kỳ 1',
            data: [this.semester1Statistics.excellent, this.semester1Statistics.good, this.semester1Statistics.fair, this.semester1Statistics.average, this.semester1Statistics.weak],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Học kỳ 2',
            data: [this.semester2Statistics.excellent, this.semester2Statistics.good, this.semester2Statistics.fair, this.semester2Statistics.average, this.semester2Statistics.weak],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Cả năm',
            data: [this.wholeYearStatistics.excellent, this.wholeYearStatistics.good, this.wholeYearStatistics.fair, this.wholeYearStatistics.average, this.wholeYearStatistics.weak],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };
      return data;
    }
  },
  watch: {
    uniqueSchoolYears: {
      handler(newValues) {
        this.namList = newValues;
      },
      immediate: true,
    },
    dataChart:{
      handler(){
        this.createChart()

      }
    }
  },
  methods: {
    createChart() {

      const ctx = document.getElementById('trainingChart').getContext('2d');

      const data = this.dataChart

      new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } });
    },
    calculateStatistics(data, semesterKey) {
      const statistics = { excellent: 0, good: 0, fair: 0, average: 0, weak: 0 };

      data.forEach(item => {
        const classification = item[semesterKey].classify;

        switch (classification) {
          case 'Xuất sắc':
            statistics.excellent++;
            break;
          case 'Giỏi':
            statistics.good++;
            break;
          case 'Khá':
            statistics.fair++;
            break;
          case 'Trung bình':
            statistics.average++;
            break;
          case 'Yếu':
            statistics.weak++;
            break;
          default:
            break;
        }
      });

      return statistics;
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

    resetData() {
      this.selectedNam = '';
      this.selectedKhoa = '';
      this.selectedNganh = '';
      this.selectedLop = '';
      this.search = ''
    },
    getCardColor(index) {
      const colors = [
        "rgb(168, 245, 219)",
        "rgb(171, 223, 243)",
        "rgb(248, 215, 241)",
      ];
      const color = colors[index % colors.length];
      return { backgroundColor: color };
    },
    getColorStyle(key) {
      const colorStyles = [
        "rgba(6, 109, 14, 0.856)",
        "rgb(45, 7, 184)",
        "rgb(199, 7, 65)",
      ];
      const color = colorStyles[key];
      return { color };
    },
    getSemesterLabel(key) {
      const labels = [
        "HỌC KỲ 1",
        "HỌC KỲ 2",
        "CẢ NĂM",
      ];
      return labels[key];
    },

    handleDownloadCommand(command) {
      switch (command) {
        case 'csv':
          this.exportToCSV();
          break;
        case 'word':
          this.exportToWord();
          break;
        case 'pdf':
          this.exportToPDF();
          break;
        default:
          break;
      }
    },


    loadInfoToFilter() {
      this.khoaList = this.$store.getters.khoaList
      this.nghanhList = this.$store.getters.nghanhList
      this.lopList = this.$store.getters.lopList
    },

    exportToCSV() {
      const dataToExport = this.filteredTableData.map(item => {
        return {
          MSV: item.studentDetails.studentCode,
          'Tên sinh viên': item.studentDetails.fullName,
          Lớp: item.studentDetails.className,
          'Năm học': item.schoolYear,
          'Kỳ 1 - Điểm': item.semester1.point,
          'Kỳ 1 - Xếp loại': item.semester1.classify,
          'Kỳ 1 - Ghi chú': item.semester1.note,
          'Kỳ 2 - Điểm': item.semester2.point,
          'Kỳ 2 - Xếp loại': item.semester2.classify,
          'Kỳ 2 - Ghi chú': item.semester2.note,
          'Cả năm - Điểm': item.wholeYear.point,
          'Cả năm - Xếp loại': item.wholeYear.classify,
          'Cả năm - Ghi chú': item.wholeYear.note,
        };
      });

      const csvContent = this.convertArrayToCSV(dataToExport);

      const csvWithBOM = '\ufeff' + csvContent;

      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'result_training.csv');
    },

    convertArrayToCSV(array) {
      const header = Object.keys(array[0]).join(',');
      const body = array.map(obj => {
        return Object.values(obj)
          .map(value => {
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',');
      }).join('\n');
      return `${header}\n${body}`;
    },
    exportToWord() {
      const dataToExport = this.filteredTableData.map(item => {
        return {
          MSV: item.studentDetails.studentCode,
          'Tên sinh viên': item.studentDetails.fullName,
          Lớp: item.studentDetails.className,
          'Năm học': item.schoolYear,
          'Kỳ 1 - Điểm': item.semester1.point,
          'Kỳ 1 - Xếp loại': item.semester1.classify,
          'Kỳ 1 - Ghi chú': item.semester1.note,
          'Kỳ 2 - Điểm': item.semester2.point,
          'Kỳ 2 - Xếp loại': item.semester2.classify,
          'Kỳ 2 - Ghi chú': item.semester2.note,
          'Cả năm - Điểm': item.wholeYear.point,
          'Cả năm - Xếp loại': item.wholeYear.classify,
          'Cả năm - Ghi chú': item.wholeYear.note,
        };
      });

      const table = `
    <table border="1" style="width:100%; border-collapse: collapse;text-align: center;">
      <thead>
        <tr>
          <th colspan="13" style="background-color: white; color: black; font-size: 20px; padding: 10px;font-weight: bold">BẢNG KẾT QUẢ RÈN LUYỆN</th>
        </tr>
        <tr>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">MSV</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Tên sinh viên</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Lớp</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Năm học</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Kỳ 1</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Kỳ 2</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Cả năm</th>
        </tr>
        <tr>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        ${dataToExport
          .map(row => `
            <tr>
              <td style="border: 1px solid black; padding: 8px;">${row.MSV}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Tên sinh viên']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row.Lớp}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Năm học']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Ghi chú']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Ghi chú']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Ghi chú']}</td>
            </tr>`)
          .join('')}
      </tbody>
    </table>`;

      const element = document.createElement('div');
      element.innerHTML = table;

      const content = element.outerHTML;  // Use outerHTML instead of innerHTML

      const converted = htmlDocx.asBlob(content);

      saveAs(converted, 'result_training.docx');
    },
    exportToPDF() {
      this.loading = true;
      const dataToExport = this.filteredTableData.map(item => {
        return {
          MSV: item.studentDetails.studentCode,
          'Tên sinh viên': item.studentDetails.fullName,
          Lớp: item.studentDetails.className,
          'Năm học': item.schoolYear,
          'Kỳ 1 - Điểm': item.semester1.point,
          'Kỳ 1 - Xếp loại': item.semester1.classify,
          'Kỳ 1 - Ghi chú': item.semester1.note,
          'Kỳ 2 - Điểm': item.semester2.point,
          'Kỳ 2 - Xếp loại': item.semester2.classify,
          'Kỳ 2 - Ghi chú': item.semester2.note,
          'Cả năm - Điểm': item.wholeYear.point,
          'Cả năm - Xếp loại': item.wholeYear.classify,
          'Cả năm - Ghi chú': item.wholeYear.note,
        };
      });

      const table = `
    <table border="1" style="width:100%; border-collapse: collapse;text-align: center;">
      <thead>
        <tr>
          <th colspan="13" style="background-color: white; color: black; font-size: 20px; padding: 10px;font-weight: bold">BẢNG KẾT QUẢ RÈN LUYỆN</th>
        </tr>
        <tr>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">MSV</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Tên sinh viên</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Lớp</th>
          <th rowspan="2" style="border: 1px solid black; padding: 8px;">Năm học</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Kỳ 1</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Kỳ 2</th>
          <th colspan="3" style="border: 1px solid black; padding: 8px;">Cả năm</th>
        </tr>
        <tr>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
          <th style="border: 1px solid black; padding: 8px;">Điểm</th>
          <th style="border: 1px solid black; padding: 8px;">XL</th>
          <th style="border: 1px solid black; padding: 8px;">Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        ${dataToExport
          .map(row => `
            <tr>
              <td style="border: 1px solid black; padding: 8px;">${row.MSV}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Tên sinh viên']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row.Lớp}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Năm học']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 1 - Ghi chú']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Kỳ 2 - Ghi chú']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Điểm']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Xếp loại']}</td>
              <td style="border: 1px solid black; padding: 8px;">${row['Cả năm - Ghi chú']}</td>
            </tr>`)
          .join('')}
      </tbody>
    </table>`;

      const element = document.createElement('div');
      element.innerHTML = table;

      const pdfOptions = {
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      };

      html2pdf(element, {
        margin: 10,
        filename: 'result_training.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: pdfOptions,
      }).then(() => {
        this.loading = false; // Tắt biến loading sau khi xử lý xong
      });
    },

  },

}

</script>

<style>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.filter-input {
  order: -1;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #5ceeee;
  color: #fff;
  border-radius: 50%;
}

.custom-input-result {
  width: 200px;
  /* Điều chỉnh chiều rộng theo nhu cầu */
  font-weight: bold;
  /* Đậm hơn */
  background-color: #eaeaea;
  /* Màu sắc nền */
  border: none;
}

.custom-input-result input {
  color: #333;
  /* Màu chữ */
}

.custom-input-result .el-input__inner {
  border: none;
  border-right: 1px solid #e4e7ed;
  /* Bạn có thể tùy chỉnh màu đường biên */
  border-radius: 0;
  /* Tùy chọn: Loại bỏ đường cong biên */
}

.custom-input-result input {
  color: #333;
  /* Màu chữ */
  border: none;
  border-right: 1px solid #e4e7ed;
  /* Bạn có thể tùy chỉnh màu đường biên */
}

.custom-input-result:focus {
  border-color: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
}

.statistics-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f3f3f3;
  border-radius: 5px;
}

.statistics-item {
  text-align: center;
  margin-bottom: 20px;
}

.item-title {
  font-weight: bold;
}

.item-value {
  font-size: 18px;
  color: #333;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-weight: bold;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.container-statistical {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

}

.container-statistical {
  font-weight: bold;
}

.custom-scroll-result {
  max-height: 87vh;
  overflow-y: auto;
}
.el-select{
  width: 10%;
}
</style>