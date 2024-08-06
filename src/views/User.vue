<template>
    <div>
        <div style="margin-bottom: 15px;">
            <el-input v-model="params.username" style="width: 200px;" placeholder="请输入姓名"></el-input>
            <el-input v-model="params.phone" style="width: 200px; margin-left: 5px;" placeholder="请输入电话"></el-input>
            <el-button type="warning" style="margin-left: 10px;" @click="findBySearch()">查询</el-button>
            <el-button type="success" style="margin-left: 10px;" @click="add()">新增</el-button>
        </div>
        <div class="admin">
        <el-table :data="tableData" height="415" style="width: 100%">
        <el-table-column prop="avatar" label="头像" align="center">
          <template v-slot="scope">
            <el-image 
              style="width: 70px; height: 70px; border-radius: 50%;" 
              :src="'http://localhost:8888/api/files/'+scope.row.avatar" 
              :preview-src-list="['http://localhost:8888/api/files/'+scope.row.avatar]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column label="操作" align="center" :min-width="100">
          <!-- slot-scope用起来方便 -->
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row)">修改</el-button>
              <el-popconfirm title="是否删除该用户？" @confirm="del(scope.row.userid)">
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
            <el-form :model="form">
              <el-form-item label="头像" label-width="20%">
                <!-- :on-success="successUpload()"文件上传的接口跟我们点击确定更改信息是不同的，文件上传成功是会返回一个时间戳，
                  此时接收时间戳就是为了当点击确定时，把时间戳存到数据库 -->
                <el-upload action="http://localhost:8888/api/files/upload" :on-success="successUpload" 
                  :limit="1"
                  :file-list="filelist">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="姓名" label-width="20%">
                <el-input v-model="form.username" autocomplete="off" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="性别" label-width="20%">
                <el-radio v-model="form.sex" label="男">男</el-radio>
                <el-radio v-model="form.sex" label="女">女</el-radio>
              </el-form-item>
              <el-form-item label="年龄" label-width="20%">
                <el-input v-model="form.age" autocomplete="off" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="20%">
                <el-input v-model="form.phone" autocomplete="off" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="密码" label-width="20%">
                <el-input v-model="form.password" autocomplete="off" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="角色" label-width="20%">
                <el-radio v-model="form.role" label="租客">租客</el-radio>
                <el-radio v-model="form.role" label="管理员">管理员</el-radio>
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

export default {
   data() {
    return {
      params:{
        username:'',
        phone:''
      },
      pageNum:1,//第几页
      pageSize:4,//每页条数，默认4条
      total:0,//总条数
      tableData: [],
      dialogFormVisible:false, //编辑的对话框是否显示
      form:{},
      restoreform:{},//记录编辑时初始表单内容
      filelist:[]//头像列表
    }
  },
  created(){
// 页面加载时，需要做的一些事情在created里
    this.findBySearch();
  },
  methods:{
    findBySearch(){
    // 分页且模糊查询
      request.get("/user/findByPage",{
        params:{
          // 传递多条具体参数
          username:this.params.username,
          phone:this.params.phone,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
      }).then(res=>{
        if(res.code==='0'){
          console.log(res)
          this.tableData=res.data.records;
          this.total=res.data.total
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
    add(){
      this.form={};
      this.dialogFormVisible=true;
    },
    submit(){
      request.post("/user/save",this.form).then(res=>{
        if(res.code==='0'){
          this.$message({
            message:"操作成功！",
            type:'success'
          })
          this.dialogFormVisible=false;
          this.filelist=[];
          this.findBySearch();
        }else{
          this.$message({
            message:res.msg,
            type:'error'
          })
        }
      })
    },
    edit(obj){
        this.form = Object.assign({}, obj); // 使用Object.assign()复制obj到form
        this.restoreform = Object.assign({}, obj); // 复制obj到restoreform
        this.dialogFormVisible = true;
    },
    restore(){
        this.form = Object.assign({}, this.restoreform); // 恢复初始表单内容
        this.dialogFormVisible = false;
    },
    del(userid){
      request.delete("/user/"+userid).then(res=>{
        if(res.code==='0'){
          this.$message({
            message:"删除成功！",
            type:'success'
          })
          this.findBySearch();
        }else{
          this.$message({
            message:res.msg,
            type:'success'
          })
        }
      })
    },
    successUpload(res){
      console.log(res);
      this.form.avatar=res.data;
    }
  }
}
</script>