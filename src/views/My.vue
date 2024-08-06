<template>
    <div>
        <div style="width: 300px; margin: auto auto;">
            <el-form ref="form" :model="user" label-width="80px" :label-position="labelPosition">
                <el-form-item label="头像:">
                    <el-image 
                style="width: 120px; height: 120px; border-radius: 50%;" 
                :src="'http://localhost:8888/api/files/'+user.avatar" 
                :preview-src-list="['http://localhost:8888/api/files/'+user.avatar]">
                </el-image>
                </el-form-item>
                <el-form-item label="姓名:">
                    <span style="text-align: center;">{{user.username}}</span>
                </el-form-item>
                <el-form-item label="性别:">
                    <span>{{user.sex}}</span>
                </el-form-item>
                <el-form-item label="年龄:">
                    <span>{{user.age}}</span>
                </el-form-item>
                <el-form-item label="电话:">
                    <span>{{user.phone}}</span>
                </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="edit()">修改</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div>
          <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form">
              <el-form-item label="头像" label-width="20%">
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
                <el-input v-model.number="form.age" autocomplete="off" style="width: 80%;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible=false">取 消</el-button>
              <el-button type="primary" @click="submit()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import request from "@/utils/request";

export default{
    data(){
        return{
            user:{},
            labelPosition:'left',
            dialogFormVisible:false,
            form:{},
            filelist:[]
        }
    },
    created(){
        const admin=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}
        this.findByUserId(admin.userid);
    },
    methods:{
        findByUserId(id){
            // 传递参数的方法必须要用到{params:{}}
        request.get("/user/findById",{params:{userid:id}}).then(res=>{
          if(res.code==='0'){
          this.user=res.data
          this.form = Object.assign({}, this.user)
          }
        })
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
          this.findByUserId(this.form.userid)
        }else{
          this.$message({
            message:res.msg,
            type:'error'
          })
        }
      })
    },
    edit(){
        this.form = Object.assign({}, this.user);
        this.dialogFormVisible=true;
    },
    successUpload(res){
      console.log(res);
      this.form.avatar=res.data;
    }
    }
}
</script>
