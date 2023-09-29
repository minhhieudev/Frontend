import request from '@/utils/request'
import { getOne } from '@/utils/app'

export function login (form) {
  const trustHash = getOne('auth', 'trust_computer_hash')
  if (trustHash) {
    form.trust_hash = trustHash
  }
  return request({
    url: '/auth/signin',
    method: 'post',
    data: form
  })
}

export function register () {
  return request({
    url: '/auth/register',
    method: 'post'
  })
}

export function logout () {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function sendVerificationCode(params) {
  return request({
    url: '/auth/send-verification-code',
    method: 'get',
    params: params,
  })
}

export function verifyCode(params) {
  return request({
    url: '/auth/verify-code',
    method: 'get',
    params: params
  })
}


export function forgotPassword(params) {
  return request({
    url: '/auth/forgot-password',
    method: 'get',
    params: params
  })
}

export function saveNewPassword(params) {
  return request({
    url: '/auth/forgot-password',
    method: 'post',
    data: params
  })
}
