import {request} from "@/network/request";

export function getRecycleArticleList(authorId, pageSize, pageNum, keyword) {
  return request({
    url: '/recycle/getRecycleArticleList',
    method: 'get',
    params: {
      authorId,
      pageSize,
      pageNum,
      keyword
    }
  })
}

export function restoreArticle(id) {
  return request({
    url: '/recycle/restoreArticle',
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteArticlePhysical(id) {
  return request({
    url: '/recycle/deleteArticlePhysical',
    method: 'get',
    params: {
      id
    }
  })
}

export function restoreAllArticle(authorId) {
  return request({
    url: '/recycle/restoreAllArticle',
    method: 'get',
    params: {
      authorId
    }
  })
}

export function deleteAllArticlePhysical(authorId) {
  return request({
    url: '/recycle/deleteAllArticlePhysical',
    method: 'get',
    params: {
      authorId
    }
  })
}
