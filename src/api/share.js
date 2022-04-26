import {request} from "@/network/request";

export function addArticleShare(shareUserId, receiveUserId, articleId, validDay, isRevisable) {
  console.log(11111111111);
  console.log(shareUserId);
  console.log(receiveUserId);
  console.log(articleId);
  console.log(validDay);
  console.log(isRevisable);
  return request({
    url: '/share/addArticleShare',
    method: 'post',
    data: {
      shareUserId,
      receiveUserId,
      articleId,
      validDay,
      isRevisable,
    }
  })
}

export function getSharedArticleList(receiverId, pageSize, pageNum, keyword) {
  return request({
    url: '/share/getSharedArticleList',
    method: 'get',
    params: {
      receiverId,
      pageSize,
      pageNum,
      keyword
    }
  })
}
