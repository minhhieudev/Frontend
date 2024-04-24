<template>
    <div> <!-- Bọc các phần tử bên trong vào một thẻ <div> -->
        <div
            style="font-weight: bold;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: larger;color: blue;text-align: center">
            DANH SÁCH THÔNG BÁO</div>
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <el-avatar :src="notification.user.avatarUrl"></el-avatar>
            <div class="notification-content">
                <span class="notification-author">{{ notification.user.fullname }}</span>&nbsp;
                <span class="notification-text">{{ notification.content }}</span>
            </div>
        </div>
    </div>
</template>


<script>
import { updateNotificationForUser, getNotification } from '@/api/user';
import { getAll } from '@/api/notification';


export default {
    data() {
        return {
            notifications: [],
        };
    },
    created() {
        this.loadData();
    },
    mounted() {

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
                        this.notifications = dataList.reverse();


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

<style>
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
    color: #f85f30;
}

.notification-text {
    font-weight: bold;
}
</style>