import request from "@/utils/request";
const modelCode = "result_TrainingPoint";

export function getAll(schoolYear, department, className) {
  return request({
    url: `/${modelCode}/getCondition`, 
    method: "post", // Thay đổi phương thức thành POST
    data: {
      schoolYear: schoolYear,
      department: department,
      className: className
    }
  });
}


export function getDetailForUser(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "get",
  });
}

export function getSemester1Data(userId, schoolYear) {
    return request({
      url: `/${modelCode}/${userId}/${schoolYear}`,
      method: "get",
    });
}

export function updateSemester2AndWholeYear(userId, schoolYear, semester2Data,wholeYear) {
  return request({
    url: `/${modelCode}/update/${userId}/${schoolYear}`,
    method: "post",
    data: {
      semester2Data,
      wholeYear
    } 
  });
}


export function savePoint(data) {
  return request({
    url: `/${modelCode}`,
    method: "post",
    data,
  });
}
