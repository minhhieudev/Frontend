<template>
  <div>
    <div>
      <div class="d-flex px-2">
        <div class="toolbar-buttons mr-auto">
          <h4>{{ pageTitle }}</h4>
        </div>
        <div class="toolbar-buttons ml-auto">
          <template v-for="(button, i) in buttons">
            <template v-if="button.more">
              <el-dropdown :key="i" size="medium" split-button :type="button.type" @click="doAction(button)" @command="handleMoreAction">
                {{ button.label }}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(btn, j) in button.more" :key="j" :command="btn">{{ btn.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button
                :key="i"
                size="medium"
                :type="button.type"
                :icon="button.icon"
                class="mx-1"
                @click="doAction(button)"
                :disabled="button.disabled"
              >
                {{ button.label }}
              </el-button>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['buttons', 'noFixed', 'websiteSelector', 'subtitle'],
    data () {
      return {
        scrollY: null,
        originalTop: 0,
        isFixed: false
      }
    },
    methods: {
      doAction (button) {
        if (button.callback && typeof button.callback == 'function') {
          button.callback()
        } else if (button.route) {
          let route = { name: button.route }
          if (button.routeParams) {
            route.params = button.routeParams
          }
          if (button.routeQuery) {
            route.query = button.routeQuery
          }
          this.$router.push(route)
        }  else if (button.path) {
          this.$router.push(button.path)
        } else {
          console.warn(`Button "${button.label}" has an invalid action`)
        }
      },
      handleMoreAction (btn) {
        this.doAction(btn)
      },
      handleWindows: function () {
        this.scrollY = Math.round(window.scrollY)
      },
      handleWebsiteChanged (id) {
        this.$emit('websiteChanged', id)
        this.$parent.handleWebsiteChanged && this.$parent.handleWebsiteChanged(id)
      }
    },
    computed: {
      pageTitle () {
        return this.$store.getters.pageTitle
      },
      wid () {
        return this.$parent.wid || 0
      },
      showWebsites () {
        return typeof this.$parent.handleWebsiteChanged === 'function' || this.websiteSelector
      }
    },
    mounted () {
      let el = this.$el.querySelector('.wr-scroll-source')
      if (el) {
        this.originalTop = +el.getBoundingClientRect().top + +el.getBoundingClientRect().height
      }
      window.addEventListener('scroll', this.handleWindows)
      this.$store.dispatch('setToolbarWidgets', this.buttons)
    },
    watch: {
      scrollY () {
        this.isFixed = this.scrollY > this.originalTop;
      },
      subtitle (val) {
        this.$store.commit('SET_SUBTITLE', val)
      },
      buttons () {
        this.$store.dispatch('setToolbarWidgets', this.buttons)
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleWindows)
      this.$store.dispatch('setToolbarWidgets', [])
      this.$store.commit('SET_SUBTITLE', '')
    }
  }
</script>

<style lang="scss" scoped>
  #main-toolbar {
    padding: 15px 0;
    margin-bottom: 5px;
  }
  .wr-scroll-fixed {
    position: fixed;
    top: 0;
    right: 0;
    background: #fff;
    width: 100%;
    z-index: 111;
    box-shadow: -4px -5px 7px black;
    padding: 15px 15px 15px ($sidebar-size + 15);
    height: $wr-nav-menu-height;
    max-height: $wr-nav-menu-height;
  }
</style>
