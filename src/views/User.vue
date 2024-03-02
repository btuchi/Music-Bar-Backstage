<template>
  <el-container>
    <el-main>
      <div class="operation-container">
        <el-button type="primary" @click="showAddDrawer" plain>新增管理员</el-button>
        <el-select v-model="user_type" placeholder="请选择" @change="onUserTypeChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="user_id" label="ID" width="60">
          </el-table-column>
          <el-table-column prop="user_name" label="用户名" width="120">
          </el-table-column>
          <el-table-column prop="user_phone" label="用户手机号" width="120">
          </el-table-column>
          <el-table-column prop="user_email" label="用户邮箱" width="120">
          </el-table-column>
          <el-table-column prop="user_points" label="用户当前积分" width="120">
          </el-table-column>
          <el-table-column prop="user_accumulated_points" label="用户累计积分" width="120">
          </el-table-column>
          <el-table-column prop="user_birthday" label="用户生日" width="120">
          </el-table-column>
          <el-table-column prop="user_balance" label="用户余额" width="120">
          </el-table-column>
          <el-table-column prop="user_type" label="权限身份" width="120">
          </el-table-column>
          <el-table-column prop="user_avatar" label="用户头像" width="120">
            <template slot-scope="scope">
              <img :src="scope.row.user_avatar" width="80" />
            </template>
          </el-table-column>

          <el-table-column prop="" label="绑定门店" width="120">
            <template slot-scope="scope">
              {{ scope.row.branch ? scope.row.branch.branch_name :"暂无"}}
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="page + 1"
          :page-sizes="[10, 20, 50, 100, 200, 400]" :page-size="count" layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-main>

    <el-drawer :title="'添加用户账号'" :visible.sync="drawer" direction="ltr" size="60%">
      <el-form label-width="120px" style="margin: 20px;">
        <el-form-item label="用户名" prop="priority">
          <el-input v-model="userInfo.user_name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="priority">
          <el-input v-model="userInfo.user_email" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="priority">
          <el-input v-model="userInfo.user_phone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="priority">
          <el-input v-model="userInfo.user_password" show-password placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="priority">
          <el-select v-model="userInfo.user_type" placeholder="请选择">
            <el-option v-for="item in user_type_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定门店" prop="priority" v-if="userInfo.user_type == 'ADMIN'">
          <el-select v-model="userInfo.bind_branch_id" placeholder="请选择">
            <el-option v-for="item in branchOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button style="width: 100%;" type="primary" @click="addAdminUser">添加用户</el-button>
      </el-form>
    </el-drawer>
  </el-container>
</template>

<script>

import HTTP from '../utils/http.js'

export default {
  data() {
    return {
      tableData: [],
      count: 10,
      page: 0,
      totalCount: 0,
      userDetailInfo: {},
      dialogVisible: false,
      drawer: false,
      userInfo: {
        user_name: null,
        user_email: null,
        user_phone: null,
        user_password1: null,
        user_password2: null,
        user_type: null,
        bind_branch_id: null
      },
      current_user_id: 1,
      user_type_options: [{
        value: "SUPERADMIN",
        label: "超级管理员(64)"
      },
      {
        value: "ADMIN",
        label: "门店管理员(32)"
      }],
      user_type: "USER",
      options: [{
        value: 'SUPERADMIN',
        label: '超级管理员'
      }, {
        value: 'ADMIN',
        label: '门店管理员'
      }, {
        value: 'USER',
        label: '普通用户'
      }],
      branchOptions: []
    }
  },
  name: 'User',
  created() {
    this.getUserList()
    this.getBranchList()
  },
  methods: {
    onUserTypeChange(val) {
      this.user_type = val
      this.getUserList()
    },
    handleSizeChange(val) {
      this.count = val
      this.page = 0
      this.getUserList()
    },
    showAddDrawer() {
      this.userInfo = {
        user_name: null,
        user_email: null,
        user_phone: null,
        user_password1: null,
        user_password2: null,
        user_type: null
      }
      this.drawer = true
    },
    handlePageChange(e) {
      this.page = e - 1
      this.getUserList()
    },
    handlePageRefresh() {
      this.page = 0
      this.getUserList()
    },
    async getUserList() {
      let res = await HTTP.request({
        url: '/admin/user/list',
        method: 'get',
        params: {
          page: this.page * this.count,
          count: this.count,
          user_type: this.user_type
        }
      })
      console.log("res", res)

      this.totalCount = res.data.all_count
      this.tableData = res.data.data

    },

    async getUserList() {
      let res = await HTTP.request({
        url: '/admin/user/list',
        method: 'get',
        params: {
          offset: this.page * this.count,
          limit: this.count,
          user_type: this.user_type
        }
      })
      console.log("res", res)

      this.totalCount = res.data.all_count
      this.tableData = res.data.data
    },

    toggleDrawerShow() {
      this.drawer = !this.drawer
    },
    addAdminUser() {
      let res = HTTP.request({
        url: '/admin/user/add',
        method: 'post',
        data: this.userInfo
      })
      if (res.code == 0) {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
      }
      this.drawer = false
      this.getUserList()
    },
    async getBranchList() {
      let res = await HTTP.request({
        url: '/admin/branch/list',
        method: 'get',
        params: {
          offset: 0,
          limit: 1000000
        }
      })
      this.branchList = res.data.data
      for (let i = 0; i < this.branchList.length; i++) {
        this.branchOptions.push({
          value: this.branchList[i].branch_id,
          label: this.branchList[i].branch_name
        })

      }
    }
  }
}
</script>

<style scoped></style>