<template>
  <div class="app" id="#app">
    <router-view></router-view>
  </div>
</template>

<script>

import {initDynamicRouter} from "./router";

export default {
  name: 'App',
  components: {},
  created() {
    initDynamicRouter()
  }
}
</script>

<style type="text/css">
.app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
