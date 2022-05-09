import Vue from 'vue'
import Vuex from 'vuex'
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex)

const state = {
  isCollapse: false,
  currentMenu: null,
  messageStatus: false,
  tabList: [
    {
      path: '/',
      name: 'home',
      label: '首页',
      icon: 'home'
    }
  ],
  menu:[]
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {}
})
