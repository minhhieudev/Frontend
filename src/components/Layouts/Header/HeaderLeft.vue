<template>
  <div :class="$isMobile ? 'w-100' : ''">
    <div class="d-flex align-items-center">
      <h4 class="ml-2 font-weight-bold d-flex align-items-center justify-content-between justify-content-md-between mb-0">
        <i v-if="$isMobile" class="fa fa-bars mr-3" @click="drawer = true"></i>
        <b>{{ activeItem.name }}</b>
        <!-- <i class="el-icon-setting ml-2 mt-1"></i> -->
      </h4>
      <!-- <template v-if="!$isMobile">
        <div v-for="(item, index) of menuItems" class="" :key="index">
          <router-link :to="item.url">
            <el-button class="ml-4" size="medium" type="text"><b style="font-size: 20px">{{ item.name }}</b></el-button>
          </router-link>
        </div>
      </template> -->
    </div>
    <el-drawer :visible.sync="drawer" :show-close="false" custom-class="background-drawer" :withHeader="false" direction="ltr" size="90vw">
      <div class="text-center py-4">
        <img src="@/assets/logo.png" alt="logo" style="width: 100%; max-width: 200px"/>
      </div>
      <account-info :in-drawer="true" />
      <sidebar :is-header="true" @active_item="drawer=false" />
    </el-drawer>
    <!-- <breadcrumb v-if="!$isMobile"></breadcrumb> -->
  </div>
</template>

<script>
import sidebars from '../Sidebars'
import Sidebar from '../SideBar.vue'
import AccountInfo from './AccountInfo.vue'
import Breadcrumb from './Breadcrumb.vue'
export default {
  components: {
    Sidebar,
    AccountInfo,
    Breadcrumb
  },
  data() {
    return {
      drawer: false,
      count: 0
    }
  },
  watch:{
    $route (to, from){
      this.count += 1
    }
  }, 
  created(){
    this.$root.$on('sidebarDrawer', (val) => this.drawer = val)
  },
  computed: {
    pageTitle() {
      //console.log(this.count);
      return this.$store.getters.pageTitle
    },
    activeItem () {
      //console.log(this.count);
      let itemActive = sidebars[this.$store.getters.user.role].find(item => item.url == this.$router.history.current.path)
      return itemActive || { name: '' }
    },
    menuItems () {
      return sidebars[this.$store.getters.user.role].filter(item => item.url != this.activeItem.url)
    }
  },
}
</script>
<style lang="scss" scoped>
/deep/ .background-drawer {
  background: #F5F7FA;
}
h4 /deep/i.el-icon-setting {
  color: #04747c;
}
</style>
