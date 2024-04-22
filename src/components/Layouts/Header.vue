<template>
  <header class="navbar app-navbar px-4 bg-white v2-theme custom">
    <header-left />
    <!-- <Search /> -->
    <div class="ml-auto mr-1 d-flex" v-if="!$isMobile">
      <account-info></account-info>
      <el-dropdown trigger="click" @command="updateStatus" @visible-change="handleVisibleChange">
        <el-badge :value="countUnreadNotifications" :max="99" class="item mr-3">
          <el-icon class="el-icon-message-solid" name="bell"></el-icon>
        </el-badge>
        <el-dropdown-menu class="notification-dropdown" slot="dropdown">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <el-avatar :src="notification.user.avatarUrl"></el-avatar>
            <div class="notification-content">
              <span class="notification-author">{{ notification.user.fullname }}</span>&nbsp;
              <span class="notification-text">{{ notification.content }}</span>

            </div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import AccountInfo from './Header/AccountInfo'
import HeaderLeft from './Header/HeaderLeft'
import Search from './Header/Search'
import { getAll } from '@/api/notification';
import { updateNotificationForUser, getNotification, updateNotificationStatus } from '@/api/user';
import { initSocketConnection, getSocketInstance } from '@/utils/auth'
import io from "socket.io-client";


export default {
  components: { AccountInfo, HeaderLeft, Search },
  data() {
    return {
      notifications: [],
    }
  },
  created() {
    this.loadData();

    // Kết nối với server qua Socket.IO
    // this.socket = io("http://localhost:8001");



    this.$store.getters.socket.on("updateNotifications", () => {
      this.loadData();

    });

  },
  computed: {
    countUnreadNotifications() {
      return this.notifications.filter(notification => !notification.viewed).length;
    },

  },
  methods: {

    async loadData() {
      try {
        // Lấy thông báo chung
        const response = await getAll();
        if (response.data.success) {
          const listNotifications = response.data.notifications;

          // Lấy thông báo không phải của mình
          const apiNotifications = listNotifications.filter(notification =>
            notification.user._id !== this.$store.getters.user._id
          );


          // Lấy thông báo của user
          const dataListResponse = await getNotification(this.$store.getters.user._id);
          if (dataListResponse.data.success) {
            const dataList = dataListResponse.data.notifications;

            // Lọc những thông báo chưa có trong mảng dataList
            const newNotifications = apiNotifications.filter(notification =>
              !dataList.some(dataNotification => dataNotification._id === notification._id)
            );

            // Thêm những thông báo mới vào mảng dataList
            dataList.push(...newNotifications);

            // Gọi API để cập nhật thông báo trên server
            await updateNotificationForUser(this.$store.getters.user._id, dataList)
              .then((response) => {
                if (response.data.success) {
                  this.notifications = dataList.reverse();
                } else {
                  console.error("Không thành công: ", response.data);
                }
              })
              .catch((error) => {
                console.error("Lỗi khi lấy thông báo: ", error);
              });
          } else {
            console.error("Không thành công khi lấy dataList: ", dataListResponse.data);
          }
        } else {
          console.error("Không thành công khi lấy apiNotifications: ", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo: ", error);
      }
    },

    updateStatus() {
      console.log('123');
      // await updateNotificationStatus(this.$store.getters.user._id);
      // this.loadData();
    },
    async handleVisibleChange(visible) {

      if (visible && this.countUnreadNotifications > 0) {
        console.log('Dropdown visible state changed to:', visible);
        await updateNotificationStatus(this.$store.getters.user._id);
        this.loadData();
      }

    },
  },


}
</script>

<style lang="scss" scoped>
.notification-dropdown {

  width: 330px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #f2f7f6;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12), 0px 4px 4px rgba(0, 0, 0, 0.04);
  border-radius: 8px; // Điều chỉnh độ cong của các góc
  overflow-x: hidden;
}

.app-navbar {
  height: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  border-radius: 500px;
}

.title {
  margin-top: -5px;
}

.notification-item {
  display: flex;
  cursor: pointer;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  /* Thêm đường viền giữa các thông báo */
}

.notification-item:hover {
  background-color: #f5f5f5;
  /* Màu nền khi di chuột qua */
}

.notification-item img {
  width: 40px;
  /* Điều chỉnh kích thước avatar */
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.notification-content {
  flex: 1;
}

.notification-author {
  font-weight: bold;
  color: #08ad3f;
}

.notification-text {
  font-weight: bold;
}


header {
  &.v2-theme {
    height: 56px;

    @media (min-width: $md) {
      height: $new-header-height;
    }

    background-image: url(https://png.pngtree.com/background/20210716/original/pngtree-soft-pink-background-picture-image_1332401.jpg);
    //     background: rgb(175, 238, 247);
    // background: linear-gradient(90deg, rgb(125, 208, 247) 0%, rgb(127, 217, 233) 8%, rgb(176, 219, 233) 19%, rgb(182, 228, 231) 33%, rgb(187, 222, 238) 73%, rgb(185, 225, 240) 86%, rgb(185, 217, 238) 100%);

    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12),
    0px 4px 4px rgba(0, 0, 0, 0.04);

    a>img {
      width: 125px;
      margin-top: -33px;
    }

    position: relative;

    /deep/.user-text {
      color: var(--color);
    }

    /deep/.wr-left-navbar {
      .bg {
        background: var(--primary);
        width: 32px;
        height: 32px;
        border-radius: 100%;
        color: white;
        text-align: center;
        cursor: pointer;

        i {
          font-size: 14px;
          color: white;
          line-height: 32px;
        }
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        object-fit: cover;
      }

      .user-notification {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        position: absolute;
        background-color: #04747c;
        line-height: 0;
        color: #fff;
        top: 20px;
        left: 15px;
      }
    }
  }

  &.bg-red {
    padding: 20px 15px;
    height: 100px;
    max-height: $wr-nav-menu-height;
    background: $header-bg;

    a>img {
      width: 125px;
      margin-top: -33px;
    }

    /deep/.btn-link {
      text-decoration: none !important;
      color: #000;

      i.fa {
        margin-left: 5px;
      }
    }

    /deep/i[class^='el-icon'] {
      font-size: 20px;
      cursor: pointer;
      padding-left: 5px;
      vertical-align: middle;
      color: $header-text;

      &:hover {
        opacity: 0.7;
      }
    }

    /deep/.user-text {
      color: $header-text;
    }
  }

}

.wr-icon-down {
  transform: rotate(-180deg);
}

.wr-custom-dd {
  .dropdown-item {
    i.fa {
      margin-top: -5px;
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}


.custom {
  background-image: url('https://img.freepik.com/free-vector/modern-flowing-colorful-wave-banner-background_1035-19861.jpg?w=2000');
}
</style>
