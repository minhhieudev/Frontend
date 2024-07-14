import request from "@/utils/request";
const modelCode = 'statistic'



export function getStatistic () {
  return request({
    url: `/${modelCode}`,
    method: 'get'
  })
}
export function getConditionStatistic(semester, schoolYear) {
  return request({
    url: `/${modelCode}/${semester}/${schoolYear}`, // Thêm semester và schoolYear vào đường dẫn API
    method: 'get',
  })
}


export function saveDataStatistic (data) {
  return request({
    url: `/${modelCode}`,
    method: 'post',
    data,
  })
}



export function updateStatus(id, result) {
  return request({
    url: `/detailTrainingPoint/status/${id}`, // Địa chỉ API để cập nhật lượt thích
    method: "post",
    data: {
      result: result, // Thêm answersCount vào dữ liệu gửi đi
    },
  });
}


export function updateIsComplete() {
  return request({
    url: `/${modelCode}/updateComplete`, 
    method: "post",
  });
}

