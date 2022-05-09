import Cookie from 'js-cookie';

export default {
  CollapseMenu(state) {
    state.isCollapse = !this.state.isCollapse
  },
  selectMenu(state, val) {
    if (val.name === 'home') {
      this.state.currentMenu = null
    } else {
      this.state.currentMenu = val;
      let result = this.state.tabList.findIndex(item => item.name === val.name)
      result === -1 ? this.state.tabList.push(val) : ''
    }
  },
  closeTag(state, val) {
    let result = this.state.tabList.findIndex(item => item.name === val.name)
    this.state.tabList.splice(result, 1)
  },
  changeMessageStatus(state, status) {
    this.state.messageStatus = status;
  },
  setMenu(state, val) {
    state.menu = val;
    Cookie.set('menu', JSON.stringify(val));
  },
  clearMenu(state) {
    state.menu = [];
    Cookie.remove('menu');
  },
  addMenu(state, router) {
    if (!Cookie.get('menu')) {
      return
    }
    const menu = JSON.parse(Cookie.get('menu'));
    state.menu = menu;
    const menuArray = [];
    menu.forEach(item => {
      if (item.children) {
        item.children = item.children.map(item => {
          item.component = () => import(`../views/${item.url}`)
          return item
        })
        menuArray.push(...item.children)
      } else {
        item.component = () => import(`../views/${item.url}`)
        menuArray.push(item)
      }
    });
    // 路由的动态添加
    menuArray.forEach(item=>{
      router.addRoute('Main',item)
    })
  }
}
