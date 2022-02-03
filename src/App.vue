<template>
  <div class="test" id="#app">
    <router-view></router-view>
  </div>
</template>

<script>

import {ruleMapping} from "./router/dynamic-routers";

export default {
  name: 'App',
  components: {},
  created() {
    const currentRoutes = this.$router.options.routes
    const menuList = this.$store.state.userMenuList;
    menuList.forEach(item => {
      const tmp = ruleMapping[item.name]
      currentRoutes[3].children.push(tmp)
    })
    this.$router.addRoutes(currentRoutes)
  }
}
</script>

<style type="text/css">
.test {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
