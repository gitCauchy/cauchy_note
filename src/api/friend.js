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

export function addFriendRequest(userId, friendId) {
  return request({
    url: '/friend/addFriendRequest',
    method: 'get',
    params: {
      userId,
      friendId
    }
  })
}

export function getFriendRequestList(userId) {
  return request({
    url: '/friend/getFriendRequestList',
    method: 'get',
    params: {
      userId
    }
  })
}

export function deleteFriendRequest(userId, friendId) {
  return request({
    url: '/friend/deleteFriendRequest',
    method: 'get',
    params: {
      userId,
      friendId
    }
  })
}

export function setRemarkName(userId, friendId, remarkName) {
  return request({
    url: '/friend/setRemarkName',
    method: 'get',
    params: {
      userId,
      friendId,
      remarkName,
    }
  })
}

export function agreeFriendRequest(messageId, senderId, receiverId) {
  return request({
    url: '/friend/agreeFriendRequest',
    method: 'get',
    params: {
      messageId,
      senderId,
      receiverId,
    }
  })
}

export function rejectFriendRequest(messageId, senderId, receiverId) {
  return request({
    url:'/friend/rejectFriendRequest',
    method:'get',
    params: {
      messageId,
      senderId,
      receiverId,
    }
  })
}
