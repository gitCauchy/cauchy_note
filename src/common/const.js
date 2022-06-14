export const SystemStatusCode = {
  /**
   * 成功
   */
  SUCCESS: 100000,
  /**
   * 失败
   */
  FAIL: -200000,
  /**
   * 用户名已经存在
   */
  USERNAME_EXIST_ALREADY: -300000,
  /**
   * 邮箱已被注册
   */
  EMAIL_REGISTERED_ALREADY: -300001,
  /**
   * 密码不合法
   */
  PASSWORD_ILLEGAL: -300006,
  // --------------------------------------------------
  /**
   * 该用户已经是好友
   */
  USER_IS_FRIEND_ALREADY: -400002,
  // ------------------------------------------------
  /**
   * 文章已经被分享
   */
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
