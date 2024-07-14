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
    this.loadLopList()
    this.loadCurrentUser()
    //this.loadNotifications()

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
  //background-image: url(https://i.pinimg.com/736x/24/15/08/241508144b960e2730bb3a57c1a54bf0.jpg);
  //background-repeat: no-repeat;
  background-size: cover;
  padding-top: 20px;
  background-image: url(./assets/bg-1.jpg);
  //background: rgb(243, 236, 243);
  //background: linear-gradient(180deg, rgba(236, 243, 243, 1) 0%, rgba(208, 234, 228, 1) 8%, rgba(208, 234, 228, 1) 19%, rgba(213, 236, 230, 1) 33%, rgba(243, 245, 247, 1) 73%, rgba(243, 245, 247, 1) 86%, rgba(243, 245, 247, 1) 100%);
}


body {
  overflow: hidden;
}
</style>
