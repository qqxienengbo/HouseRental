<template>
    <div class="login">
        <el-tabs class="tabs" type="border-card" stretch  style="background-color: rgba(255, 255, 255, 0.9);">
        <el-tab-pane label="登  录">
            <el-form  label-width="80px" v-model="loginform">
                <el-form-item label="账号" style="color: black;">
                    <el-input v-model="loginform.phone" prefix-icon="el-icon-mobile-phone" placeholder="Phone" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="密码" style="color: black;">
                    <!-- autocomplete="off"禁止浏览器自动填充表单字段 -->
                    <el-input v-model="loginform.password" prefix-icon="el-icon-lock" type="password" placeholder="Password" autocomplete="off" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label-width="20%">
                    <el-radio-group v-model="loginform.role" style="margin-left: 50px;">
                        <el-radio label="租客">租客</el-radio>
                        <el-radio label="管理员">管理员</el-radio>
                    </el-radio-group>
              </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 80%;" @click="login()">登录</el-button>
                </el-form-item>
                </el-form>
        </el-tab-pane>
        <el-tab-pane label="注  册">
            <el-form  label-width="80px" :rules="rules" ref="FormName" :model="registerform">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="registerform.username" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group  v-model="registerform.sex" style="margin-left: 50px;">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="registerform.age" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="registerform.phone"  style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerform.password" type="password" autocomplete="off" style="width: 80%;"></el-input>
                </el-form-item>
                <!-- 后端User类中由于user对象没有password2字段，但是如果要验证表单，这些字段必须是动态绑定表单中的字段，否则验证规则找不到要验证的字段 -->
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="registerform.password2" type="password" autocomplete="off" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- 传入form的ref名给注册事件，用于表单验证 -->
                    <el-button type="primary" style="width: 80%;" @click="register('FormName')">注册</el-button>
                </el-form-item>
                </el-form>
        </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import request from '@/utils/request'
export default {
    data () {
        var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerform.password !== '') {
            this.$refs.FormName.validateField('password2');//防止已经输入了确认密码后，再次修改密码时，触发验证确认密码
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerform.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loginform:{
            phone:'',
            password:'',
            role:'租客'
        },
        registerform:{
            username:'',
            sex:'男',
            age:'',
            phone:'',
            password:'',
            password2:'',//必须有password2字段，否则不能进行密码确认验证规则
            role:'租客'//role有值，即可默认选中
        },
        //记录初始表单信息
        registerform2:{
            username:'',
            sex:'男',
            age:'',
            phone:'',
            password:'',
            password2:'',
            role:'租客'
        },
        password2:'',
        // 校验规则
        rules: {
            //{validator: 校验的函数, trigger: 'blur'  blur:表示失去焦点时开始验证}
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
        login(){
            request.post("/user/login",this.loginform).then(res=>{
                if(res.code ==='0'){
                    this.$message({
                    message:"登录成功！",
                    type:'success'
                    })
                    localStorage.setItem("user",JSON.stringify(res.data));
                    this.$router.push("/");
                }else{
                    this.$message({
                    message:res.msg,
                    type:'error'
                    })
                }
            })
        },
        register(FormName){
            this.$refs[FormName].validate((valid) => {
                if (valid) {
                    // 为了字段和后端类一致，利用方法去掉password2字段，再进行传对象注册
                    // ... 是展开运算符，...this.registerform 使用展开运算符将 registerform 对象中的所有属性和对应的值复制到新对象中。
                    const newRegisterform = { ...this.registerform };
                    delete newRegisterform.password2;
                    request.post("/user/register",newRegisterform).then(res=>{
                        if(res.code ==='0'){
                            this.$message({
                            message:"注册成功！",
                            type:'success'
                            })
                            this.registerform=Object.assign({}, this.registerform2);   
                        }else{
                            this.$message({
                            message:res.msg,
                            type:'error'
                            })
                        }
                    })
                } else {
                    this.$message({
                            message:"信息填写错误，请检查！",
                            type:'error'
                            })
                }
                });
        }
    }
}

</script>

<style>
.tabs{
    width: 400px;
    height: auto;
    position: relative;
    left: 700px;
    top: 100px;
}
.login{
    width: 100%;
    height: 600px;
    background-image: url(../assets/44.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>