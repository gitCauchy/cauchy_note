<template>
  <el-container style="height: 100%">
    <el-aside width="auto">
      <common-aside/>
    </el-aside>
    <el-container>
      <el-header>
        <common-header/>
      </el-header>
      <common-tag/>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "../components/CommonAside";
import CommonHeader from "../components/CommonHeader";
import CommonTag from "../components/CommonTag";

export default {
  name: "Main",
  components: {
    CommonAside,
    CommonHeader,
    CommonTag
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background: #cccccc;
}

.el-main {
  padding-top: 0;
}

.el-aside {
  height: 100%;
}

</style>
