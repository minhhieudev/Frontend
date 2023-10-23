<template>
  <aside class="sidebar" :class="{'w-180': true, 'w-100 position-static bg-none': isHeader}"  :style="{ height: sidebarHeight + 'px' }">
    <div v-if="!isHeader" class="p-3 d-flex flex-wrap" :class="isSidebarExpand ? 'align-items-center justify-content-between' : 'justify-content-center'">
      <div class="text-center">
      </div>
      <div class="d-flex align-items-center justify-content-center" :class="isSidebarExpand ? 'ml-2' : 'mt-2'">
        <img v-if="!$isMobile" src="data:image/png;base64,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" alt="logo" height="60" />
        <p style="color: rgb(40, 5, 170);font-weight: bold;margin: 0;">PHẦN MỀM CỐ VẤN HỌC TẬP</p>
        <!-- <el-button circle plain type="primary" :icon="isSidebarExpand ? 'el-icon-arrow-left' : 'el-icon-arrow-right'" @click="handleSidebarExpand" /> -->
      </div>
    </div>
    
    <div class="wrapper-sidebar-menu">
      <div class="custom-container">
        <p>{{ this.$store.getters.user.role }}</p>
        <el-icon style="color: rgb(24, 61, 228);" class="el-icon-caret-bottom"></el-icon>
      </div>
      <ul class="sidebar-menu">
        <sidebar-item
          v-for="(sidebar, index) in sidebars"
          :sidebar="sidebar"
          :key="index"
          :index="index"
          @active_item="handleClickItem"
        ></sidebar-item>
      </ul>
      
    </div>
  </aside>
</template>
<script>
import sidebars from './Sidebars'
import SidebarItem from './SidebarItem'
import SidebarItemCollapse from './SidebarItemCollapse.vue'
export default {
  components: {
    SidebarItem,
    SidebarItemCollapse
  },
  props: {
    isHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sidebars: [],
      isSidebarExpand: false
    }
  },
  created() {
    let role = this.$store.getters.user.role || 'student'
    this.sidebars = sidebars[role]
  },
  methods: {
    handleClickItem() {
      this.$emit('active_item')
    },
    handleSidebarExpand() {
      this.isSidebarExpand = !this.isSidebarExpand
      this.$emit('sidebarExpand', this.isSidebarExpand)
    },
    scrollHeight() {
      return document.documentElement.scrollHeight
    }
  },
  computed: {
    sidebarHeight() {
      return this.$store.getters.sidebarHeight
    },
    hasACL() {
      let acl = this.$store.getters['acl']
      return acl === '*' || (Array.isArray(acl) && acl.length)
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar-menu {
  list-style: none;
  padding: 0;
  text-align: center;
  border-top: 1px solid #ddd5;
 // background: $wr-sidebar-bg;
}
.sidebar {
  margin: 20px;
  border-radius: 20px;

  width: 250px !important;
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 40px);
  background-image: url(../../../src/assets/4.jpg);
  z-index: 1010;
  &.w-180 {
    width: $sidebar-size-expand;
    /deep/.sidebar-menu-item {
      button {
        //background: #468a5f;
        color: #333;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .active {
        background: #d8ede9;
      }
      .sidebar-item {
        flex-direction: row !important;
        justify-content: flex-start !important;
        .text {
          padding-left: 8px;
          margin-top: 0 !important;
        }
      }
    }
  }
  /deep/.el-collapse {
    background: transparent;
    .el-collapse-item{
      background-color: white;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      &__header {
        border: 0;
        background-color: transparent;
        font-size: 14px !important;
        font-weight: 500;
        padding: 0.75rem;
        height: auto;
        line-height: 30px;
      }
      &__content {
        padding: 0;
        background-color: var(--light-gray);
      }
      .el-collapse-item {
        box-shadow: none;
        border-radius: 0;
        margin: 0;
        .el-collapse-item__header {
          padding-left: 3rem;
          box-shadow: inset 0px -1px 0px #DCDFE6;
        }
        .el-collapse-item__content {
          padding-left: 4rem;
          a {
            display: block;
            padding: 0.75rem 0;
            font-weight: bold;
            font-size: 14px;
            color: #606266;
            &:hover {
              color: $primary;
            }
          }
        }
      }
      .icon {
        font-size: 24px;
      }
    }
  }
}
.custom-container {
    padding: 4px;
    background-color: aqua;
    color: white;
    font-weight: bold;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 10px 10px 0; /* Góc bo tròn ở bên phải */
    background: linear-gradient(90deg, rgb(115, 203, 243) 0%, rgb(100, 210, 230) 8%, rgb(138, 209, 233) 19%, rgb(155, 231, 236) 33%, rgb(172, 218, 240) 73%, rgb(159, 219, 241) 86%, rgb(168, 212, 241) 100%);
  }

  .custom-container p {
    text-transform: uppercase; /* Chuyển chữ thành chữ in hoa */
    margin: 0;
    padding-left: 4%;
  }
</style>
