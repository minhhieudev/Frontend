<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted() {
    if (['admin', 'consultant'].includes(this.$store.getters.user.role)) {
      this.loadAllUsers()
      this.loadAllQuestions()
    }
  }
}
</script>

<style lang="scss">
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#app{
  padding-top: 20px;
  background: rgb(11, 236, 236);
}
</style>
