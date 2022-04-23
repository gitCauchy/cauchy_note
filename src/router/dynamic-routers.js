const userRule = {
  path: '/user',
  component: () => import ('../views/admin/User')
}

const roleRule = {
  path: '/role',
  component: () => import ('../views/admin/Role')
}
const permissionRule = {
  path: '/permission',
  component: () => import('../views/admin/Permission')
}

const menuRule = {
  path: '/menu',
  component: () => import('../views/menu/Menu')
}

const articleRule = {
  path: '/article',
  component: () => import('../views/article/Article')
}

const userInfoRule = {
  path: '/userinfo',
  component: () => import('../views/userinfo/UserInfo')
}

const friendRule = {
  path: '/friend',
  component: () => import('../views/friend/Friend')
}

const shareRule = {
  path: '/share',
  component: () => import('../views/article/Share')
}

const ruleMapping = {
  'user': userRule,
  'role': roleRule,
  'permission': permissionRule,
  'menu': menuRule,
  'article': articleRule,
  'userinfo': userInfoRule,
  'friend': friendRule,
  'share': shareRule,
}

export {userRule, roleRule, permissionRule, menuRule, articleRule, userInfoRule, friendRule, shareRule, ruleMapping}
