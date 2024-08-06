<template>
    <div>
        <div class="admin">
            <el-table :data="Horderlist" style="width: 100%">
            <el-table-column type="expand">
                <template v-slot="props">
                    <el-form :inline="true" label-width="100px"  style="width: 100%;background-color: #f0f9eb;">
                        <el-row style="height: 32px;">
                            <el-form-item label="编号：">{{ props.row.house.houseid }}</el-form-item>
                            <el-form-item label="户型：">{{ props.row.house.housetype }}</el-form-item>
                            <el-form-item label="面积：">{{ props.row.house.area}}平米</el-form-item>
                            <el-form-item label="城市和地址：">{{ props.row.house.city }}{{ props.row.house.address }}</el-form-item>
                        </el-row>
                        <el-row style="height: 32px;">
                            <el-form-item label="楼层：">{{ props.row.house.level }}</el-form-item>
                            <el-form-item label="出租类型：">{{ props.row.house.sort }}</el-form-item>
                            <el-form-item label="简介：">{{ props.row.house.intro }}</el-form-item>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="user.username" label="租客" align="center"></el-table-column>
            <el-table-column prop="user.phone" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="contract.contractid" label="合同" align="center">
                <template v-slot="props">
                    <el-button type="primary" size="mini" @click="look(props.row)" >查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="total" label="缴费总额(元)" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="block" style="margin-top: 15px; text-align: center;">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=pageNum
            :page-sizes="[2,4,6,8]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
            </el-pagination>
        </div>
        <div>
          <el-dialog title="房屋租赁合同" :visible.sync="centerDialogVisible" width="70%" center>
            <el-form :model="contract">
              <el-form-item>
                <el-row class="row-margin">甲方（出租方）:<span style="width: 100px; display: inline-block;"><u><b>{{ contract.lessor }}</b></u></span>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<span style="width: 200px; display: inline-block;"><u><b>{{ contract.lnumber }}</b></u></span></el-row>
                <el-row class="row-margin">乙方（承租方）:<span style="width: 100px; display: inline-block;"><u><b>{{ contract.tenantry }}</b></u></span>&nbsp;&nbsp;&nbsp;&nbsp;身份证号码:<span style="width: 200px; display: inline-block;"><u><b>{{ contract.tnumber }}</b></u></span></el-row>
                <el-row class="row-margin">出租之房屋（店面）座落于<u><b>{{ onehouse.city }}{{ onehouse.address }}</b></u>。建筑面积<u><b>{{ onehouse.area }}</b></u>平米。室内设备包括<u><b>{{ contract.furniture }}</b></u>。甲、乙双方就上述房屋（店面）友好协商，达成下列条款，以资共同遵守履行。</el-row>
                <el-row class="row-margin">一、租赁用途为居住之用，不得擅自另作他用。</el-row>
                <el-row class="row-margin">二、租赁期限：暂定<u><b>{{ contract.totaltime }}</b></u>年，从<u><b>{{ contract.starttime }}</b></u>起至<u><b>{{ contract.endtime }}</b></u>止，每月租金为人民币<u><b>{{ onehouse.rent }}</b></u>元整，每次租金必须在当月5日前向出租方支付租金。</el-row>
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
                <el-row>甲方（签名/盖章）：<u><b>XXX</b></u>&nbsp;&nbsp;&nbsp;&nbsp;乙方（签名/盖章）：<u><b>XXX</b></u></el-row>
                <el-row>签约日期：<u><b>{{ contract.contracttime }}</b></u></el-row>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request';

export default{
    data(){
        return{
            Horderlist:[],
            pageNum:1,//第几页
            pageSize:4,//每页条数，默认8条
            total:0,
            contract:{},
            centerDialogVisible:false,
            onehouse:{},
            onehorder:{},
            sign:0,//标记是查询全部还是查询未缴费
        }
    },
    created(){
        this.findBySearch();
    },
    methods:{
        // 后端不要mybatis-plus时，获取不到total总条数
        findBySearch(){
            request.get("/horder/getHorder",{
                params:{
                    pageNum:(this.pageNum-1)*this.pageSize,//因为后端是自定义查询，这个值表示从第pageNum条开始，查询pageSize条，所以需要手动书写表达式达到分页效果
                    pageSize:this.pageSize,
                    status:'已退租'
            }
        }).then(res=>{
                if(res.code==='0'){
                    this.Horderlist=res.data;
                    this.gettotal();
                }
            })
        },
        // 自己手动获取
        gettotal(){
            request.get("/horder/gettotal",{params:{
                status:'已退租'
            }}).then(res=>{
                if(res.code==='0'){
                    this.total=res.data
                }
            })
        },
        handleSizeChange(pageSize){
        this.pageSize=pageSize;
        console.log("pageSize=",pageSize)
        this.findBySearch();
        },
        handleCurrentChange(pageNum){
            this.pageNum=pageNum;
            console.log("pageNum=",this.pageNum)
            console.log("pageSize=",this.pageSize)
            this.findBySearch();
        },
        look(horder){
            this.$set(this.onehouse,"city",horder.house.city)
            this.$set(this.onehouse,"address",horder.house.address)
            this.$set(this.onehouse,"rent",horder.house.rent)
            this.$set(this.onehouse,"area",horder.house.area)
          request.get("/contract/findById",{params:{contractid:horder.contract.contractid}}).then(res=>{
            if(res.code==='0'){
              this.contract=res.data;
              this.centerDialogVisible=true;
            }
          })
        },
    }
}
</script>