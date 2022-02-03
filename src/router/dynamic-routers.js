const userRule = {
  path: '/user',
  name: 'user',
  component: () => import ('../views/user/User')
}

const roleRule = {
  path: '/role',
  name: 'role',
  component: () => import ('../views/role/Role')
}
const permissionRule = {
  path: '/permission',
  name: 'permission',
  component: () => import('../views/permission/Permission')
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

const ruleMapping = {
  'user': userRule,
  'role': roleRule,
  'permission': permissionRule,
  'menu': menuRule,
  'article': articleRule,
}

export {userRule, roleRule, permissionRule, menuRule, articleRule, ruleMapping}
