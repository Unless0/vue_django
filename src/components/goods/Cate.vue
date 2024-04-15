<template>
    <div>
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table
                class="treeTable"
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
                :show-row-hover="false"
                >
                <!-- 是否有效  scope.row数据来自cateList-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialogClosed"
           >
           <!-- 添加分类的表单 -->
           <el-form :model="addCateForm" :rules="addCateFormRules" ref="ruleForm"
            label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称:" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:">
                <!-- 级联选择框 options指定数据源-->
                <!-- props用来配置指定对象 -->
                <!-- change-on-select允许选中任何一级的数据-->
                <el-cascader
                    expandTrigger="hover"
                    v-model="selectedkeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentCateChange"
                    clearable change-on-select
                ></el-cascader>
            </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类的对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="editCateDialogVisible"
            width="50%" @close="editCateDialogClosed"
           >
           <!-- 修改分类的表单 -->
           <el-form :model="editCateForm"  ref="editCateFormRef"
            label-width="100px" >
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCateInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 总数据条数
            total: 0,
            // 为 table 指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    //表示将当前列定义为模板列
                    type: 'template',
                    //表示当前这一列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    type:'template',
                    template:'order',
                   
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            //控制添加分类对话框的显示与隐藏
            addCateDialogVisible:false,
            //添加分类表单的数据对象
            addCateForm:{
                //分类名称
                cat_name:'',
                //分类父id
                cat_pid:0,
                //分类等级，默认添加一级分类
                cat_level:0,
            },
            //添加分类表单的验证规则对象
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur'},
                ]
            },
            //父级分类的列表
            parentCateList:[],
            //指定级联选择器配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //选中的父级分类的id数组
            selectedkeys:[],

            //控制修改分类对话框的显示与隐藏
            editCateDialogVisible:false,
            //查询到的分类信息对象
            editCateForm:{},
           
        
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败');
            }
            // console.log(res.data);
            // 把数据列表赋值给 cateList
            this.cateList = res.data.result;
            // 把总数据条数赋值给 total
            this.total = res.data.total;
            console.log('商品数据列表', this.cateList);
        },
        //监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getCateList()
        },
        //监听pagenum变化
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getCateList()
        },
        //单击按钮，展示添加分类对话框
        showAddCateDialog(){
            this.getParentCateList()
            //在展示对话框之前，先获取父级分类的数据列表
            this.addCateDialogVisible=true
        },
      
        //获取父级分类的数据列表
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200){
                return this.$message.error('获取父级分类数据失败')
            }
            console.log('父级分类数据列表',res.data)
            this.parentCateList=res.data
        },
        // 选择项发生变化触发这个函数
        parentCateChange(){
            //如果 selectedkeys 数组中的 length 大于0，证明选中的父级分类
            //反之，就说明没有选中任何父级分类
            if(this.selectedkeys.length>0){
                //父级分类的id
                this.addCateForm.cat_pid=this.selectedkeys[this.selectedkeys.length-1]
                //为当前分类的等级赋值
                this.addCateForm.cat_level=this.selectedkeys.length
                return
            }else{
                //父级分类的id
                this.addCateForm.cat_pid=0
                //为当前分类的等级赋值
                this.addCateForm.cat_level=0
        }
    },
      // 添加分类
      async addCate() {
            this.$refs.ruleForm.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post('categories', this.addCateForm);

                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！');
                }

                this.$message.success('添加分类成功！');
                this.getCateList(); // 添加成功后刷新列表
                this.addCateDialogVisible = false;
            })
        },
        //监听添加分类对话框的关闭事件，重置表单数据
        addCateDialogClosed(){
            this.$refs.ruleForm.resetFields()
            this.selectedkeys=[]
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        },

        // 监听修改分类对话框的关闭事件
      editCateDialogClosed(){
            this.$refs.editCateFormRef.resetFields()
            this.selectedkeys=[]
            this.editCateForm.cat_level=0
            this.editCateForm.cat_pid=0
        },

        // 展示修改分类的对话框
        async editCate(id){
            const {data:res}=await this.$http.get('categories/'+id)
            if(res.meta.status!==200){
                return this.$message.error('查询分类信息失败')
            }
            this.editCateForm=res.data
            this.editCateDialogVisible=true
        },
        // 修改分类信息并提交
        editCateInfo(){
            // 预校验
            // 表单验证通过，发起修改用户信息的数据请求
            this.$refs.editCateFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.put('categories/'+this.editCateForm.cat_id,{
                    cat_name:this.editCateForm.cat_name
                })
                if(res.meta.status!==200){
                    return this.$message.error('更新分类信息失败')
                }
                this.$message.success('更新分类信息成功')
                this.getCateList()
                this.editCateDialogVisible=false
                
            })
        },
        // 根据id删除对应的分类信息
        async removeCateById(id){
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消了删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消删除')
            }

            const {data:res}=await this.$http.delete('categories/'+id)
            if(res.meta.status!==200){
                return this.$message.error('删除分类失败')
            }
            
            this.$message.success('删除分类成功')
            this.getCateList()
        }
    }
}

</script>
<style>
/* 表格 */
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
