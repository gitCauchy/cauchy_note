import {request} from "@/network/request";

export function addFriendRequestMessage(senderId, receiverId, messageType, messageInfo, status) {
  return request({
    url: '/message/addNewMessage',
    method: 'post',
    data: {
      senderId,
      receiverId,
      messageType,
      messageInfo,
      status,
    }
  })
}

export function getMessageList(userId) {
  return request({
    url: '/message/getMessageList',
    method: 'get',
    params: {
      receiverId: userId
    }
  })
}

export function readMessage(id) {
  return request({
    url: '/message/readMessage',
    method: 'get',
    params: {
      id
    }
  })
}

export function getMessageCount(userId){
  return request({
    url:'/message/getMessageCount',
    method:'get',
    params:{
      userId
    }
  })
}
