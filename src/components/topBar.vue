<template>
    <div class="topBar">
        <div class="breadcrumb">
            <el-icon :size="20" color="gray">
                <Fold @click="showMenu" />
            </el-icon>
            <el-icon :size="20" color="gray" class="m-2">
                <RefreshRight @click="reload" />
            </el-icon>
            <el-breadcrumb separator="/" v-if="proxy.$route.path != '/index'">
                <el-breadcrumb-item>{{ $route.query.title }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ $route.query.subTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-dropdown>
            <div>
                <el-icon :size="20" color="gray" class="m-3">
                    <User />
                </el-icon>
                <span>系统管理员</span>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        <el-icon>
                            <Setting />
                        </el-icon>账户设置
                    </el-dropdown-item>
                    <el-dropdown-item @click="quit">
                        <el-icon>
                            <SwitchButton />
                        </el-icon>退出登录
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { markRaw, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Fold, RefreshRight, User, SwitchButton, Setting, QuestionFilled } from '@element-plus/icons-vue'
const store = useStore()
const { proxy } = getCurrentInstance()
const reload = () => {
    window.location.reload()
}
const showMenu = () => {
    store.commit('changeCollapse')
}
const quit = () => {
    ElMessageBox.confirm(
        '真的要注销登录吗?',
        '友情提示',
        {
            type: 'warning',
            icon: markRaw(QuestionFilled),
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    ).then(() => {
        let path = proxy.$route.path
        let query = proxy.$route.query
        if (path == '/index') {
            localStorage.setItem('itemIndex', query.itemIndex)
            localStorage.removeItem('token')
            sessionStorage.removeItem('permissions')
            proxy.$router.push('/')
        } else {
            localStorage.setItem('path', path)
            localStorage.setItem('title', query.title)
            localStorage.setItem('subTitle', query.subTitle)
            localStorage.setItem('itemIndex', query.itemIndex)
            localStorage.removeItem('token')
            proxy.$router.push('/')
        }
    }).catch(() => {
        console.log('取消');
    })
}
</script>

<style scoped>
.topBar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.el-icon {
    vertical-align: middle;
    cursor: pointer;
}

.m-2 {
    margin-left: 15px;
}

.m-3 {
    margin-right: 5px;
}

span {
    cursor: pointer;
    font-size: 14px;
}

.breadcrumb {
    display: flex;
    align-items: center;
}

.el-breadcrumb {
    margin-left: 70px;
}
</style>