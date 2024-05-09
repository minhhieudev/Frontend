<template>
    <div>
        <div >  <!-- Bọc các phần tử bên trong vào một thẻ <div> -->
            <div
                style="font-weight: bold;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: 40px;color: blue;text-align: center">
                THÔNG TIN SINH VIÊN</div>
            <div class="infoUser d-flex align-items-center justify-content-center">
                <div class="info-content d-flex ">
                    <el-avatar  :src="dataUser.avatarUrl"></el-avatar>
                   <div>
                    <span class="lable-user mb-3">Tên: </span>&nbsp;
                    <span class="info-text mb-6">{{ dataUser.studentInfo.fullName }}</span>
                   </div>
                </div>
                <div class="info-content">
                    <span class="lable-user">Mã sinh viên: </span>&nbsp;
                    <span class="info-text">{{ dataUser.studentInfo.studentCode }}</span>
                </div>
                <div class="info-content">
                    <span class="lable-user">Email: </span>&nbsp;
                    <span class="info-text">{{ dataUser.studentInfo.email }}</span>
                </div>
                <div class="info-content">
                    <span class="lable-user">Lớp: </span>&nbsp;
                    <span class="info-text">{{ dataUser.studentInfo.className }}</span>
                </div>
                <div class="info-content">
                    <span class="lable-user">Khoa: </span>&nbsp;
                    <span class="info-text">{{ dataUser.studentInfo.department }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getInfoUser } from '@/api/user';


export default {
    data() {
        return {
            dataUser: [],
        };
    },
    created() {
        this.loadData();
    },
    mounted() {

    },
    methods: {
        async loadData() {
            const response = await getInfoUser(this.$store.getters.user._id);
            if (response.data.success) {
                this.dataUser = response.data.doc;

            } else {
                console.error("Lấy thông tin user thất bại ! ");
            }
        },
    },
}
</script>

<style>
.infoUser {
    text-align: center;
    font-size: larger
}

.custom-user {
    font-weight: bold;
    color: #f85f30;
}

.info-content {
    flex: 1;
    align-items: center;
}

.lable-user {
    font-weight: bold;
    color: #f85f30;
    width: 230px;
}

.info-text {
    font-weight: bold;
}
</style>