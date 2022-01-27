<template>
  <div class= "test" id="#app">
    <router-view></router-view>
<!--    <login></login>-->
<!--    <Register></Register>-->
  </div>
</template>

<script>
import Login from "./components/Login";
import Register from "./components/Register";

export default {
  name: 'App',
  components: {
    Login,
    Register
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
