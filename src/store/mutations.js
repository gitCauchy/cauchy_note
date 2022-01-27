export default {
  CollapseMenu(state) {
    this.state.isCollapse = !this.state.isCollapse
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
  setMenuList(state, menuList) {
    this.state.userMenuList = menuList;
    sessionStorage.setItem("userMenuList", JSON.stringify(menuList))
  }
}
