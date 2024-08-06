<template>
    <div>
      <div>
        <el-form  :model="eqhouse" label-width="50px" :inline="true">
          <el-form-item label="城市">
            <el-radio-group v-model="eqhouse.city">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="A市"></el-radio-button>
              <el-radio-button label="B市"></el-radio-button>
              <el-radio-button label="C市"></el-radio-button>
              <el-radio-button label="D市"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房型">
            <el-select v-model="eqhouse.housetype" style="width: 120px;">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="一室" value="1室"></el-option>
              <el-option label="二室" value="2室"></el-option>
              <el-option label="三室" value="3室"></el-option>
              <el-option label="四室" value="4室"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="eqhouse.sort">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="整租"></el-radio-button>
              <el-radio-button label="合租"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="success" style="margin-left: 50px;" @click="Eqselect()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="eqhouse" label-width="80px" style="width: 80%;">
          <el-form-item label="租金范围" style="margin-bottom: 0;">
              <div class="block">
                <el-slider v-model="eqhouse.scope" range show-stops :max="5000" :min="0" :step="100" ></el-slider>
              </div>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-dialog title="预约看房" :visible.sync="dialogVisible" width="30%">
            <div class="block" style="display: flex; justify-content: center;">
              <el-date-picker v-model="appointmentTime" type="datetime" placeholder="请选择看房时间" default-time="9:00:00">
              </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
      </div>
      <div class="infinite-list-wrapper" style="overflow:auto;height: 400px;">
        <!-- 如果margin-top设置为0，则会自动触发load事件，不能实现无限滚动效果 -->
          <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" style="height: 600px;padding: 0; margin-top: 1px;">
              <li v-for="item in houses" class="list-item" :key="item.houseid">
                  <div class="shoudate" style="height: 100%; width: 100%;">
                    <div style="height: 90%;width: 140px;float: left;margin: 5px;">
                      <el-image 
                      style="width: 100%; height: 100%;" 
                      :src="'http://localhost:8888/api/files/'+item.img" 
                      :preview-src-list="['http://localhost:8888/api/files/'+item.img]">
                      </el-image>
                    </div>
                      <div class="intro">
                        <el-tooltip effect="dark" :content="item.intro" placement="top"><h3 class="intro-h3">{{ item.intro }}</h3></el-tooltip>
                        <p >{{ item.housetype }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{ item.area }}平米</p>
                        <el-tooltip effect="dark" :content="item.address" placement="top"><p class="p-address">{{item.city}}{{ item.address }}</p></el-tooltip>
                        <el-tag type="success" style="margin-top: 10px;">{{ item.level }}</el-tag>&nbsp;
                        <el-tag type="warning">{{item.sort}}</el-tag>
                      </div>
                      <div class="rent">
                        <el-row style="margin: 20px 0 20px 10px;"><el-button type="warning" @click="subscribe(item)">预约</el-button></el-row>
                        <el-row><h4 style="color: red;margin: 0;">{{ item.rent }}元/月</h4></el-row>
                      </div>
                  </div>
              </li>
          </ul>
          <h2 v-if="loading" style="text-align: center;">加载中...</h2>
          <h2 v-if="noMore" style="text-align: center;">没有更多了</h2>
      </div>
    </div> 
</template>
  
  <script>
import request from '@/utils/request'
    export default {
    data () {
      return {
        count: 0,//记录目前查询了多少条数据
        pageNum:1,//第几页
        pageSize:8,//每页条数，默认8条
        loading: false,
        houses:[],
        oneHouse:{},
        total:0,
        eqhouse:{
          city:'全部',
          scope:[0,5000],
          housetype:'全部',
          sort:'全部'
        },
        dialogVisible: false,
        appointmentTime:'',
        user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{},
        reserve:{
          houseid:'',
          rtime:'',
          status:'待审批',
          result:'无',
          appoint:'未签约'
        },//预定信息
      }
    },
    computed: {
      noMore () {
        return this.count >= this.total && !this.loading
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    created(){
      this.reserve.userid=this.user.userid;
      this.findBySearch();
    },
    methods: {
      findBySearch(){
        request.get("/house/findBySearch",{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          city:this.eqhouse.city,
          housetype:this.eqhouse.housetype,
          sort:this.eqhouse.sort,
          minrent:this.eqhouse.scope[0],
          maxrent:this.eqhouse.scope[1]
        }
      }).then(res=>{
        if(res.code==='0'){
          console.log(res);
          this.houses=this.houses.concat(res.data.records);
          this.count+=res.data.size;
          this.total=res.data.total;
        }
      })
      },
      Eqselect(){
        this.pageNum=1;
        this.houses=[];
        this.count=0;
        this.total=0;
        this.findBySearch();
      },
      load () {
        if(!this.noMore){
          this.loading=true;
          setTimeout(() => {
            this.loading = false;
            this.pageNum+=1;//当pageNum+1时，就查询下一页，实现无线滚动
            this.findBySearch();
          }, 2000)
        }
      },
      submit(){
        if(this.appointmentTime!==''){
          const date = new Date(this.appointmentTime);
          // 格式化日期
          this.reserve.rtime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          // 添加预约信息
          request.post("/reserve/addreserve",this.reserve).then(res=>{
            if(res.code==='0'){
              this.$message({
                message:"预约成功！",
                type:'success'
              })
              this.findBySearch();
            }
          })
          // 更新房子状态为预约中
          this.oneHouse.houserstatus='预约中';
          request.post("/house/updateH",this.oneHouse).then(res=>{
            
          })
          console.log(this.oneHouse)
          this.dialogVisible = false;
        }else{
          this.$message({
            message:"预定时间不能为空！",
            type:'error'
          })
        }
      
      },
      // 预约
      subscribe(item){
        this.dialogVisible = true;
        this.appointmentTime='';
        this.reserve.houseid=item.houseid;
        this.oneHouse=item;
      }
    }
  }
  </script>

<style>
.list-item{
  list-style: none;
  float: left;
  width: 47%;
  height: 130px;
  margin: 10px;
  background-color: white;
}
.list-item :hover{
  background-color: #f4f4f5;
}

p{
  margin: 0;
  padding: 0;
}
.p-address{
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;/*文本超出时用...表示*/
}
.rent{
  float: right;
}
.intro{
  float: left;
  margin-left: 10px;
}
.intro p{
  color: #474B4E;
  font-size: 14px ;
  font-family: PingFangSC-Regular;
  margin-top: 10px;
}
.intro-h3{
  width: 200px;
  margin: 0;
  padding: 0;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;/*文本超出时用...表示*/
}
</style>