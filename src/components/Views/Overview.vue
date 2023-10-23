<template>
  <div id="dashboard" v-loading="loading">
   Hello
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      loading: false
    };
  },
  created() {

  },
  computed: {
    
  },
  methods: {
    reloadData() {
      this.$wrLoading(true);
      setTimeout(() => this.$wrLoading(false), 1000);
    },
  },
};
</script>
