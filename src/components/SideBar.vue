<template>
  <el-menu class="menu" :default-openeds="defaultOpeneds" @select="handleSelect" :default-active="this.$route.path"
    @open="openSubMenu" @close="closeSubMenu">
    <el-menu-item index="/index">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="0">
      <template slot="title"><i class="el-icon-s-shop"></i>用户管理</template>
        <el-menu-item-group>
            <el-menu-item index="/user">账号管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <el-menu-item index="/coupon">优惠券管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <el-menu-item index="/user_coupon">用户优惠券管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
     <el-submenu index="1">
          <template slot="title"><i class="el-icon-s-shop"></i>门店管理</template>
            <el-menu-item-group>
                <el-menu-item index="/branch">门店管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
                <el-menu-item index="/activity">活动管理</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
                <el-menu-item index="/commodity">商品管理</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-s-shop"></i>海报管理</template>
      <el-menu-item-group>
        <el-menu-item index="/poster">海报管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

</el-menu>
</template>

<script>
    import Config from '../config'
    import Cookie from "../utils/cookie";
    export default {
        name: 'SideBar',
        data() {
            return {
                userscope: '',
                scopeLevel: 0,
                defaultOpeneds: [],
                defaultStrOpeneds: "",
            }
        },
        created() {
            this.defaultStrOpeneds = this.$store.state.defaultOpeneds
            this.userscope = this.$store.state.userInfo.userscope
            this.scopeLevel = Config.userScope[this.userscope]

            this.defaultStrOpeneds = Cookie.getCookie('defaultStrOpeneds');
            if (!this.defaultStrOpeneds) {
                this.defaultOpeneds = ['0'];
                Cookie.setCookie('defaultStrOpeneds', '0', 7);
            } else {
                this.defaultOpeneds = this.convertStr2Array(this.defaultStrOpeneds);
            }
        },
        methods: {
            convertStr2Array(str) {
                const arr = str.split(',');
                return arr;
            },
            convertArray2Str(arr) {
                let str = '';
                for (let i = 0; i < arr.length; i++) {
                    str = str + arr[i] + ',';
                }
                return str;
            },
            openSubMenu(index) {
                this.defaultStrOpeneds = Cookie.getCookie("defaultStrOpeneds");
                this.defaultStrOpeneds = this.defaultStrOpeneds + "," + index;
                Cookie.setCookie("defaultStrOpeneds", this.defaultStrOpeneds, 7);
            },
            closeSubMenu(index) {
                this.defaultStrOpeneds = Cookie.getCookie("defaultStrOpeneds");
                let defaultOpeneds = this.convertStr2Array(this.defaultStrOpeneds);
                const id = defaultOpeneds.indexOf(index + "");
                defaultOpeneds.splice(id, 1);
                let newdefaultStrOpeneds = this.convertArray2Str(defaultOpeneds);
                Cookie.setCookie("defaultStrOpeneds", newdefaultStrOpeneds, 7);
            },
            handleSelect(key) {
                this.$router.push(key)
            },
        },
    }
</script>

<style scoped>
    .menu {
        border: 0;
    }
</style>