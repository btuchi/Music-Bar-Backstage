<template>
  <div class="container">
    <div class="title">Welcome</div>
    <el-card style="height: fit-content;">
      <div slot="header">
        <span>用户登陆</span>
      </div>
      <div>
        <el-form :model="loginInfo" :rules="rules" ref="loginInfo" label-width="80px">
          <el-form-item label="用户名" prop="account">
            <el-input v-model="loginInfo.account" placeholder="手机/邮箱/用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginInfo.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-button style="width: 100%;" type="primary" @click="onLogin">登陆</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Config from "../config";
import HTTP from '../utils/http';
    export default {
        data() {
            return {
                build: false,
                loginInfo: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, ],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, ],
                },
            }
        },
        name: 'Login',
        created() {
            this.build = Config.build
        },
        methods: {
            gotoDevelop() {

            },
            gotoProduction() {

            },
            onLogin() {
                this.$refs['loginInfo'].validate(async(valid) => {
                    if (valid) {
                        let info = this.$data.loginInfo
                        let res = await HTTP.request(
                          {
                            method: 'post',
                            url: '/user/login',
                            data:{
                              account:info.account, 
                              password:info.password,
                              type: '100'
                            }
                          }
                        )
                        console.log("登录成功", res)
                        localStorage.setItem('user_name',res.data.user_name)
                        localStorage.setItem('user_type',res.data.user_type)
                        localStorage.setItem('token', res.data.token)
                        this.$router.push('/index')
                    } else {
                        this.$message.error('请输入所有必填项目')
                    }
                })
            },
        },
    }
</script>

<style scoped>
    .title {
        font-size: 1.2em;
        margin-bottom: 40px;
    }
    
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>