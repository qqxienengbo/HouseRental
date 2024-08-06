<template>
    <div>
      <div>
            <el-table :data="reservelist"  height="510" style="width: 100%;" >
                <el-table-column type="expand">
                <template v-slot="props">
                  <div style="width: 100%;margin: 0 0px;">
                    <div style="width: 50%;height: 200px;float: left;background-color: oldlace;padding: 10px 10px 10px 30px;">
                      <el-form>
                        <el-form-item label="房屋图:">
                          <el-image 
                          style="width: 250px; height: 150px;" 
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
                <el-table-column label="房东电话" prop="house.hphone"  align="center" ></el-table-column>
                <el-table-column label="看房时间" prop="rtime" align="center" ></el-table-column>
                <el-table-column label="状态" prop="status" align="center" >
                  <template v-slot="props">
                    <el-tag v-if="props.row.status==='待审批'" type="warning">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='同意'" type="success">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='不同意'" type="danger">{{ props.row.status}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column label="看房结果" prop="result" align="center" >
                    <template v-slot="props">
                        <el-tag v-if="props.row.result==='满意'" type="success">{{ props.row.result}}</el-tag>
                        <el-tag v-if="props.row.result==='不满意'" type="danger">{{ props.row.result}}</el-tag>
                        <el-button v-if="props.row.status==='同意'&& props.row.result==='无'" type="success" size="mini" @click="manyi(props.row)">满意</el-button>
                        <el-button v-if="props.row.status==='同意'&& props.row.result==='无'" type="danger" size="mini" @click="bumanyi(props.row)">不满意</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="合同" align="center" >
                    <template v-slot="props">
                        <el-button v-if="props.row.appoint!=='未签约'" type="primary" size="mini" @click="look(props.row)" >查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="签约" prop="appoint" align="center" >
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
                <el-row class="row-margin">甲方（出租方）:<span style="width: 100px; display: inline-block;"><u><b>{{ contract.lessor }}</b></u></span>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<span style="width: 200px; display: inline-block;"><u><b>{{ contract.lnumber }}</b></u></span></el-row>
                <el-row class="row-margin">乙方（承租方）:<el-input v-model="contract.tenantry" size="mini" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<el-input v-model="contract.tnumber" size="mini" style="width: 200px;"></el-input></el-row>
                <el-row class="row-margin">出租之房屋（店面）座落于<u><b>{{ getHouse('city') }}{{ getHouse('address') }}</b></u>。建筑面积<u><b>{{ getHouse('area') }}</b></u>平米。室内设备包括<u><b>{{ contract.furniture }}</b></u>。甲、乙双方就上述房屋（店面）友好协商，达成下列条款，以资共同遵守履行。</el-row>
                <el-row class="row-margin">一、租赁用途为居住之用，不得擅自另作他用。</el-row>
                <el-row class="row-margin">二、租赁期限：暂定<u><b>{{ contract.totaltime }}</b></u>年，从<u><b>{{ contract.starttime }}</b></u>起至<u><b>{{ contract.endtime }}</b></u>止，每月租金为人民币<u><b>{{ getHouse('rent') }}</b></u>元整，每次租金必须在当月5日前向出租方支付租金。</el-row>
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
                <el-row>甲方（签名/盖章）：<u><b>XXX</b></u>&nbsp;&nbsp;&nbsp;&nbsp;乙方（签名/盖章）：<el-button type="info" plain size="mini" @click="qianming()">模拟签名盖章</el-button></el-row>
                <el-row>签约日期：<u><b>{{ contract.contracttime }}</b></u></el-row>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button  v-if="contract.status===null" @click="refuse()">拒 绝</el-button>
              <el-button v-if="contract.status===null" type="primary" @click="OK()">应 约</el-button>
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
        user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{},
        contract:{},
        centerDialogVisible:false,
        onereserve:{},
        House:{},
        Horder:{}
      }
    },
    created(){
      this.ReserveByUserid();
    },
    methods:{
      qianming(){
        this.$message({
          message:"签名/盖章成功!",
          type:'success'
        })
      },
        ReserveByUserid(){
            request.get("/reserve/getReserveByUserid",{params:{userid:this.user.userid}}).then(res=>{
                if(res.code==='0'){
                this.reservelist=res.data;
                console.log(this.reservelist)
                }
            })
        },
        manyi(reserve){
            reserve.result='满意';
            this.updateR(reserve);

        },
        bumanyi(reserve){
            this.House=reserve.house;
            reserve.result='不满意';
            this.House.houserstatus='未租';
            this.updateR(reserve);
            this.updateHouse();
        },
        updateHouse(){
          request.post("house/updateH",this.House).then(res=>{

          })
        },
        updateR(reserve){
            request.post("/reserve/update",reserve).then(res=>{
            if(res.code==='0'){
                this.$message({
                message:"操作成功!",
                type:'success'
                })
                this.ReserveByUserid();
            }
            })
        },
        look(reserve){
          this.onereserve=Object.assign({},reserve);
          request.get("/contract/findByReserveId",{params:{reserveid:reserve.reserveid}}).then(res=>{
            if(res.code==='0'){
              this.contract=res.data;
              this.$set(this.Horder,"contractid",res.data.contractid)
            }
            this.centerDialogVisible=true;
            this.House=reserve.house;
          })
          // 不用reserve传值,会找不到该值
          this.$set(this.Horder,"userid",this.user.userid)
          this.$set(this.Horder,"houseid",reserve.house.houseid)
          this.$set(this.Horder,"unpaid",reserve.house.rent)
          this.$set(this.Horder,"total",0)
          this.$set(this.Horder,"status","在租")

        },
        updateContract(){
          request.post("/contract/update",this.contract).then(res=>{
          })
        },
        refuse(){
          this.onereserve.appoint='已拒绝';
          this.contract.status='未签';
          this.House.houserstatus='未租';
          this.updateR(this.onereserve);
          this.updateContract();
          this.updateHouse();
            this.$notify.info({
              title: '拒绝',
              message: '已拒绝，祝你早日找到心仪的房子！',
            });
          this.centerDialogVisible=false;
        },
        OK(){
          this.contract.status='生效';
          this.onereserve.appoint='已签约';
          this.House.houserstatus='已租';
          // 同时更新三个表的信息
          this.updateHouse();
          this.updateR(this.onereserve);
          this.updateContract();
          // 生成一条租房列表信息
          request.post("/horder/add",this.Horder).then(res=>{
            if(res.code==='0'){
              this.$notify({
              title: '成功',
              message: '应约成功，恭喜入住新房子！',
              type: 'success'
            });
            }
          })
          this.centerDialogVisible=false
        }
    },
    computed: {
      // 由于Vue.js的数据响应机制导致,Vue.js会尝试立即获取onereserve对象中的属性，但在某些情况下，数据可能还没有完全准备好，导致报错。
      getHouse() {
        return (key) => {
          return this.onereserve && this.onereserve.house ? this.onereserve.house[key] : '';
        }
      }
    }
  }
</script>
<style>

</style>