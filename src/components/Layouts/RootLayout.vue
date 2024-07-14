<template>
  <div class="wrapper" v-if="user">
    <side-bar-component @sidebarExpand="isSidebarExpand = $event" v-if="!$isMobile"/>
    <section class="content minus-180" v-if="isLoaded" v-loading="loadingStatus > 0">
      <header-component/>
      <root-content :key="client"/>
      <chat/>
    </section>
  </div>
</template>

<script>
import HeaderComponent from './Header.vue'
import RootContent from './RootContent'
import SideBarComponent from './SideBar'
import { firstRequest } from '../../api/helper'
import { getOne } from '../../utils/app'
import chat from './chat'


export default {
  data () {
    return {
      isLoaded: false,
      isSidebarExpand: false
    }
  },
  components: {
    HeaderComponent,
    RootContent,
    SideBarComponent,
    chat
    
  },
  created() {
    firstRequest().then(res => {
      if (res.data.success) {
        //this.$store.dispatch('reSetUser', res.data.customer)
        this.$store.dispatch('setFirstData', res.data)
      }

      if(res.headers['system-name']) {
        this.$store.commit('SET_SYSTEM_NAME', res.headers['system-name'])
      }
    }).finally(() => { this.isLoaded = true })
  },
  mounted () {
    const theme = getOne('layout', 'THEME') || this.THEME
    this.theme = theme === 'v2'
    this.$store.dispatch('setNewTheme', this.theme)
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    loadingStatus: function() {
      return this.$store.getters.loadingStatus
    },
    client: function() {
      return this.$store.getters.client || ''
    }
  },
  methods: {
    handleSidebar(event){
      this.isSidebarExpand = event
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    margin-left: 80px;
    width: 96%;
    @media (min-width: $md) {
      padding-left: $sidebar-size + 1;
      &.minus-180 {
        padding-left: $sidebar-size-expand + 1;
      }
    }
    
  }
  


</style>
