<template>
    
    <div>
          <!-- 面包屑导航区域 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            :closable="false"
            show-icon>
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                    expand-trigger="hover"
                    v-model="selectedCateKeys"
                    :options="catelist"
                    :props="cateProps"
                    @change="handleChange"  clearable
                    style="width: 20vw;"
                    ></el-cascader>
                </el-col>
            </el-row>

            <!-- tab页面区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加动态参数的面板 -->
                    <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                 <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,index) in scope.row.attr_vals"
                                :key="index" closable @close="handleClsoe(index,scope.row)">{{ item }}</el-tag>
                               <!-- 输入的文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加到按钮 -->
                                <el-button v-else class="button-new-tag"
                                    size="small" @click="showInput(scope.row)">+ New Tag
                                </el-button>

                            </template>
                            
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-edit" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        
                        </el-table-column>
                    </el-table>          
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加静态属性的面板 -->
                    <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                 <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,index) in scope.row.attr_vals"
                                :key="index" closable @close="handleClsoe(index,scope.row)">{{ item }}</el-tag>
                               <!-- 输入的文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加到按钮 -->
                                <el-button v-else class="button-new-tag"
                                    size="small" @click="showInput(scope.row)">+ New Tag
                                </el-button>

                            </template>

                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-edit" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        

                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
            >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{

            //商品分类列表
            catelist:[],
            //级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框双向绑定到的数组
            selectedCateKeys:[],
            //被激活的页签的名称
            activeName:'many',
            //动态参数数据
            manyTableData:[],
            //静态属性数据
            onlyTableData:[],
            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            //添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            //添加表单的验证规则对象
            addFormRules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },

                ]
            },

            //控制修改对话框的显示与隐藏
            editDialogVisible:false,
            //修改的表单数据对象
            editForm:{},
            //修改表单的验证规则对象
            editFormRules:{
                
            },

            
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取所有的商品分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败！')
            }
            this.catelist = res.data
            console.log(this.catelist)
        },
        //级联选择框选中项变化，会触发这个函数
        handleChange(){

            this.getParamsData()
        },      
        //tab页签点击事件的处理函数
        handleTabClick(){
            // console.log(this.activeName)
            this.getParamsData()

        },
        //tab页签点击事件的处理函数
        handleTabClick(){
            console.log(this.activeName)
        },
        //获取参数的列表数据
        //根据所选分类的Id，和当前所处的面板，获取对应的参数
        async getParamsData(){
            // console.log(this.selectedCateKeys)
            //限制只允许选择三级分类
            if (this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            //证明选中的是三级分类
            //根据所选分类的Id，和当前所处的面板，获取对应的参数
             const {data:res}=await this.$http.get('categories/' + this.cateId + '/attributes',{params:{sel:this.activeName}})

             if(res.meta.status !== 200){
                 return this.$message.error('获取参数列表失败！')
             }
             //展开列数据
             res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') :[]
                //控制文本框的显示与隐藏
                item.inputVisible = false
                //文本框中输入的值
                item.inputValue = ''
             })

            //  console.log(res.data)
            //分析获取的是动态参数还是静态属性
            if(this.activeName === 'many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮，添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                //可以发起添加参数的网络请求
                const {data:res} = await this.$http.post(
                'categories/' + this.cateId + '/attributes',
                {attr_name:this.addForm.attr_name,attr_sel:this.activeName}
                )

                if(res.meta.status !== 201){
                    return this.$message.error('添加参数失败！')
                }

                this.$message.success('添加参数成功！')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },

        //点击按钮，展示修改的对话框
        async showEditDialog(attr_id){
            // console.log(attr_id)
            //根据Id查询当前的参数信息
            const {data:res} = await this.$http.get('categories/' + this.cateId + '/attributes/' + attr_id)

            if(res.meta.status !== 200){
                return this.$message.error('获取参数信息失败！')
            }

            this.editForm = res.data

            this.editDialogVisible = true


        },
        //监听修改对话框的关闭事件,重置表单
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //点击按钮，修改参数信息
        editParams(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return
                //发起修改参数的请求
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${ this.editForm.attr_id}`,
                {attr_name:this.editForm.attr_name,attr_sel:this.activeName})

                if(res.meta.status !== 200){
                    return this.$message.error('修改参数失败！')
                }
                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editDialogVisible = false

            })

        },
        //根据Id删除对应的参数项
        async removeParams(attr_id){
            //弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            //如果用户确认删除，则返回值为字符串 confirm
            //如果用户取消删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            //删除的业务逻辑
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${ attr_id}`)

            if(res.meta.status !== 200){
                return this.$message.error('删除参数失败！')
            }
            
            this.$message.success('删除参数成功！')
            this.getParamsData()
        },

        //文本框失去焦点或按下Enter键都会触发
       async handleInputConfirm(row){
            // console.log('ok')
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            //如果没有return,则证明输入的内容，需要做后续的处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisiblec = false
            //需要发起请求，保存修改
            this.saveAttrVals(row)
        },
        //点击按钮，展示文本输入框
        showInput(row){
            row.inputVisible=true
            //让文本框自动获得焦点
            //$nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数的代码
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //删除对应的参数可选项
        handleClsoe(index,row){
            row.attr_vals.splice(index,1)
            this.saveAttrVals(row)

        },
        //将对attr_vals的操作保存在数据库
       async saveAttrVals(row){
            const {data:res} =await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            if(res.meta.status !=200){
                return this.$message.error('修改参数项失败！')
            }

            this.$message.success('修改参数项成功！')
        }

},
    //计算属性
    computed:{
        //按钮是否被禁用
        //如果按钮被禁用，返回true，否则返回false
        isBtnDisabled(){
            if (this.selectedCateKeys.length !== 3){
                return true
            }
            return false
        },
        cateId(){
            if (this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        //当前选中的三级分类的Id
        cateId(){
            if (this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        //动态计算标题的文本
        titleText(){
            if (this.activeName === 'many'){
                return '动态参数'
            }
            return '静态属性'
        }

    }
    
}
</script>
<style lang='less' scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin:10px
}
.input-new-tag{
    width:150px
}

</style>