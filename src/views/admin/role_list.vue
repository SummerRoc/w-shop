<template>
    <div class="container">
        <p>角色管理</p>
        <div class="addSerch">
            <el-button type="primary" @click="addRoleList">
                <el-icon>
                    <Plus color="white" />
                </el-icon>新增
            </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
            <el-table-column label="角色ID">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.role_id }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="角色名称">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.role_name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.sort }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="添加时间">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.created_at }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span class="edit" @click="openEditDialog(scope.row)">编辑</span>
                        <span class="delate" @click="delate">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 150, 200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <addRole :itemFormInfo="itemFormInfo" :tableData="tableData" :dialogAddVisible="dialogAddVisible" :closeAddDialog="closeAddDialog" />
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import addRole from '@/components/admin/addRole.vue'
// import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
// const store = useStore()
let dialogAddVisible = ref(false)
let tableData = ref([])
let total = ref()
let currentPage = ref(1)
let pageSize = ref(100)
let itemFormInfo = ref({})
const closeAddDialog = () => {
    dialogAddVisible.value = false
    itemFormInfo.value = {}
}
const addRoleList = () => {
    dialogAddVisible.value = true
}
const openEditDialog = (val) => {
    // console.log(val);
    dialogAddVisible.value = true
    itemFormInfo.value = val
}
const handleCurrentChange = () => {
    getData()
}
const handleSizeChange = () => {
    getData()
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn//api/admin/roleLise',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            page: currentPage.value,
            size: pageSize.value
        }
    }).then((res) => {
        if (res.status == 200) {
            // console.log(res);
            total.value = res.data.data.count
            tableData.value = res.data.data.data
            // store.dispatch('setValFuncTest', res.data.data.data)
            tableData.value.forEach((item) => {
                item.created_at = new Date(item.created_at * 1000).toLocaleString()
            })
        }
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

.el-input {
    width: 300px;
}

.edit,
.delate {
    color: skyblue;
    cursor: pointer;
}

.delate {
    margin-left: 10px;
}

.el-table {
    height: 60vh;
}
/* .addSerch {
    display: flex;
    justify-content: space-between;
    align-items: center;
} */

</style>