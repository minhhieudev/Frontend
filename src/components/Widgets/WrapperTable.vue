<template>
  <div class="wrapper-table">
    <filter-widget :data="filterData" @search="handleSearch"/>
    <p><span class="text-danger">{{ tableData.count }} </span> records found</p>
  </div>
</template>
