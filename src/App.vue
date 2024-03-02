<template>
  <div id="app">
    <el-container style="">
      <el-header>
        <head-bar v-if="$route.path!=='/'">
        </head-bar>
      </el-header>
      <el-container>
        <div v-if="$route.path==='/'" style="position: fixed;top:0px;"><router-view> </router-view></div>
        <el-aside width="200px" v-if="$route.path!=='/'">  <side-bar></side-bar> </el-aside>
        <el-main> <router-view v-if="$route.path!=='/'"> </router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

</script>

<style>
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.el-header {
  height: 80px !important;
}
.el-aside {
  width: 200px !important;
  height: calc(100vh - 80px) !important;
  overflow-y: scroll;
}
.el-main {
  width: calc(100vw - 200px) !important;
  height: calc(100vh - 80px) !important;
  overflow-y: scroll;
}

.el-card > * > * {
  margin: 6px 0;
}

.operation-container {
  height: 60px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
}
.operation-container > * {
  margin: 0 10px;
}
.table-container {
  height: calc(100% - 100px);
  overflow-y: scroll;
}
.pagination-container {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.a-on {
  color: #409eff;
}
.a-off {
  color: #303133;
}

.a-title {
  color: #303133;
  font-size: 1.2em;
  padding: 0 6px;
}
.a-content {
  color: #606266;
  font-size: 0.8em;
  padding: 0 4px;
}
.a-subcontent {
  color: #909399;
  font-size: 0.6em;
  padding: 0 2px;
}
.a-light {
  color: white;
}


.head-card .el-card__body {
  height: inherit;
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
