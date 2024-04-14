<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" 
                    v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 el-row是行，el-col是列 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <!-- 渲染三级权限 ，一行24列 -->
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 添加操作按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-circle-plus" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="30%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="70px" >
          <el-form-item label="用户名" prop="roleName">
              <el-input v-model.trim="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model.trim="addRolesForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>    
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
            title="修改角色"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editFormRef" label-width="70px" >
                <el-form-item label="用户名" prop="roleName">
                    <el-input v-model.trim="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model.trim="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" >
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
        title="分配权限" :visible.sync="setRightDialogVisible"
        width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '角色描述的长度在3~10个字符之间', trigger: 'blur' }
        ]
      },
      // 修改角色对话框数据
      editDialogVisible: false,
      editRolesForm: {
        id: null,
        roleName: '',
        roleDesc: ''
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '角色描述的长度在3~10个字符之间', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树形控件绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      }, 
      //默认选中节点的ID值数值
      defKeys: [],
      //当前即将分配权限的角色id
      roleId:''

  
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      try {
        const { data: res } = await this.$http.get('roles');
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！');
        }
        this.rolesList = res.data;
        console.log(this.rolesList);
      } catch (error) {
        console.error(error);
        this.$message.error('获取角色列表失败！');
      }
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 添加角色
    async addRole() {
      try {
        const { data: res } = await this.$http.post('roles', this.addRolesForm);
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！');
        }
        this.$message.success('添加角色成功！');
        this.addDialogVisible = false;
        this.getRolesList(); // 重新获取角色列表
      } catch (error) {
        console.error(error);
        this.$message.error('添加角色失败！');
      }
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！');
      }
      this.editRolesForm = res.data;
      this.editDialogVisible = true;
    },
    // 根据id删除对应的角色信息
    async removeRightById(role, rightId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！');
      }
      //直接修改role.children，因为role.children是引用类型，所以修改的是同一个对象
      //这样就不会刷新页面
      role.children = res.data;
      this.$message.success('删除角色成功！');
    },
    // 监听编辑角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改角色信息
    async editRoleInfo() {
      try {
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.id, this.editRolesForm);
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败！');
        }
        this.$message.success('修改角色信息成功！');
        this.editDialogVisible = false;
        this.getRolesList();
      } catch (error) {
        console.error(error);
        this.$message.error('修改角色信息失败！');
      }
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      //当前角色ID
      this.roleId = role.id;

      this.setRightDialogVisible = true;
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！');
      }
      //把获取到的权限数据保存到data中
      this.rightsList = res.data;
      console.log(this.rightsList);

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },

    //点击为角色分配权限
    async allotRights() {
      const keys = [
        //...是展开or拓展运算符,getCheckedKeys返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        //getHalfCheckedKeys返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',');
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
      
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！');
      }
      this.$message.success('分配权限成功！');
      this.getRolesList();
      this.setRightDialogVisible = false;
    },

    //通过递归获取三级节点的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      //递归
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },

   }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
