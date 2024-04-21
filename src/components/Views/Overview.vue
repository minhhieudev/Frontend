<template>
  <div id="dashboard" v-loading="loading">
    <div class="container  ">
      <div class="intro text-center content-page">
        <h1 class=" font-bold title p-5">CHÀO MỪNG BẠN ĐẾN VỚI PHẦN MỀM CỐ VẤN HỌC TẬP</h1>
        <p class="text-gray-600 leading-relaxed  mt-8">
            Phần mềm được xây dựng dựa trên công nghệ hiện đại, mang lại hiệu suất cao và khả năng mở rộng, đáp ứng
          nhu cầu quản lý và hỗ trợ học tập.
            Thiết kế giao diện người dùng thân thiện, dễ sử dụng, giúp cố vấn và sinh viên nhanh chóng nắm bắt thông
          tin.

        </p>
        <p class="text-gray-600 leading-relaxed  mt-8">
            Nó giúp tối ưu hóa
          quy trình tư vấn học tập, giúp các cố vấn có thể dễ dàng theo dõi và hỗ trợ sinh viên một cách kịp thời và
          chính xác hơn. Phần mềm được xây dựng với các chức năng chính: quản lý thông tin sinh viên và cố vấn, hỗ trợ
          giải đáp cho sinh viên, quản lý các tài liệu và bài đăng, đánh giá và quản lý điểm rèn luyện, hỗ trợ tra cứu
          thông tin cho sinh viên.
        </p>
      </div>

      <div class="author-contact text-center">
        <div class="author-info">
          <p class="text-2xl font-bold text-gray-800 mb-4 contact-auth">BY: minhhieudev</p>
          <div class="contact">
            <div class="d-flex">
              <p>Email:</p>
              <p class="text-contact">minhhieudev31@gmail.com</p>
            </div>
            <div class="d-flex">
              <p>Phone:</p>
              <p class="text-contact">0788676320</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- Thêm các thành phần khác ở đây -->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: false
    };
  },
  created() { },
  computed: {},
  methods: {
    reloadData() {
      this.$wrLoading(true);
      setTimeout(() => this.$wrLoading(false), 1000);
    },
  },
};
</script>

<style scoped>
/* Thêm các tùy chỉnh CSS cụ thể cho các phần cần thiết nếu cần */
.title {
  font-size: xx-large;
  font-family: 'Lobster', cursive;
  color: rgb(255, 255, 255);
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
}

#dashboard {
  background: url(../../assets/22.jpg) no-repeat;
  background-size: 100% 100%;
  height: 87vh;

}

.contact {
  font-weight: bold;
  display: flex;
  justify-content: space-around;
  font-family: 'Patrick Hand', cursive;
}

.text-contact {
  color: rgb(30, 194, 8);
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
}

.contact-auth {

  font-family: 'Patrick Hand', cursive;
  font-weight: bold;
  color: rgb(236, 30, 99);
  font-size: xx-large;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;

}

.content-page {
  height: 60vh;
  font-family: 'Roboto Mono', monospace;
  font-size: larger;
  font-weight: bold;
  padding-top: 1rem
}
</style>
