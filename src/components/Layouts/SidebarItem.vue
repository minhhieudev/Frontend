<template>
  <li class="sidebar-menu-item p-1 mt-1" v-click-outside="clickOutSide">
    <template>
      <el-button plain :type="(getSidebarActive || getRouteActive) ? 'primary' : ''" class="px-2 w-100" :class="{'border-0': !getSidebarActive && !getRouteActive, 'active': (getSidebarActive || getRouteActive)}" @click="showSidebarItem(sidebar, index, hasChildren)">
        <div class="d-flex flex-wrap align-items-center justify-content-center flex-column sidebar-item  ">
          <div class="icon" v-if="sidebar.icon.includes('el-icon') || sidebar.icon.includes('fa fa-')">
            <i :style="`color: ${sidebar.color_icon}`" :class="sidebar.icon"></i>
          </div>
          <!-- <feather-icons :icon="sidebar.icon" :style="`color: ${sidebar.color_icon}`"/> -->
          <b class="text mt-2">{{ sidebar.name }}</b>
        </div>
      </el-button>
    </template>
  </li>
</template>
<script>
import FeatherIcons from '../Widgets/FeatherIcons.vue'
export default {
  props: ['sidebar', 'index'],
  components:{
    FeatherIcons
  },
  data() {
    return {
      currentActive: null
    }
  },
  methods: {
    showSidebarItem(sidebar, index, hasChildren) {
      if(!hasChildren) this.sidebarLink(sidebar)
      else if (this.$refs['sidebar' + index]) {
        this.$store.dispatch('changeCurrentSidebar', sidebar.url).then(() => {
          this.$store.dispatch('changeSidebarHeight')
        })
      }
    },
    hideSidebarItem() {
      this.$store.dispatch('changeCurrentSidebar', null).then(() => {
        this.$store.dispatch('changeSidebarHeight', true)
      })
    },
    sidebarLink(sidebar) {
      this.$emit('active_item')

      if (this.hasChildren) {
        return '#'
      }
      if (sidebar.url === 'dashboard') {
        return this.$router.push({path: '/'}).catch(() => {})
      }
      return this.$router.push({path: sidebar.url}).catch(() => {})
    },
    clickOutSide() {
      if (this.getCurrentSidebar === this.sidebar.url) {
        this.$store.dispatch('changeCurrentSidebar', null)
      }
    },
    hasACLChildren(items, url) {
      let result = false
      if (Array.isArray(items)) {
        result = items.some(item => this.acl(url + '/' + item.url))
      }
      return result
    }
  },
  computed: {
    getCurrentSidebar() {
      return this.$store.getters.currentSidebar
    },
    hasChildren() {
      return 'children' in this.$props.sidebar && this.$props.sidebar.children.length >= 1
    },
    getRouteActive() {
      return this.$props.sidebar.url === '/' + this.$route.fullPath.split('/')[1]
    },
    getSidebarActive() {
      return this.getCurrentSidebar === this.$props.sidebar.url
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar-menu-show {
  display: block !important;
}
.sidebar-menu-item {
  button {
    font-weight: 400;
  }
  .icon {
    font-size: 22px;
  }
  a {
    color: $wr-sidebar-item-color;
    text-decoration: none;
    display: block;
    padding: 7px 0;
    margin: 2px 0;
    font-size: 12px;
    &:hover {
      color: $wr-sidebar-item-hover-color;
      background: $wr-sidebar-item-hover-bg;
    }
    &.active-sidebar-link {
      color: $wr-sidebar-item-hover-color;
      background: $wr-sidebar-item-hover-bg;
    }
    .text {
      text-transform: uppercase;
    }
  }
  .wrapper-hidden-submenu {
    & > span > i {
      position: absolute;
      right: 25px;
      top: 22px;
      cursor: pointer;
      font-size: 24px;
      color: $wr-sidebar-item-color;
      transition: transform 0.5s;
      &:hover {
        transform: rotate(-180deg);
      }
    }
    position: absolute;
    background: $wr-sidebar-submenu-bg;
    left: 100%;
    max-height: 100vh;
    min-height: 100vh;
    top: 0;
    overflow: auto;
    color: $wr-sidebar-item-color;
    text-align: left;
    box-shadow: 0px 1px 3px 0px black;
    z-index: 1010;
    .submenu-column {
      width: 260px;
      padding: 5px;
    }
    .wrapper-submenu {
      margin: 1rem 0;
    }
    .submenu {
      display: flex;
      flex-direction: row;
    }
    .submenu,
    .column-menu {
      list-style: none;
      padding: 5px 10px;
      strong {
        color: $wr-sidebar-item-color;
        padding: 0 0 11px;
        display: block;
        margin: 0 10px;
        font-size: 18px;
      }
      a {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 400;
        color: $wr-sidebar-item-color;
        &:hover {
          color: $wr-sidebar-item-hover-color;
          background: $wr-sidebar-item-hover-bg;
        }
      }
    }
  }
}
</style>
