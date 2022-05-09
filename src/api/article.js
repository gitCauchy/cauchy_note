import {request} from "@/network/request";

export function getArticleList(authorId, pageSize, pageNum, keyword) {
  return request({
    url: '/article/getArticleList',
    method: 'get',
    params: {
      authorId,
      pageSize,
      pageNum,
      keyword
    }
  })
}

export function deleteArticle(id) {
  return request({
    url: '/article/deleteArticle',
    method: "get",
    params: {
      id
    }
  })
}

export function modifyArticle(id, title, content) {
  return request({
    url: '/article/modifyArticle',
    method: 'post',
    data: {
      id,
      title,
      content
    }
  })
}

export function addArticle(title, content, authorId) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data: {
      title,
      content,
      authorId,
    }
  })
}

export function exportWord(id) {
  return request({
    url: '/article/exportArticle/',
    method: 'get',
    params:{
      id
    },
    responseType: 'blob',
  })
}
