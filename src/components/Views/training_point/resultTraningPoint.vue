<template>
  <div class="Result">
    <el-card>
      <div class="search-bar">
        <!-- Lọc theo lớp -->
        <div style="display: flex; justify-content: space-between;">
          <el-input
            v-model="filterClass"
            size="medium"
            placeholder="Filter by class"
            class="custom-input filter-input"
            @input="applyFilters"
          ></el-input>

          <!-- Tìm kiếm theo tên sinh viên -->

          <!-- Lọc theo năm học -->
          <el-input
            v-model="filterYear"
            size="medium"
            placeholder="Filter by year"
            class="custom-input filter-input"
            @input="applyFilters"
          ></el-input>
        </div>

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

      <el-table :data="filteredTableData" style="width: 100%" class="custom-table">
        <el-table-column type="index" label="STT" align="center"></el-table-column>

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
      <div class="mt-4">
        <el-button size="small" type="primary" @click="exportToCSV" round>Export to CSV</el-button>
        <el-button size="small" type="success" @click="exportToWord" round>Export to Word</el-button>
        <el-button size="small" type="danger" @click="exportToPDF" :loading="loading" round>Export to PDF</el-button>
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
import mammoth from 'mammoth';
import htmlDocx from 'html-docx-js/dist/html-docx';





export default {
  data() {
    return {
      tableData: [],
      filteredTableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
      search: '',
      filterClass: '',
      filterYear: '',
      loading: false,
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
            this.applyFilters(); // Áp dụng bộ lọc khi dữ liệu được tải
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
        (!this.search || data.studentDetails.fullName.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.filterClass || data.studentDetails.className.toLowerCase().includes(this.filterClass.toLowerCase())) &&
        (!this.filterYear || data.schoolYear.toLowerCase().includes(this.filterYear.toLowerCase()))
      );
      this.totalData = this.filteredTableData.length;
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
};
</script>

<style >
/* .custom-table th {
  background-color: #cbf1f3 !important;
  color: black !important;
}

.custom-table tr:nth-child(even) {
  background-color: #e0f5e5 !important;
}

.custom-table tr:nth-child(odd) {
  background-color: #ffffff !important;
} */
.search-bar {
  display: flex;
  justify-content: space-between;
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