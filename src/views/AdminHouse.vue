<template>
    <div>
        <div>
            <el-form  :model="eqhouse" label-width="50px" :inline="true">
                <el-form-item label="编号">
                    <el-input v-model.number="eqhouse.houseid" placeholder="请输入编号"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="eqhouse.houserstatus">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button label="未租"></el-radio-button>
                    <el-radio-button label="已租"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" style="margin-left: 50px;" @click="findBySearch()">查询</el-button>
                    <el-button type="success" style="margin-left: 10px;" @click="add()">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="admin">
            <el-table :data="houses" height="375" style="width: 100%">
            <el-table-column type="expand">
                <template v-slot="props">
                    <el-form :inline="true" label-width="100px"  style="width: 100%;background-color: #f0f9eb;">
                        <el-row style="height: 32px;">
                            <el-form-item label="户型：">{{ props.row.housetype }}</el-form-item>
                            <el-form-item label="面积：">{{ props.row.area }}平米</el-form-item>
                            <el-form-item label="城市和地址：">{{ props.row.city }}{{ props.row.address }}</el-form-item>
                        </el-row>
                        <el-row style="height: 32px;">
                            <el-form-item label="楼层：">{{ props.row.level }}</el-form-item>
                            <el-form-item label="简介：">{{ props.row.intro }}</el-form-item>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="img" label="图片" align="center" >
            <template v-slot="scope">
                <el-image 
                style="width: 90px; height: 60px;" 
                :src="'http://localhost:8888/api/files/'+scope.row.img" 
                :preview-src-list="['http://localhost:8888/api/files/'+scope.row.img]">
                </el-image>
            </template>
            </el-table-column>
            <el-table-column prop="houseid" label="编号" align="center"></el-table-column>
            <el-table-column prop="sort" label="类型" align="center"></el-table-column>
            <el-table-column prop="rent" label="租金(元/月)" align="center"></el-table-column>
            <el-table-column prop="houserstatus" label="状态" align="center"></el-table-column>
            <el-table-column prop="hphone" label="联系方式" align="center"></el-table-column>
            <el-table-column label="操作" align="center" :min-width="100">
            <!-- slot-scope用起来方便 -->
                <template slot-scope="scope">
                <el-button type="primary" @click="edit(scope.row)">修改</el-button>
                <el-popconfirm title="是否删除该房源？" @confirm="del(scope.row.houseid)">
                    <el-button slot="reference" type="danger" style="margin-left: 5px;">删除</el-button>
                </el-popconfirm>
                </template>
            </el-table-column>
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
            <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="onehouse">
              <el-form-item label="图片" label-width="20%">
                <el-upload action="http://localhost:8888/api/files/upload" :on-success="successUpload" 
                  :limit="1"
                  :file-list="filelist">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="城市" label-width="20%">
                <el-radio-group v-model="onehouse.city">
                    <el-radio-button label="A市"></el-radio-button>
                    <el-radio-button label="B市"></el-radio-button>
                    <el-radio-button label="C市"></el-radio-button>
                    <el-radio-button label="D市"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="地址"><el-input v-model="onehouse.address" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="户型"><el-input v-model="onehouse.housetype" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="面积（平米）"><el-input v-model="onehouse.area" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="楼层"><el-input v-model="onehouse.level" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="租金(元/月)"><el-input v-model="onehouse.rent" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="简介"><el-input v-model="onehouse.intro" type="textarea" :rows="2" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="房东电话"><el-input v-model="onehouse.hphone" autocomplete="off"></el-input></el-form-item>
              <el-form-item label="类型" label-width="20%">
                <el-radio v-model="onehouse.sort" label="整租">整租</el-radio>
                <el-radio v-model="onehouse.sort" label="合租">合租</el-radio>
              </el-form-item>
              <el-form-item v-if="onehouse.houseid!==null" label="状态" label-width="20%">
                <el-radio v-model="onehouse.houserstatus" label="未租">未租</el-radio>
                <el-radio v-model="onehouse.houserstatus" label="已租">已租</el-radio>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="restore()">取 消</el-button>
              <el-button type="primary" @click="submit()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request';
export default{
    data(){
        return {
            pageNum:1,//第几页
            pageSize:4,//每页条数，默认8条
            houses:[],
            total:0,
            onehouse:{},
            filelist:[],
            dialogFormVisible:false,
            eqhouse:{
                houserstatus:"全部",
                houseid:null
            },
        }
    },
    created(){
      this.findBySearch();
    },
    methods:{
        findBySearch(){
        request.get("/house/house2",{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          houserstatus:this.eqhouse.houserstatus,
          houseid:this.eqhouse.houseid
        }
      }).then(res=>{
        if(res.code==='0'){
          console.log(res);
          this.houses=res.data.records
          this.total=res.data.total;
        }
      })
      },
    handleSizeChange(pageSize){
        this.pageSize=pageSize;
        this.findBySearch();
    },
    handleCurrentChange(pageNum){
        this.pageNum=pageNum;
        this.findBySearch();
    },
    successUpload(res){
      console.log(res);
      this.onehouse.img=res.data;
    },
    add(){
      // 初始化onehouse表单
      this.$set(this.onehouse,"houserstatus","未租");//添加房源时，默认为未租
      this.$set(this.onehouse,"city","A市");
      this.$set(this.onehouse,"sort","整租");
      this.$set(this.onehouse,"address","");
      this.$set(this.onehouse,"housetype","");
      this.$set(this.onehouse,"area","");
      this.$set(this.onehouse,"rent","");
      this.$set(this.onehouse,"level","");
      this.$set(this.onehouse,"intro","");
      this.$set(this.onehouse,"hphone","");
      this.$set(this.onehouse,"houseid",null)
      this.filelist=[];
      this.dialogFormVisible=true
    },
    edit(house){
      this.filelist=[];
      this.onehouse=Object.assign({},house)
      this.dialogFormVisible=true;
    },
    submit(){
      request.post("house/save",this.onehouse).then(res=>{
        if(res.code==='0'){
          this.$message({
            message:"操作成功！",
            type:'success'
          })
          this.findBySearch()
        }
      })
      this.dialogFormVisible=false;
    },
    restore(){
      this.dialogFormVisible=false;
    },
    del(houseid){
      request.delete("/house/"+houseid).then(res=>{
        if(res.code==='0'){
          this.$message({
            message:"删除成功！",
            type:'success'
          })
          this.findBySearch();
        }
      })
    }
    }
}
</script>