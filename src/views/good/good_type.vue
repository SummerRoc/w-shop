<template>
    <div class="container">
        <p>商品分类</p>
        <div class="addSerch">
            <el-button type="primary" @click="openAddDialog">
                <el-icon>
                    <Plus color="white" />
                </el-icon>新增
            </el-button>
        </div>
        <el-table :data="currentData" row-key="good_type_id" style="width: 100%; margin-top: 25px;">
            <el-table-column label="分类ID">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.good_type_id }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类名称">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.type_name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <!-- <span>{{ scope.row.status }}</span> -->
                        <el-tag class="ml-2" type="success">显示</el-tag>
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
                        <span>{{ scope.row.create_time }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span class="edit" @click="openEditDialog(scope.row)">编辑</span>
                        <span class="delate" @click="delate(scope.row.good_type_id)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 150, 200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @current-change="handleCurrentChange(currentPage, pageSize)" />
        </div>
        <addCommondityClass :itemFormInfo="itemFormInfo" :classList="tableData" :dialogAddVisible="dialogAddVisible"
            :closeAddDialog="closeAddDialog" />
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, markRaw } from 'vue'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import addCommondityClass from '@/components/commondity/addCommondityClass.vue'
const { proxy } = getCurrentInstance()
let arr = ref([])
const tableData = ref([])
let total = ref()
const dialogAddVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(100)
let currentData = ref([])
let itemFormInfo = ref({})
const handleCurrentChange = (_currentPage, _pageSize) => {
    // console.log(_currentPage);
    // console.log(_pageSize);
    currentData.value = tableData.value.slice((_currentPage - 1) * _pageSize, _pageSize * _currentPage)
}
// const dialogEditVisible = ref(false)
const openAddDialog = () => {
    dialogAddVisible.value = true
}
const openEditDialog = (val) => {
    // console.log(val);
    dialogAddVisible.value = true
    itemFormInfo.value = val
}
const closeAddDialog = () => {
    dialogAddVisible.value = false
    itemFormInfo.value = {}
}
const delate = (_good_type_id) => {
    ElMessageBox.confirm(
        '您确定要删除该记录吗?',
        '友情提示',
        {
            type: 'warning',
            icon: markRaw(QuestionFilled),
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    ).then(() => {
        proxy.$axios({
            method: 'post',
            url: 'http://api_devs.wanxikeji.cn/api/admin/deleteGoodtype',
            data: {
                token: localStorage.getItem('token'),
                id: _good_type_id
            }
        }).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    }).catch(() => {
        console.log('取消');
    })
}
function getData() {
    proxy.$axios({
        method: 'post',
        url: 'http://api_devs.wanxikeji.cn/api/admin/goodsTypeList',
        data: {
            token: localStorage.getItem('token')
        }
    }).then((res) => {
        // console.log(res);
        arr.value = res.data.data
        arr.value.forEach((item) => {
            item.create_time = new Date(item.create_time * 1000).toLocaleString()
        })
        tableData.value = changeData(0)
        // console.log(tableData.value);
        // tableData.value.sort((a, b) => {
        //     return a.good_type_id - b.good_type_id
        // })
        total.value = tableData.value.length
        currentData.value = tableData.value.slice(0, pageSize.value)
    }).catch((error) => {
        console.log(error);
    })
}
function changeData(temp) {
    let newArr = []
    for (let i = 0; i < arr.value.length; i++) {
        if (arr.value[i].parent_id == temp) {
            newArr.push(arr.value[i])
            arr.value[i].children = changeData(arr.value[i].good_type_id)
        }
    }
    return newArr
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

.el-table {
    height: 60vh;
}

:deep(.el-table td.el-table__cell div) {
    display: flex;
    align-items: center;
}

.delate {
    margin-left: 10px;
}

.edit,
.delate {
    color: skyblue;
    cursor: pointer;
}

.demo-pagination-block {
    margin-top: 25px;
}
</style>