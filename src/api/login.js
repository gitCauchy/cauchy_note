import {request} from "@/network/request";

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function register(username, password, email) {
  return request({
    url: '/register',
    method: 'post',
    data: {
      username,
      password,
      email
    }
  })
}

export function sendCheckCode(username) {
  return request({
    url: '/user/sendCheckCode',
    method: 'get',
    params: {
      username
    }
  })
}

export function resetPassword(username, newPassword, checkCode) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data: {
      username,
      newPassword,
      checkCode
    }
  })
}

export function checkToken(token, username) {
  return request({
    url: '/checkToken',
    method: 'get',
    headers: {
      token,
      username
    }
  })
}
