const userRule = {
  path: '/user',
  name: 'user',
  component: () => import ('../views/admin/User')
}

const roleRule = {
  path: '/role',
  name: 'role',
  component: () => import ('../views/admin/Role')
}
const permissionRule = {
  path: '/permission',
  name: 'permission',
  component: () => import('../views/admin/Permission')
}

const menuRule = {
  path: '/menu',
  name: 'menu',
  component: () => import('../views/menu/Menu')
}

const articleRule = {
  path: '/article',
  name: 'article',
  component: () => import('../views/article/Article')
}

const userInfoRule = {
  path: '/userinfo',
  name: 'userinfo',
  component: () => import('../views/userinfo/UserInfo')
}

const friendRule = {
  path: '/friend',
  name: 'friend',
  component: () => import('../views/friend/Friend')
}

const shareRule = {
  path: '/share',
  name: 'share',
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
