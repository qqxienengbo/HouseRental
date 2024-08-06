<template>
    <div>
        <div>
            <el-table :data="Repairlist" style="width: 100%" height="500">
            <el-table-column type="expand">
                <template v-slot="props">
                    <el-form :inline="true" label-width="100px"  style="width: 100%;background-color: #f0f9eb;">
                        <el-row style="height: 32px;">
                            <el-form-item label="问题描述：">{{ props.row.content }}</el-form-item>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="user.username" label="租客" align="center"></el-table-column>
            <el-table-column prop="user.phone" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="house.city" label="城市" align="center"></el-table-column>
            <el-table-column prop="house.address" label="地址" align="center"></el-table-column>
            <el-table-column prop="hnumber" label="门牌号" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template v-slot="props">
                    <el-tag v-if="props.row.status==='待处理'" type="info">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='处理中'" type="warning">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='已完成'" type="success">{{ props.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" :min-width="100">
                <template v-slot="props">
                    <el-button v-if="props.row.status==='待处理'" type="primary" size="mini" @click="chuli(props.row)" >开始处理</el-button>
                    <el-button v-if="props.row.status==='处理中'" type="success" size="mini" @click="wancheng(props.row)" >完成</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import request from '@/utils/request'

export default{
    data(){
        return{
            Repairlist:[],
            onerepair:{}
        }
    },
    created(){
        this.findBySearch()
    },
    methods:{
        findBySearch(){
            request.get("/repair/getAll").then(res=>{
                if(res.code==='0'){
                    this.Repairlist=res.data
                }
            })
        },
        chuli(row){
            this.onerepair=Object.assign({},row);
            this.$set(this.onerepair,"status",'处理中')
            this.update()
            this.$notify.info({
                        title: '开始处理',
                        message: '请尽快完成任务！',
                    });
        },
        wancheng(row){
            this.onerepair=Object.assign({},row);
            this.$set(this.onerepair,"status",'已完成')
            this.update()
            this.$message({
                    message: '恭喜处理完成！',
                    type: 'success'
                });
        },
        update(){
            delete this.onerepair.user
            delete this.onerepair.house
            request.post("/repair/update",this.onerepair).then(res=>{
                if(res.code==='0'){
                    this.findBySearch()
                }
            })
        }
    }
}
</script>
<style>

</style>