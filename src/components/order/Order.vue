<template>
    <div>
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表数据 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>    
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                        v-model="addressForm.address1"
                        :options="citydata"
                        :props="{ expandTrigger: 'hover' }"
                        ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model.trim="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 展示物流进度的对话框 -->
        <el-dialog>
            <el-timeline
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%">
            <!-- 时间线 -->
            <el-timeline-item
                v-for="(activity, index) in progressInfo.data"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
            </el-timeline-item>
            
        </el-timeline>

        </el-dialog>

    </div>
    
</template>
<script>
//导入citydata
import citydata from './citydata.js'

export default {
    data(){
        return{
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 订单列表
            orderlist:[],
            // 总数据条数
            total:0,
            // 修改地址的对话框
            addressVisible:false,
            // 修改地址的表单数据对象
            addressForm:{
                address1:[],
                address2:''
            },
            // 修改地址的表单验证规则对象
            addressFormRules:{
                address1:[
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                address2:[
                    { required: true, message: '请填写详细地址', trigger: 'blur' }  
                ]
            },
            // 物流进度的对话框
            progressVisible:false,
            // 物流进度的数据
            // progressInfo:[],
            // 省市区/县数据
            citydata:citydata,
            // 时间线数据，物流数据请求有问题，使用固定数据暂代
            progressInfo: {
                data: [
                    {
                    time: "2018-05-10 09:39:00",
                    ftime: "2018-05-10 09:39:00",
                    context: "已签收,感谢使用顺丰,期待再次为您服务",
                    location: "",
                    },
                    {
                    time: "2018-05-10 08:23:00",
                    ftime: "2018-05-10 08:23:00",
                    context:
                        "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    location: "",
                    },
                    {
                    time: "2018-05-10 07:32:00",
                    ftime: "2018-05-10 07:32:00",
                    context: "快件到达 [北京海淀育新小区营业点]",
                    location: "",
                    },
                    {
                    time: "2018-05-10 02:03:00",
                    ftime: "2018-05-10 02:03:00",
                    context:
                        "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    location: "",
                    },
                    {
                    time: "2018-05-09 23:05:00",
                    ftime: "2018-05-09 23:05:00",
                    context: "快件到达 [北京顺义集散中心]",
                    location: "",
                    },
                    {
                    time: "2018-05-09 21:21:00",
                    ftime: "2018-05-09 21:21:00",
                    context:
                        "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    location: "",
                    }
                ],
                },

        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        // 获取订单列表
        async getOrderList(){
            const {data:res}=await this.$http.get('orders',{params:this.queryInfo})

            if(res.meta.status!==200) 
                return this.$message.error('获取订单列表失败')

            this.$message.success('获取订单列表成功')
            console.log(res.data)
            this.orderlist=res.data.goods
            this.total=res.data.total
        },
        
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize=newSize
            this.getOrderList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum=newPage
            this.getOrderList()
        },

        // 展示修改地址的对话框
        showBox(){
            this.addressVisible=true
        },
        // 展示物流进度的对话框
       async showProgressBox(){
            // 获取物流进度

            // const {data:res}=await this.$http.get('/kuaidi/1106975712662')
            // if(res.meta.status!==200) 
            //     return this.$message.error('获取物流进度失败')

            // this.$message.success('获取物流进度成功')
            // console.log(res.data)
            // this.progressInfo=res.data
            // 展示物流进度的对话框
            this.progressVisible=true
        },
        // 监听修改地址的对话框的关闭事件
        // 重置表单数据
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        // 获取省市区/县数据
        async getCityData(){
            const {data:res}=await this.$http.get('cities')
            if(res.meta.status!==200) 
                return this.$message.error('获取省市区/县数据失败')

            this.$message.success('获取省市区/县数据成功')
            console.log(res.data)
            this.citydata=res.data
        }

    },
   
    
}
</script>
<style lang="less" scoped>
.el-cascader{
    width: 100%;
}

</style>