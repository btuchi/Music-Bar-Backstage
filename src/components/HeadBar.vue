<template>
  <el-card class="head-card">
    <el-row style="width: calc(100vw - 80px);" type="flex" class="row-bg" justify="space-between">
      <el-col class="a-content" style="font-weight: bold;">
        Music Bar后台管理系统 &nbsp;&nbsp;{{currentTime.Format("yyyy-MM-dd hh:mm:ss")}}
      </el-col>

      <el-col style="text-align: right;">
        <i class="el-icon-user-solid" ></i>
        <span class="a-content" style="margin-right: 10px;">{{username}}</span>
        <i class="el-icon-s-tools" ></i>
        <span class="a-content" style="margin-right: 10px;">
          <span v-if="userscope === 'SUPERADMIN'">超级管理员</span>
          <span v-if="userscope === 'ADMIN'">普通管理员</span>
          <span v-else-if="userscope === 'USER'">普通用户</span>
        </span>

        <el-link @click="gotoIndex()" class="a-content" style="margin-right: 10px;">首页</el-link>
        <el-link @click="exit()" class="a-content" style="margin-right: 10px;">退出</el-link>

      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  require("../utils/date")
  export default {
    name: 'HeadBar',
    props: {
      title: String,
    },
    data() {
      return {
        currentTime:new Date(),
        username: '',
        userscope: '',
      }
    },
    created() {
      this.startCalculateCurrentTime()
      this.username = localStorage.getItem('user_name')
      this.userscope = localStorage.getItem('user_type')
    },
    methods: {
      startCalculateCurrentTime(){
        this.currentTime = new Date()
        setTimeout(()=>{
          this.startCalculateCurrentTime()
        },1000)
      },
      goBack() {
        this.$router.go(-1)
      },
      gotoIndex() {
        this.$router.push('/index')
      },
      gotoLogin() {
        this.$router.push('/')
      },
      exit() {
        localStorage.clear()
        this.gotoLogin()
      },
    },
  }
</script>

<style scoped>
  .head-card {
    height: 60px;
    margin: 10px 0;
  }
</style>