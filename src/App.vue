<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    this.connectSocket()
    this.loadKhoaList()
    this.loadNghanhList()
    this.loadLopList()
    this.loadCurrentUser()
    //this.loadNotifications()
    if (['Admin', 'Cố vấn'].includes(this.$store.getters.user.role)) {
      this.loadAllUsers()
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

#app {
  overflow-x: hidden;
  
  padding-top: 20px;
  background: rgb(243, 236, 243);
  background: linear-gradient(180deg, rgba(236, 243, 243, 1) 0%, rgba(208, 234, 228, 1) 8%, rgba(208, 234, 228, 1) 19%, rgba(213, 236, 230, 1) 33%, rgba(243, 245, 247, 1) 73%, rgba(243, 245, 247, 1) 86%, rgba(243, 245, 247, 1) 100%);
}</style>
