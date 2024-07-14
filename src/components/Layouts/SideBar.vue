<template>
  <aside class="sidebar" :class="{ 'w-180': true, 'w-100 position-static bg-none': isHeader }"
    :style="{ height: sidebarHeight + 'px' }">
    <div v-if="!isHeader" class=" d-flex flex-wrap"
      :class="isSidebarExpand ? 'align-items-center justify-content-between' : 'justify-content-center'">
      <div class="text-center">
      </div>
      <div class="application" :class="isSidebarExpand ? 'ml-2' : 'mt-2'">

        <div class="title-apps">
          <p class="title-app"> PHẦN MỀM </p>
          <p class="title-app"> CỐ VẤN HỌC TẬP</p>
        </div>
        <!-- <img src="" alt=""> -->
        <!-- <el-button circle plain type="primary" :icon="isSidebarExpand ? 'el-icon-arrow-left' : 'el-icon-arrow-right'" @click="handleSidebarExpand" /> -->
      </div>
    </div>

    <div class="wrapper-sidebar-menu">
      <div class="custom-container">
        <p>{{ getName() }}</p>
        <el-icon style="color: rgb(248, 39, 67);" class="el-icon-eleme"></el-icon>
      </div>
      <ul class="sidebar-menu">
        <sidebar-item v-for="(sidebar, index) in sidebars" :sidebar="sidebar" v-if="sidebar.type === '1'" :key="index"
          :index="index" @active_item="handleClickItem"></sidebar-item>
      </ul>
      <div v-if="this.$store.getters.user.role !== 'student'">
        <div class="categoryManagement">
          <p>QUẢN TRỊ CHUNG </p>
          <el-icon style="color: rgb(24, 61, 228);" class="el-icon-caret-bottom"></el-icon>
        </div>
        <ul class="sidebar-menu">
          <sidebar-item v-for="(sidebar, index) in sidebars" :sidebar="sidebar" v-if="sidebar.type === '2'" :key="index"
            :index="index" @active_item="handleClickItem"></sidebar-item>
        </ul>
      </div>
      <div class="trainingPoint" v-if="this.$store.getters.user.role != 'student'">
        <p>ĐIỂM RÈN LUYỆN</p>
        <el-icon style="color: rgb(24, 61, 228);" class="el-icon-caret-bottom"></el-icon>
      </div>
      <ul class="sidebar-menu">
        <sidebar-item v-for="(sidebar, index) in sidebars" :sidebar="sidebar" v-if="sidebar.type === '3'" :key="index"
          :index="index" @active_item="handleClickItem"></sidebar-item>
      </ul>
      <ul class="sidebar-menu mt-2">
        <sidebar-item v-for="(sidebar, index) in sidebars" :sidebar="sidebar" v-if="sidebar.type === '4'" :key="index"
          :index="index" @active_item="handleClickItem"></sidebar-item>
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
    },
    getName() {
      const role = this.$store.getters.user.role
      if (role == 'student') return 'SINH VIÊN'
      else if (role == 'consultant') return 'CỐ VẤN'
      else if (role == 'Admin') return 'ADMIN'
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
  margin: 15px;
  border-radius: 20px;

  height: 500px; // Set a fixed height
  overflow-y: auto;

  width: 260px !important;
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 40px);
  //background-image: url(../../../src/assets/4.jpg);
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

  z-index: 1010;

  &.w-180 {
    width: $sidebar-size-expand;

    /deep/.sidebar-menu-item {
      button {
        //background: #468a5f;
        color: #333;
        padding-top: 3px;
        padding-bottom: 3px;
      }

      .active {
        background: #51e5f0;
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

    .el-collapse-item {
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 10px 10px 0;
  /* Góc bo tròn ở bên phải */
  background: linear-gradient(90deg, rgb(115, 203, 243) 0%, rgb(100, 210, 230) 8%, rgb(138, 209, 233) 19%, rgb(155, 231, 236) 33%, rgb(172, 218, 240) 73%, rgb(159, 219, 241) 86%, rgb(168, 212, 241) 100%);
}

.custom-container p {
  text-transform: uppercase;
  /* Chuyển chữ thành chữ in hoa */
  margin: 0;
  padding-left: 4%;
}

.categoryManagement {
  padding: 4px;
  background-color: rgb(243, 145, 243);
  color: white;
  font-weight: bold;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 10px 10px 0;
  /* Góc bo tròn ở bên phải */
  background: linear-gradient(90deg, rgb(240, 204, 141) 0%, rgb(247, 223, 158) 8%, rgb(241, 211, 125) 19%, rgb(238, 216, 146) 33%, rgb(240, 222, 124) 73%, rgb(245, 243, 156) 86%, rgb(243, 241, 131) 100%);
}

.categoryManagement p {
  text-transform: uppercase;
  /* Chuyển chữ thành chữ in hoa */
  margin: 0;
  padding-left: 4%;
}

.trainingPoint {
  padding: 4px;
  background-color: rgb(241, 201, 114);
  color: white;
  font-weight: bold;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 10px 10px 0;
  /* Góc bo tròn ở bên phải */
  background: linear-gradient(90deg, rgb(238, 190, 250) 0%, rgb(222, 174, 245) 8%, rgb(234, 155, 236) 19%, rgb(216, 143, 238) 33%, rgb(213, 136, 243) 73%, rgb(243, 126, 227) 86%, rgb(231, 138, 243) 100%);
}

.trainingPoint p {
  text-transform: uppercase;
  /* Chuyển chữ thành chữ in hoa */
  margin: 0;
  padding-left: 4%;
}

.application {
  color: red;
  font-weight: bold;
  font-size: 0.99rem;
  text-shadow: 1px 1px 2px rgb(241, 209, 209);
}

.title-app {
  font-family: 'Roboto Mono', monospace;
  text-shadow: 1px 1px 2px black, 0 0 25px rgb(102, 102, 253), 0 0 5px darkblue;
  font-size: larger;
  font-weight: bold;
  padding: 1px;
  margin-bottom: 6px;
}

.title-apps {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}
</style>
