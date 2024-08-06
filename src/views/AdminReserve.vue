<template>
    <div>
      <div>
        <el-form label-width="100px" :inline="true">
          <el-form-item label="租客电话">
              <el-input v-model="userphone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" style="margin-left: 50px;" @click="chaxun()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
            <el-table :data="reservelist"  height="455" style="width: 100%;" >
                <el-table-column type="expand">
                <template v-slot="props">
                  <div style="width: 100%;margin: 0 0px;">
                    <div style="width: 50%;height: 200px;float: left;background-color: oldlace;padding: 10px 10px 10px 30px;">
                      <el-form :inline="true" label-width="80px">
                        <el-form-item label="姓名:">{{ props.row.user.username }}</el-form-item>
                        <el-form-item label="性别:">{{ props.row.user.sex }}</el-form-item>
                        <el-form-item label="年龄:">{{ props.row.user.age }}</el-form-item>
                        <el-form-item label="房屋图:">
                              <el-image 
                              style="width: 200px; height: 120px;" 
                              :src="'http://localhost:8888/api/files/'+props.row.house.img" 
                              :preview-src-list="['http://localhost:8888/api/files/'+props.row.house.img]">
                              </el-image>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div style="width: 50%;height: 200px; background-color: #f0f9eb; float: right;padding: 10px 10px 10px 30px;">
                      <el-form>
                        <el-form-item label="户型 | 面积:">{{ props.row.house.housetype }} | {{ props.row.house.area }}平米</el-form-item>
                        <el-form-item label="楼层 | 租金:">{{ props.row.house.level }} | {{ props.row.house.rent }}元/月</el-form-item>
                        <el-form-item label="城市 | 类型:">{{ props.row.house.city }} | {{ props.row.house.sort }}</el-form-item>
                        <el-form-item label="地址:">{{ props.row.house.address }}</el-form-item>
                      </el-form>
                    </div>
                  </div>
                  </template>
                </el-table-column>
                <el-table-column label="租客电话" prop="user.phone" width="120px" align="center" ></el-table-column>
                <el-table-column label="看房时间" prop="rtime" align="center" width="150px"></el-table-column>
                <el-table-column label="状态" prop="status" align="center" width="100px">
                  <template v-slot="props">
                  <el-tag v-if="props.row.status==='待审批'" type="warning">{{ props.row.status}}</el-tag>
                  <el-tag v-if="props.row.status==='同意'" type="success">{{ props.row.status}}</el-tag>
                  <el-tag v-if="props.row.status==='不同意'" type="danger">{{ props.row.status}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column label="审批" prop="desc" align="center" width="200px">
                  <template v-slot="props">
                    <el-button v-if="props.row.status==='待审批'" type="success" size="mini" @click="Yes(props.row)">同意</el-button>
                    <el-button v-if="props.row.status==='待审批'" type="danger" size="mini" @click="No(props.row)">不同意</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="看房结果" prop="result" align="center" width="100px">
                  <template v-slot="props">
                    <el-tag v-if="props.row.result==='无'" :type="'info'">{{ props.row.result}}</el-tag>
                    <el-tag v-if="props.row.result==='满意'" type="success">{{ props.row.result}}</el-tag>
                    <el-tag v-if="props.row.result==='不满意'" type="danger">{{ props.row.result}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="desc" align="center">
                  <template v-slot="props">
                    <el-button v-if="props.row.result==='满意'&&props.row.appoint==='未签约'" type="primary" size="mini" @click="qianyue(props.row)">邀请签约</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="签约" prop="appoint" align="center">
                  <template v-slot="props">
                  <el-tag v-if="props.row.appoint==='未签约'" :type="'info'">{{ props.row.appoint}}</el-tag>
                  <el-tag v-if="props.row.appoint==='待应约'" :type="'warning'">{{ props.row.appoint}}</el-tag>
                  <el-tag v-if="props.row.appoint==='已签约'" :type="'success'">{{ props.row.appoint}}</el-tag>
                  <el-tag v-if="props.row.appoint==='已拒绝'" :type="'danger'">{{ props.row.appoint}}</el-tag>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
          <el-dialog title="房屋租赁合同" :visible.sync="centerDialogVisible" width="70%" center>
            <el-form :model="contract">
              <el-form-item>
                <el-row class="row-margin">甲方（出租方）:<el-input v-model="contract.lessor" size="mini" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<el-input v-model="contract.lnumber" size="mini" style="width: 200px;"></el-input></el-row>
                <el-row class="row-margin">乙方（承租方）:<span style="width: 100px; display: inline-block;"></span>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<span style="width: 200px; display: inline-block;"></span></el-row>
                <el-row class="row-margin">出租之房屋（店面）座落于<u><b>{{ getHouse('city') }}{{ getHouse('address') }}</b></u>。建筑面积<u><b>{{ getHouse('area') }}</b></u>平米。室内设备包括<el-input v-model="contract.furniture" size="mini" style="width: 200px;"></el-input>。甲、乙双方就上述房屋（店面）友好协商，达成下列条款，以资共同遵守履行。</el-row>
                <el-row class="row-margin">一、租赁用途为居住之用，不得擅自另作他用。</el-row>
                <el-row class="row-margin">二、租赁期限：暂定<el-input v-model="contract.totaltime" size="mini" style="width: 40px;"></el-input>年，从<el-date-picker v-model="contract.starttime" type="date" value-format="yyyy-MM-dd" size="mini" style="width: 150px;"></el-date-picker>起至<el-date-picker v-model="contract.endtime" type="date" value-format="yyyy-MM-dd" size="mini" style="width: 150px;"></el-date-picker>
                  止，每月租金为人民币<u><b>{{ getHouse('rent') }}</b></u>元整，每次租金必须在当月5日前向出租方支付租金。</el-row>
                <el-row class="row-margin">三、付款方式：乙方应按月的周期支付，通过房屋租赁平台的方式支付租金。</el-row>
                <el-row class="row-margin">四、合同签订之日，乙方向甲方交付人民币3000元整作为押金，待不租或期满费用算清后，甲方应将押金无息退还乙方。</el-row>
                <el-row class="row-margin">五、乙方必须依约交付租金，如有拖欠押金，甲方每天按租金拖欠部分的2%加收滞纳金，并有权追回乙方所欠的租金和提前解除合同收回房屋。</el-row>
                <el-row class="row-margin">六、租赁期间，双方均不得借故解除合同，当事人一方如有正当理由要求解除合同时，必须提前壹个月通知对方，经对方同意，解除合同归还房屋，并赔偿违约金壹个月。如遇不可抗拒原因（如天灾、政府政策变化等）不在此例。</el-row>
                <el-row class="row-margin">七、乙方要遵守暂住条例，不得利用该房屋之便进行非法活动，否则乙方要自行承担由此所产生的一切法律责任，甲方概不负责并有权提前终止租赁合同。</el-row>
                <el-row class="row-margin">八、租赁期间内，乙方如中途让给他人转住（用），需经甲方同意，不得私自转租。</el-row>
                <el-row class="row-margin">九、租赁期间，乙方应负责交付：水、电费、管理服务费。</el-row>
                <el-row class="row-margin">十、租赁期间，乙方应爱惜室内一切设备，如因故意或过失造成租用房屋及其配套设施损坏，应负责恢复房屋及其配套设施原状，无法恢复的应酌情赔偿。</el-row>
                <el-row class="row-margin">十一、租赁期满，乙方应按时将房屋归还甲方，如乙方需续租，须提前半个月与甲方协商，在同等条件下，乙方有优先承租权。租赁期满后，乙方退出时，若有家具杂物等布置不搬者，甲方将视其为废弃物，任由甲方处理，乙方不得有异议。</el-row>
                <el-row class="row-margin">十二、本合同若有未尽事宜，由甲、乙双方协商解决，另拟定补充协议。</el-row>
                <el-row class="row-margin">本合同自签订之日起生效，本合同壹式叁份，甲、乙双方各持一份，送工商壹份，叁份都具有同等法律效力。</el-row>
                <el-row>甲方（签名/盖章）：<el-button type="info" plain size="mini" @click="qianming()">模拟签名盖章</el-button>&nbsp;&nbsp;&nbsp;&nbsp;乙方（签名/盖章）：</el-row>
                <el-row>签约日期：<el-date-picker v-model="contract.contracttime" type="date" value-format="yyyy-MM-dd" size="mini" style="width: 150px;"></el-date-picker></el-row>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request'
  export default {
    data() {
      return {
        reservelist:[],
        centerDialogVisible:false,
        contract:{},
        onereserver:{},
        House:{},
        userphone:'',
        userid:null
      }
    },
    created(){
      this.findallreserve();
    },
    methods:{
      qianming(){
        this.$message({
          message:"签名/盖章成功!",
          type:'success'
        })
      },
      findallreserve(){
        request.get("/reserve/getReserveByUserid",{params:{userid:this.userid}}).then(res=>{
        if(res.code==='0'){
          this.reservelist=res.data;
        }
      })
      },
      updateHouse(){
          request.post("house/updateH",this.House).then(res=>{

          })
        },
      Yes(reserve){
        reserve.status='同意';
        this.updateR(reserve);
      },
      No(reserve){
        this.House=reserve.house;
        this.House.houserstatus='未租';
        reserve.status='不同意';
        this.updateR(reserve);
        this.updateHouse();
      },
      updateR(reserve){
        // 删除里面多余的字段，不然后端报错
        delete reserve.user;
        delete reserve.house;
        request.post("/reserve/update",reserve).then(res=>{
          if(res.code==='0'){
            this.$message({
              message:"操作成功!",
              type:'success'
            })
            this.findallreserve();
          }
        })
      },
      qianyue(reserve){
        // 在异步更新完成后，使用this.$set方法可以确保Vue.js能够正确地监听到新添加的属性，并在视图中进行响应式更新。
        this.$set(this.House,'city',reserve.house.city);
        this.$set(this.House,'area',reserve.house.area);
        this.$set(this.House,'rent',reserve.house.rent);
        this.$set(this.House,'address',reserve.house.address);
        this.contract.userid=reserve.user.userid;
        this.contract.reserveid=reserve.reserveid;
        this.contract.houseid=reserve.house.houseid;
        // this.contract.lessor='';//这样子赋初值，表单就输入不了数据，以下是更正后的操作
        this.$set(this.contract, 'lessor', ''); // 出租人
        this.$set(this.contract, 'lnumber', ''); // 出租人身份证
        this.$set(this.contract, 'furniture', ''); // 家具描述
        this.$set(this.contract, 'totaltime', ''); // 租赁年限
        this.$set(this.contract, 'starttime', ''); // 起始日期
        this.$set(this.contract, 'endtime', ''); // 结束日期
        this.$set(this.contract, 'contracttime', ''); // 签约日期
        // this.onereserver.reserve异步更新出问题
        this.$set(this.onereserver,'reserveid',reserve.reserveid);
        this.$set(this.onereserver,'houseid',reserve.houseid);
        this.$set(this.onereserver,'userid',reserve.userid);
        this.$set(this.onereserver,'rtime',reserve.rtime);
        this.$set(this.onereserver,'status',reserve.status);
        this.$set(this.onereserver,'result',reserve.result);
        this.centerDialogVisible=true;
      },
      submit(){
        this.centerDialogVisible = false;
        this.onereserver.appoint='待应约';
        // 更新预约表并且添加合同表,注意：一个请求只能有一个主体（body），所有要更新和添加要分成两个接口实现
        // 更新
        this.updateR(this.onereserver);
        // 添加
        console.log(this.contract);
        request.post("/contract/qianyue",this.contract).then(res=>{
          if(res.code==='0'){
            this.$notify({
              title: '成功',
              message: '签约邀请已发送！',
              type: 'success'
            });
          }
        })
      },
      chaxun(){
        if(this.userphone===''){
          this.userid=null;
          this.findallreserve();
        }else{
          request.get("/user/findByPhone",{params:{phone:this.userphone}}).then(res=>{
          if(res.code==='0'){
            if(res.data===null){
              this.reservelist=[];
            }else{
            this.userid=res.data.userid;
            this.findallreserve();
            }
          }
        })
        }
      }
    },
    computed: {
      // 由于Vue.js的数据响应机制导致,Vue.js会尝试立即获取onereserve对象中的属性，但在某些情况下，数据可能还没有完全准备好，导致报错。
      getHouse() {
        return (key) => {
          // console.log("城市="+this.onereserver.house.city)
          return this.House ? this.House[key] : '';
        }
      }
    }
  }
</script>
<style>
.row-margin {
  margin-bottom: 5px;
}
</style>