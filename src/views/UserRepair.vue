<template>
    <div>
        <div>
            <el-table :data="Repairlist" style="width: 100%" height="500">
            <el-table-column prop="house.city" label="城市" align="center"></el-table-column>
            <el-table-column prop="house.address" label="地址" align="center"></el-table-column>
            <el-table-column prop="hnumber" label="门牌号" align="center"></el-table-column>
            <el-table-column prop="content" label="问题描述" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template v-slot="props">
                    <el-tag v-if="props.row.status==='待处理'" type="info">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='处理中'" type="warning">{{ props.row.status}}</el-tag>
                    <el-tag v-if="props.row.status==='已完成'" type="success">{{ props.row.status}}</el-tag>
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
            user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}
        }
    },
    created(){
        this.findBySearch()
    },
    methods:{
        findBySearch(){
            request.get("/repair/getByuserid",{params:{userid:this.user.userid}}).then(res=>{
                if(res.code==='0'){
                    this.Repairlist=res.data
                }
            })
        },
    }
}
</script>