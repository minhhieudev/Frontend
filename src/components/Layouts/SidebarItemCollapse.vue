<template>
  <el-collapse-item class="sidebar-menu-item " v-click-outside="clickOutSide" :name="sidebar.url+index">
    <div slot="title" class="d-flex flex-wrap align-items-center sidebar-item bg-none" @click="showSidebarItem(sidebar, index, hasChildren)">
      <div class="icon" v-if="sidebar.icon.includes('el-icon') || sidebar.icon.includes('fa fa-')">
        <i :class="sidebar.icon"></i>
      </div>
      <feather-icons v-else :icon="sidebar.icon" />
      <div class="text pl-1">{{ sidebar.name }}</div>
    </div>
    <template v-if="hasChildren">
      <el-collapse accordion>
          <template v-for="(children, idx) in sidebar.children">
            <el-collapse-item v-for="(column, indexColumn) in children.column" :key="column.name + index + indexColumn + idx" :name="sidebar.url + index + idx + indexColumn">
              <div slot="title" v-if="column.name && hasACLChildren(column.item, sidebar.url)">{{ column.name }}</div>
              <div>
                <template v-for="(item, indexItem) in column.item">
                   <template v-if="acl(item.url) && item.url.startsWith('/')">
                      <router-link :key="sidebar.url + item.name + index + idx + indexColumn + indexItem" slot="title" :to="item.url" @click.native="goTo(item.url)">{{ item.name }}</router-link>
                    </template>
                    <template v-else-if="acl(sidebar.url + '/' + item.url)">
                      <router-link :key="sidebar.url + item.name + index + idx + indexColumn + indexItem" slot="title" :to="'/' + sidebar.url + '/' + item.url" @click.native="goTo('/' + sidebar.url + '/' + item.url)">{{ item.name }}</router-link>
                    </template>
                </template>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>
    </template>
  </el-collapse-item>
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
    goTo(url) {
      this.$router.push({path: url}).catch(() => {})
      this.$root.$emit('sidebarDrawer', false)
    },
    sidebarLink(sidebar) {
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
      return this.$props.sidebar.url === this.$route.fullPath.split('/')[1]
    },
    getSidebarActive() {
      return this.getCurrentSidebar === this.$props.sidebar.url
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-collapse-item__arrow {
  transform: rotate(90deg);
  &.is-active {
    transform: rotate(270deg);
  }
}
</style>