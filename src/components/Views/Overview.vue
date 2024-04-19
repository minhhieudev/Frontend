<template>
  <div id="dashboard" v-loading="loading" >
    <div class="container  ">
      <div class="intro text-center ">
        <h1 class="text-2xl font-bold title pt-4">CHÀO MỪNG BẠN ĐẾN VỚI PHẦN MỀM CỐ VẤN HỌC TẬP</h1>
        <p class="text-gray-600 leading-relaxed mb-4">
          Hãy dẫn đầu trong cuộc hành trình học tập của bạn với phần mềm quản lý học tập đột phá của chúng tôi. Với sứ
          mệnh làm cho việc học trở nên dễ dàng và đầy sáng tạo, nền tảng của chúng tôi đã được thiết kế với một mục
          tiêu duy nhất: giúp bạn tổ chức tài liệu học tập của mình một cách có hệ thống,
          theo dõi tiến trình một cách trực quan và đạt được mục tiêu học tập của mình một cách hiệu quả và đáng nhớ.
        </p>
        <p class="text-gray-600 mb-4">Các tính năng chính:</p>
        <ul class="text-gray-600 mb-4">
          <li><span class="text-blue-500">•</span> Tổ chức tài liệu học tập vào các khóa học và chủ đề</li>
          <li><span class="text-blue-500">•</span> Theo dõi tiến trình với biểu đồ và đồ thị tương tác</li>
          <li><span class="text-blue-500">•</span> Đặt mục tiêu và nhận được các đề xuất cá nhân hóa</li>
          <li><span class="text-blue-500">•</span> Hợp tác với bạn bè thông qua diễn đàn thảo luận và nhóm học tập</li>
        </ul>
      </div>

      <div class="author-contact text-center">
        <div class="author-info">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">By: minhhieudev</h2>
          <p class="text-gray-600 leading-relaxed mb-4">Xin chào, tôi là [Tên của Bạn], nhà phát triển đằng sau phần mềm
            quản lý học tập này. Tôi đam mê tạo ra các công cụ giúp việc học tập trở nên dễ dàng và thú vị hơn cho mọi
            người.</p>
          <p class="text-gray-600 mb-4">Kết nối với tôi:</p>
          <ul class="text-blue-500 mb-4">
            <li class="inline"><a href="mailto:your.email@example.com" class="underline">minhhieudev31@gmail.com</a></li>
            <li class="inline"><a href="https://linkedin.com/in/yourprofile" class="underline">0788676320</a></li>
            <!-- Thêm các tùy chọn liên hệ khác nếu cần -->
          </ul>
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
.title{
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: white;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
}
#dashboard{
background: url(../../assets/22.jpg) no-repeat ; 
background-size: 100% 100%;
height: 85vh;

}
</style>
