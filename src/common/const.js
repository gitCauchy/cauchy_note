export const SystemStatusCode = {
  SUCCESS: 100000,
  FAIL: -200000,
  USERNAME_EXIST_ALREADY: -300000,
  USER_IS_FRIEND_ALREADY: -400002,
  ARTICLE_HAS_SHARED_ALREADY: -500000,

  // -------------- 消息类型 --------------
  /**
   * 好友验证
   */
  FRIEND_REQUEST_CHECK: 0,
  /**
   * 笔记分享
   */
  ARTICLE_SHARE: 1,
  /**
   * 站内消息
   */
  SHORT_MESSAGE: 2,
  /**
   * 添加好友反馈
   */
  FRIEND_REQUEST_CALLBACK: 3
}
