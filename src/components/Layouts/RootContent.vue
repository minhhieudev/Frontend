<template>
  <div class="wrapper">
    <transition name="el-alert-fade" v-for="(alert, index) in alerts" :key="'alert' + index">
      <div role="alert" class="el-alert is-light mb-1" :class="'el-alert--' + alert.type">
        <i class="el-alert__icon is-big" :class="'el-icon-' + alert.type"></i>
        <div class="el-alert__content">
          <span class="el-alert__title is-bold" v-if="'title' in alert">{{ alert.title }}</span>
          <p class="el-alert__description">{{ alert.message }}</p>
          <i class="el-alert__closebtn el-icon-close" @click="dismissAlert(index)"></i>
        </div>
      </div>
    </transition>
    <div class="">
      <div class="p-1 p-md-2">
        <div :class="!$isMobile ? 'p-3':''">
          <!-- <breadcrumb v-if="$isMobile" class="mb-3"/> -->
          <div v-if="subtitle" class="content-title pb-4 mt-n4">{{ subtitle }}</div>
          <router-view :key="reRender"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "./Header/Breadcrumb.vue"

export default {
  components: { Breadcrumb },
  methods: {
    dismissAlert: function(index) {
      this.$store.dispatch('dismissAlert', index)
    },
    doAction(button) {
      if (button.callback && typeof button.callback == 'function') {
        button.callback()
      } else if (button.route) {
        let route = { name: button.route }
        if (button.routeParams) {
          route.params = button.routeParams
        }
        this.$router.push(route)
      } else if (button.path) {
        this.$router.push(button.path)
      } else {
        console.warn(`Button "${button.label}" has an invalid action`)
      }
    },
    handleMoreAction(btn) {
      this.doAction(btn)
    }
  },
  computed: {
    alerts: function() {
      return this.$store.getters.alerts
    },
    loadingStatus: function() {
      return this.$store.getters.loadingStatus
    },
    reRender: function() {
      return this.$store.getters.reRender
    },
    pageTitle() {
      return this.$store.getters.pageTitle
    },
    toolbarWidges() {
      return this.$store.getters.toolbarWidges || []
    },
    subtitle() {
      return this.$store.getters.subtitle || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-150 {
  margin-top: 150px;
}
.wrapper {
  min-height: calc(100vh - #{$new-header-height});
  @media (min-width: $sm) {
    //background-color: var(--light-gray);
  }
  
}
.content-header {
  background-color: $header-bg;
  min-height: 200px;
}
.mt--150 {
  margin-top: -150px;
}
.content-title {
  color: $header-text;
}

</style>
