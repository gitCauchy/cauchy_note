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
