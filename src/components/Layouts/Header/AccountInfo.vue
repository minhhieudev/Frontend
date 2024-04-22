<template>
  <div :class="{ 'in-drawer pb-3': inDrawer }">
    <ul class="left-navbar">
      <!-- <li class="order-2" v-if="!$isMobile">
            <el-switch v-model="theme" active-color="#04747C" size="mini" @change="changeTheme" />
        </li> -->
      <!-- <li class="bg order-4">
        <i class="el-icon-bell">
          <span class="badge badge-danger">4</span>
        </i>
      </li> -->
      <li class="order-1 order-md-5 pl-5 pr-md-0">
        <el-dropdown trigger="click" @command="handleCommand" class="align-text-center">
          <span class="text-black" style="cursor: pointer">
            <b>{{ this.$store.getters.user.fullname }}</b>
            <el-badge :value="this.$store.getters.user.is_admin ? 'Admin' : ''" class="item">
              <img :src="paths" alt="avatar"
                :width="30" class="avatar rounded-pill mb-1 mr-2 ml-2" />
            </el-badge>

            <!-- <span class="user-notification" v-if="isNewTheme">1</span> -->
            <!-- <span class="user-text"> {{ user.first_name }} {{ user.last_name }} </span> -->
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="fa fa-user-o" disabled>{{ this.$store.getters.user.email }}</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-custom" command="change_avatar">Đổi avatar</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-custom" command="change_pass">Đổi mật khẩu</el-dropdown-item>
            <el-dropdown-item command="logout" icon="fa fa-sign-out">Đăng xuất</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <!-- Include AvatarChangeDialog component with ref -->
    <AvatarChangeDialog ref="avatarChangeDialog" @change-avatar="handleChangeAvatar" />
  </div>
</template>
<script>
import { setOne } from '../../../utils/app'
import AvatarChangeDialog from './AvatarChangeDialog'

export default {
  props: {
    inDrawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialogLockSession: false,
      countdown: 60,
      isSetting: false,
      lock: {
        enabled: false,
        period: 5
      },
      theme: false,
      dataUser: {},
      paths: ""
    }
  },
  components: {
    AvatarChangeDialog, // Register the component
  },

  created() {
    this.getUser()

  },

  methods: {
    getUser() {
        this.paths = this.$store.getters.currentUser.avatarUrl
      },

    changeTheme() {
      const theme = this.theme ? 'v2' : ''
      setOne('layout', 'THEME', theme)
      this.$store.dispatch('setNewTheme', theme === 'v2')
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          path: '/login'
        }).catch(() => { })
      })
    },
    handleCommand(cmd) {
      switch (cmd) {
        case 'logout':
          this.logout()
          break
        case 'change_avatar':
          this.showAvatarChangeDialog();
          break;
        case 'lock_session':
          this.showDialogLockSession = true
          break
        default:
          return false
      }
    },
    showAvatarChangeDialog() {
      // Show the avatar change dialog
      this.$refs.avatarChangeDialog.dialogVisible = true;
    },
    // Handle change avatar event
    handleChangeAvatar(newAvatarUrl) {
      this.paths = newAvatarUrl;

    },

    lockSession() {
      this.showDialogLockSession = false
      this.$store.dispatch('lockSession')
    },
    async handleCounter() {
      if (this.countdown <= 0) {
        this.lockSession()
        return false
      }
      if (!this.isSetting && this.showDialogLockSession) {
        this.countdown--
        await this.sleep(1000)
        this.handleCounter()
      }
    },
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, ms)
      })
    },
    editUser() {
      this.$router.push({ name: 'system_user_edit', params: { id: this.$store.state.user.user._id } }).catch(() => { })
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  mounted() {
    this.$watch(
      'lock',
      () => {
        this.$store.commit('LOCK_SETTING', this.lock)
      },
      {
        deep: true
      }
    )
    const lock = this.$store.state.user.lock
    if (lock && Object.keys(lock).length) {
      this.lock = lock
    }
    this.theme = this.isNewTheme
  },
  watch: {
    isSetting(value) {
      if (!value) {
        this.handleCounter()
      }
    },
    showDialogLockSession(value) {
      if (value) {
        this.countdown = 60
        this.handleCounter()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.left-navbar {
  list-style: none;
  padding: 0;
  display: flex;
  align-items: center;
  margin: 0;

  li {
    +li {
      margin-left: 20px;
    }
  }
}
</style>
