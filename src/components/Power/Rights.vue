<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- 卡片视图 -->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>  
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        rightsList: [] // 权限列表
      }
    },
    created() {
      // 获取权限列表
      this.getRightsList()
    },
    methods: {
      // 获取权限列表
      async getRightsList() {
        try {
          const { data: res } = await this.$http.get('rights/list')  
          console.log('权限列表', res)
          
          if (res.meta.status !== 200) {
            this.$message.error('获取权限列表失败！')
          } else {
            // 成功
            this.rightsList = res.data
          }
        } catch (error) {
          this.$message.error('获取权限列表失败！')
        }
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
    /* 可以添加样式 */
  </style>
  