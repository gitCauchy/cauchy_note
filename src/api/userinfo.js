import {request} from "@/network/request";

export function modifyPassword(username, oldPassword, newPassword) {
  return request({
    url: '/user/modifyPassword',
    method: 'post',
    data: {
      username,
      oldPassword,
      newPassword,
    }
  })
}

export function saveProfile(userId, nickName, gender, telephone, address, birthday) {
  return request({
    url: '/profile/modifyProfile',
    method: 'post',
    data: {
      userId,
      nickName,
      gender,
      telephone,
      address,
      birthday,
    }
  })
}

export function getProfile(userId) {
  return request({
    url: '/profile/getProfile',
    method: 'get',
    params: {
      userId
    }
  })
}

export function modifyEmail(username, checkCode, newEmail) {
  return request({
    url: '/user/modifyUserEmail',
    method: 'post',
    data: {
      username,
      checkCode,
      newEmail,
    }
  })
}
