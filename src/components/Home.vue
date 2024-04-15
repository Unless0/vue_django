<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="loginout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px':'200px'">
                <!-- 侧边栏伸缩展开 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu class="el-menu-vertical-demo"
                        background-color="#545c64" text-color="#fff" 
                        active-text-color="#409eff" unique-opened :collapse="isCollapse"
                        collapse-transition router  :default-active="activePath"
                        >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" 
                          @click="saveNavState('/'+subItem.path)">
                       
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{ subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    created() {
        this.getMenulist()
        // 获取保存的链接地址
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
        return {
            // 左侧菜单数据
            menulist: [],
            // 菜单图标
            iconObj: {
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-check',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-marketing'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
    methods: {
        loginout() {
                //  退出登录,清除token
                window.sessionStorage.clear()
                // 跳转到登录页面
                this.$router.push('/login')
            },
          // 获取所有的信息
        async getMenulist() {
            // 发送请求,解构data
             const { data:res } =await this.$http.get('menus')
             if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
             this.menulist = res.data
            //  console.log('左侧菜单列表',res)
          },
          // 侧边栏伸缩
          toggleCollapse() {
              this.isCollapse = !this.isCollapse
          },
          // 保存链接的激活状态
          saveNavState(activePath) {
              window.sessionStorage.setItem('activePath',activePath)
              this.activePath = activePath
          }
        
        }
    }

</script>

<style  lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.el-container{
    height: 100%;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>