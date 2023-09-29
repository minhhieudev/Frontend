import request from '@/utils/request'

export function firstRequest () {
  return request({
    url: '/helper/init',
    method: 'get',
  })
}

export function getOverviewData() {
  return request({
    url: '/helper/dashboard',
    method: 'get'
  })
}
