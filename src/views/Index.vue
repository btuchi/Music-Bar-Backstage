<template>
  <div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="14">
        <el-card class="welcome-card">
          <div class="a-title a-light">欢迎来到Music Bar后台</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="team-card">
          <div class="a-title a-light">研发团队</div>
          <div class="a-content">
            <span style="margin-right: 10px;">研发</span>
            <span class="a-light">2Hua</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="height:30px;"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        today_res:{},
        lastday_res:{},
      };
    },
    name: 'Index',
    async created() {

    },
    methods: {},
  };
</script>

<style scoped>
  .welcome-card {
    background-color: #409EFF;
    color: white;
    height: 120px;
  }
  .team-card {
    background-color: #67C23A;
    color: white;
    height: 120px;
  }

  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 90px;
  }
</style>