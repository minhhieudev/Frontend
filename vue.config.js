module.exports = {
  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/admin/_variables.scss";'
      }
    }
  },
  productionSourceMap: false,
  outputDir: '../html',
  devServer: {
    port: 8081
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/phan-mem-co-van-hoc-tap-dev/' // Thay tên repository của các bạn vào đây nhé
  : '/'
}
