<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <template v-for="(item, idx) in breadcrumb">
        <el-breadcrumb-item :key="idx" v-if="item.meta && item.meta.title">
          {{item.meta.title}}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
</template>
<script>
export default {
    computed: {
        breadcrumb() {
            return this.$store.getters.breadcrumb || []
        }
    }
}
</script>