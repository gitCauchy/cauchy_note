import {request} from "@/network/request";

export function getFriendList(userId, pageSize, pageNum) {
  return request({
    url: '/friend/getFriendList',
    method: 'get',
    params: {
      userId,
      pageSize,
      pageNum
    }
  })
}

export function addFriend(userId, friendId) {
  return request({
    url: '/friend/addFriend',
    method: 'get',
    params: {
      userId,
      friendId
    }
  })
}

export function deleteFriend(userId, friendId) {
  return request({
    url: '/friend/deleteFriend',
    method: "get",
    params: {
      userId,
      friendId
    }
  })
}

export function searchFriend(friendName) {
  return request({
    url: '/friend/searchFriend',
    method: 'get',
    params: {
      friendName
    }
  })
}
