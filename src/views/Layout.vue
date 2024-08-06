<template>
    <div>
    <el-container>
      <el-header>
        <img src="@/assets/房屋出租.png" alt="" style="width: 40px; position: relative; top: 10px;">
        <span style="font-size: 20px; margin-left: 15px; color: white;">房屋租赁系统</span>
        <el-dropdown style="float: right; line-height: 60px; height: 60px;">
          <span class="el-dropdown-link" style="color: white; font-size: 16px;">{{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="logout()">退出</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>

    <el-container>
      <el-aside>
        <el-menu
          :default-active="$route.path" router
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">

          <el-menu-item index="/homepage">
            <img src="@/assets/首页.png" alt="">
            <span slot="title">首页</span>
          </el-menu-item>

          <el-menu-item index="/userhouse" v-if="user.role==='租客'">
            <img src="@/assets/房源（租客）.png" alt="">
            <span slot="title">房源</span>
          </el-menu-item>

        <el-menu-item index="/ureserve" v-if="user.role==='租客'">
            <img src="@/assets/我的预约.png" alt="">
            <span slot="title">我的预约</span>
        </el-menu-item>

        <el-menu-item index="/userorder" v-if="user.role==='租客'">
          <img src="@/assets/我的租赁.png" alt="">
          <span slot="title">我的租赁</span>
        </el-menu-item>

        <el-menu-item index="/userrepair" v-if="user.role==='租客'">
          <img src="@/assets/我的报修.png" alt="">
          <span slot="title">我的报修</span>
        </el-menu-item>

        <el-submenu index="2" v-if="user.role==='租客'">
          <template slot="title">
            <img src="@/assets/个人中心.png" alt="">
            <span>个人中心</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/My">个人信息</el-menu-item>
            <el-menu-item index="/MyPw">修改密码</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

          <el-menu-item index="/adminhouse" v-if="user.role==='管理员'">
            <img src="@/assets/房源（管理员）.png" alt="">
            <span slot="title">房源</span>
        </el-menu-item>

        <el-menu-item index="/uuser" v-if="user.role==='管理员'">
          <img src="@/assets/用户.png" alt="">
          <span slot="title">用户</span>
        </el-menu-item>

        <el-submenu index="5" v-if="user.role==='管理员'">
          <template slot="title">
            <img src="@/assets/审批.png" alt="">
            <span>审批</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/areserve">看房申请</el-menu-item>
            <el-menu-item index="/quitapply">退租申请</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="" v-if="user.role==='管理员'">
          <template slot="title">
            <img src="@/assets/租房.png" alt="">
            <span>租房</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/renting">在租</el-menu-item>
            <el-menu-item index="/quitorder">已退租</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item index="/adminrepair" v-if="user.role==='管理员'">
          <img src="@/assets/报修.png" alt="">
          <span slot="title">报修</span>
        </el-menu-item>

    </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    </div>
</template>
<script>
export default {
    name:"Layout",
    data(){
      return{
        user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}//如果没有对象，则给一个空对象
      }
    },
    methods:{
      logout(){
        localStorage.removeItem("user");
        this.$router.push("/login");
        this.$message({
            message:"退出成功",
            type:'success'
          })
      }
    }
}
</script>
<style>
    .el-header{
    background-color: #4c535a;
    color: #333;
    /* text-align: center; */
    /* line-height: 60px; */
  }
  
  .el-aside{
    background-color: #545c64;
    color: #333;
    width:180px !important;
    /* !important可以提高样式的优先级 */
    /* text-align: center; */
    min-height: 100vh;
    overflow: hidden;
  }
  
  .el-main{
    background-color: #E9EEF3;
    color: #333;
    height: 600px;
    /* text-align: center; */
    /* line-height: 160px; */
  }
  
  .el-menu{
    border-right: none !important;
  }
  .el-aside .el-menu .el-menu-item img ,.el-aside .el-menu .el-submenu img{
  width: 20px;
  height: 20px;
  }
  .el-menu-item span ,.el-submenu span{
    margin-left: 15px;
  }
  .el-menu-item{
    margin-left: 0;
    margin-right: 0;
  }
</style>