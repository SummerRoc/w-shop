<template>
    <div class="container">
        <p>管理员列表</p>
        <div class="addSerch">
            <el-button type="primary" @click="openAddDialog">
                <el-icon>
                    <Plus color="white" />
                </el-icon>新增
            </el-button>
            <div>
                <el-input placeholder="请输入用户名/姓名" clearable>
                    <template #append>
                        <el-button :icon="Search" />
                    </template>
                </el-input>
            </div>
        </div>
        <el-table v-if="isReloadData" :data="tableData" style="width: 100%; margin-top: 25px;">
            <el-table-column label="管理员ID">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.admin_id }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用户名">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.admin_name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="姓名">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>系统管理员</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>100</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="添加时间">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.create_time }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span class="edit">编辑</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 150, 200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <addAdmin :dialogAddVisible="dialogAddVisible" :closeAddDialog="closeAddDialog" />
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import addAdmin from '@/components/admin/addAdmin.vue'
const { proxy } = getCurrentInstance()
let dialogAddVisible = ref(false)
let tableData = ref([])
let total = ref()
let isReloadData = ref(true)
let currentPage = ref(1)
let pageSize = ref(100)
const openAddDialog = () => {
    dialogAddVisible.value = true
}
const closeAddDialog = () => {
    dialogAddVisible.value = false
}
const handleCurrentChange = () => {
    getData()
}
const handleSizeChange = () => {
    getData()
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/accountList',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            page: currentPage.value,
            size: pageSize.value
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
            total.value = res.data.data.count
            tableData.value = res.data.data.data
            tableData.value.forEach((item) => {
                item.create_time = new Date(item.create_time * 1000).toLocaleString()
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}
onMounted(() => {
    getData()
})
</script>

<style scoped>
.container {
    background-color: #fff;
    padding: 20px;
}

.addSerch {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-input {
    width: 300px;
}

:deep(.el-table .el-table__cell) {
    padding: 12px 0;
}

.edit {
    color: skyblue;
    cursor: pointer;
}


.el-table {
    height: 60vh;
}

.el-icon {
    cursor: pointer;
}
</style>