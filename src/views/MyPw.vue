<template>
    <div style="width: 300px;">
        <el-form label-width="80px" :rules="rules" ref="FormName" :model="registerform">
            <el-form-item label="原密码" prop="oldpw">
                <el-input v-model="registerform.oldpw" type="password" autocomplete="off" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpassword">
                <el-input v-model="registerform.newpassword" type="password" autocomplete="off" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="registerform.password2" type="password" autocomplete="off" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="edit('FormName')" style="margin-left: 50px;">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import request from '@/utils/request';


export default{
    data(){
        var OldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码！'));
        } else {
          callback();
        }
      };
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码！'));
        } else {
          if (this.registerform.newpassword !== '') {
            this.$refs.FormName.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码！'));
        } else if (value !== this.registerform.newpassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

        return{
            registerform:{
                oldpw:'',
                newpassword:'',
                password2:''
            },
            form:{},
            user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{},
            rules: {
            //{validator: 校验的函数, trigger: 'blur'  blur:表示失去焦点时开始验证}
          newpassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldpw:[
            { validator:OldPass,trigger:'blur'}
        ]
        }
        }
    },
    methods:{
      open() {
        this.$alert('请重新登录！', '修改成功', {
          confirmButtonText: '确定',
          callback: action => {
            localStorage.removeItem("user");
            this.$router.push("/login");
          }
        });
      },
      edit(FormName){
        // 点击修改按钮时，进行一次表单验证，通过才能修改
        this.$refs[FormName].validate((valid)=>{
          if(valid){
            this.form.userid=this.user.userid;
            this.form.password=this.user.password;
            this.form.oldpw=this.registerform.oldpw;
            this.form.newpassword=this.registerform.newpassword;
            request.post("/user/myPw",this.form).then(res=>{
              if(res.code==='0'){
                this.open();
              }else{
                this.$message({
                    message:res.msg,
                    type:'error'
                    })
              }
            })
          }
        })
        console.log(this.user);
         const userid=this.user.userid
        console.log(userid)
      }
    }
}
</script>