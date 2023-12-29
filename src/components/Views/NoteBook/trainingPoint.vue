<template>
    <div>
      <el-table :data="item" :fit="true" :show-header="true">
        <el-table-column label="STT"  type="index" align-items="center"></el-table-column>
        <el-table-column prop="date" label="NĂM HỌC" ></el-table-column>
        <el-table-column prop="name" label="HỌC KỲ" ></el-table-column>
        <el-table-column prop="address" label="TỔNG ĐIỂM" ></el-table-column>
        <el-table-column prop="abc" label="XẾP LOẠI" width="120"></el-table-column>
      </el-table>
    </div>
  </template>
  
<script>
export default {
  data() {
    return {
        item : [{
      date: '2021-2022',
      name: '1',
      address: '98',
      abc: 'Xuất sắc'
    },
    {
      date: '2021-2022',
      name: '2',
      address: '96',
      abc: 'Xuất sắc'
    },
    {
      date: '2022-2023',
      name: '1',
      address: '88',
      abc: 'Giỏi'
    },
    {
      date: '2022-2023',
      name: '2',
      address: '90',
      abc: 'Giỏi'
    },
    {
      date: '2023-2024',
      name: '1',
      address: '98',
      abc: 'Xuất sắc'
    },
    {
      date: '2023-2024',
      name: '1',
      address: '95',
      abc: 'Giỏi'
    },
    {
      date: '2024-2025',
      name: '1',
      address: '98',
      abc: 'Xuất sắc'
    },
    {
      date: '2024-2025',
      name: '2',
      address: '89',
      abc: 'Giỏi'
    },]
    }
  }
};
</script>