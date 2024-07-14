import request from "@/utils/request";
const modelCode = 'user'

export function getCollection(data) {
  return request({
    url: `/${modelCode}/collection`,
    method: "post",
  });
}


export function getAll () {
  return request({
    url: `/${modelCode}`,
    method: 'get'
  })
}

export function handleDelete (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'delete'
  })
}

export function getDetail (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'get'
  })
}

export function saveData (data) {
  return request({
    url: `/${modelCode}`,
    method: 'post',
    data,
  })
}

export function updateAvatarUser (id,newUrl){
  return request({
    url: `/${modelCode}/updateAvatarUser/${id}`,
    method: 'post',
    data: {
      avatarUrl: newUrl,
    },
  })
}
export function updateNotificationForUser (id,notificationList){
  return request({
    url: `/${modelCode}/updateNotificationForUser/${id}`,
    method: 'post',
    data: {
      notifications: notificationList,
    },
  })
}
export function getNotification (id){
  return request({
    url: `/${modelCode}/getNotification/${id}`,
    method: 'get',
  })
}

export function addNotification(id, notification) {
  return request({
    url: `/${modelCode}/addNotification/${id}`,
    method: 'post',
    data: {
      notification: notification,
    },
  });
}

export function updateNotificationStatus(id) {
  return request({
    url: `/${modelCode}/updateNotificationStatus/${id}`,
    method: 'post',
  });
}

export function getInfoUser(id){
  return request({
    url: `/${modelCode}/getInfoUser/${id}`,
    method: 'get',
  })
}

export function deleteAnswer(id) {
  return request({
    url: `/${modelCode}/${id}`, 
    method: "delete",
  });
}

export function changePassword(id, currentPassword, newPassword) {
  return request({
    url: `/${modelCode}/changePassword/${id}`,
    method: 'post',
    data: {
      currentPassword,
      newPassword,
    },
  });
}