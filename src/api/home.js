import {request} from "@/network/request";

export function getCountData(authorId) {
  return request({
    url: '/article/getCountData',
    method: 'get',
    params: {
      authorId
    }
  })
}

export function getTableData() {
  return request({
    url: '/article/getTableData',
    method: 'get',
  })
}

export function getTrendData() {
  return request({
    url: '/article/getTrendData',
    method: 'get',
  })
}
