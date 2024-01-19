<template>
  <header class="navbar app-navbar px-4 bg-white v2-theme custom">
    <header-left />
    <!-- <Search /> -->
    <div class="ml-auto mr-1 d-flex" v-if="!$isMobile">
      <account-info></account-info>
      <el-dropdown trigger="click">
        <el-badge :value="countUnreadNotifications" :max="99" class="item mr-3">
          <!-- Biểu tượng chuông -->
          <el-icon class="el-icon-message-solid" name="bell"></el-icon>
        </el-badge>
        <el-dropdown-menu class="notification-dropdown">
          <!-- Nội dung thông báo sẽ được đặt ở đây -->
          <div v-for="notification in notifications" :key="notification.id">
            <div class="info">
              <div style="display: flex;justify-content: center;align-items: center;">
                <el-avatar :src="notification.user.avatarUrl"></el-avatar>
                <div style="display: flex;flex-direction: column;">
                  <span class="author">{{ notification.user.fullname }}</span>
                  <span> {{ notification.content }}</span>
                </div>
              </div>
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
import { getForId } from '@/api/notification';
import { updateNotificationForUser, getNotification } from '@/api/user';

export default {
  components: { AccountInfo, HeaderLeft, Search },
  data() {
    return {
      notifications: [],
    }
  },
  created() {
    this.loadData()
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
        const response = await getForId(this.$store.getters.user._id);
        if (response.data.success) {
          const apiNotifications = response.data.notifications;

          // Lấy thông báo của user
          const dataListResponse = await getNotification(this.$store.getters.user._id);
          if (dataListResponse.data.success) {
            const dataList = dataListResponse.data.notifications;
            const news = []

            // Lọc những thông báo chưa có trong mảng dataList
            const newNotifications = apiNotifications.filter(notification =>
              !dataList.some(dataNotification => dataNotification._id === notification._id)
            );

            // Thêm những thông báo mới vào mảng dataList
            news.push(...newNotifications);

            if (news.length != 0) {
              // Gọi API để cập nhật thông báo trên server
              await updateNotificationForUser(this.$store.getters.user._id, news)
                .then((response) => {
                  if (response.data.success) {
                    this.notifications = response.data.latestNotification;
                  } else {
                    console.error("Không thành công: ", response.data);
                  }
                })
                .catch((error) => {
                  console.error("Lỗi khi lấy thông báo: ", error);
                });
            }
            else {
              this.notifications = apiNotifications
            }

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
  },


}
</script>

<style lang="scss" scoped>
.notification-dropdown {
  width: 300px; // Điều chỉnh kích thước của dropdown theo mong muốn
  padding: 10px;
  max-height: 300px; // Điều chỉnh chiều cao tối đa của dropdown theo mong muốn
  overflow-y: auto; // Cho phép cuộn nếu nội dung quá nhiều
  background-color: #ffffff; // Màu nền của dropdown
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12), 0px 4px 4px rgba(0, 0, 0, 0.04);
  border-radius: 8px; // Điều chỉnh độ cong của các góc
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
