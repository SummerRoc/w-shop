<template>
    <div class="container">
        <p>商品列表</p>
        <div class="serach">
            <span>商品名称:</span>
            <el-input v-model="input1" placeholder="请输入商品名称" />
            <span class="span1">商品编码:</span>
            <el-input v-model="input2" placeholder="请输入商品编码" />
            <span class="span1">商品分类:</span>
            <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button type="primary" :icon="Search">搜索</el-button>
        </div>
        <el-row>
            <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first"></el-tab-pane>
                <el-tab-pane label="出售中" name="second"></el-tab-pane>
                <el-tab-pane label="已下架" name="third"></el-tab-pane>
                <el-tab-pane label="已售罄" name="fourth"></el-tab-pane>
            </el-tabs>
            <el-button class="btn" type="primary" @click="toCreateGoods">
                <el-icon>
                    <Plus color="white" />
                </el-icon>创建商品
            </el-button>
            <div class="show" v-if="isShow">
                <el-button>
                    <el-icon>
                        <Top />
                    </el-icon>上架
                </el-button>
                <el-button>
                    <el-icon>
                        <Bottom />
                    </el-icon>下架
                </el-button>
                <el-button>
                    <el-icon>
                        <Delete />
                    </el-icon>删除
                </el-button>
            </div>
        </el-row>
        <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
            <el-table-column width="50px">
                <template #header>
                    <el-checkbox @change="checkAllItem" v-model="checkedAll" />
                </template>
                <template #default="scope">
                    <el-checkbox @change="checkItem" v-model="scope.row.itemCheck" />
                </template>
            </el-table-column>
            <el-table-column label="商品ID">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.good_id }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品图片">
                <template #default="scope">
                    <img :src="scope.row.img" alt="">
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="250px">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.good_name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品价格">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.price }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="总销量">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="库存总量">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <!-- <span>{{ scope.row.status }}</span> -->
                        <el-tag class="ml-2" type="success">上架</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="添加时间" width="180px">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.create_time }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span class="edit" @click="editToGoods(scope.row)">编辑</span>
                        <span class="delate" @click="delate(scope.row.good_id)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 150, 200]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, markRaw } from 'vue'
import { Search, Plus, QuestionFilled, Top, Bottom, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex';
const store = useStore()
const { proxy } = getCurrentInstance()
let activeName = ref('first')
let input1 = ref('')
let input2 = ref('')
let value = ref('')
let isShow = ref(false)
let checkedAll = ref(false)
let total = ref()
let currentPage = ref(1)
let pageSize = ref(100)
let tableData = ref([])
let options = ref([
    {
        value: 'Option1',
        label: 'Option1',
    }
])
const handleSizeChange = () => {
    getData()
}
const handleCurrentChange = () => {
    getData()
    // currentData.value = tableData.value.slice((_currentPage - 1) * _pageSize, _pageSize * _currentPage)
}
const checkAllItem = () => {
    isShow.value = checkedAll.value
    // console.log(checkedAll.value);
    tableData.value.forEach(ele => {
        // console.log(ele.itemCheck);
        ele.itemCheck = checkedAll.value
    });
    // console.log(_item);
}
const checkItem = () => {
    // console.log(_item);
    let arr = tableData.value.filter((ele) => ele.itemCheck)
    if (arr.length > 0) {
        isShow.value = true
    } else {
        isShow.value = false
    }
    if (arr.length == tableData.value.length) {
        checkedAll.value = true
    } else {
        checkedAll.value = false
    }
}
const delate = (_good_id) => {
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
            url: 'http://api_devs.wanxikeji.cn/api/admin/deleteGood',
            method: 'post',
            data: {
                token: localStorage.getItem('token'),
                good_id: _good_id
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
const handleClick = (tab, event) => {
    console.log(tab, event)
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/goodList',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            page: currentPage.value,
            size: pageSize.value
        }
    }).then((res) => {
        // console.log(res);
        tableData.value = res.data.data.data
        tableData.value.forEach((item) => {
            item.create_time = new Date(item.create_time * 1000).toLocaleString()
            item.itemCheck = false
        })
        tableData.value.sort((a, b) => {
            return a.good_id - b.good_id
        })
        total.value = res.data.data.count
    }).catch((error) => {
        console.log(error);
    })
}
const editToGoods = (val) => {
    console.log(val);
    store.commit('getCommondityInfo', val)
    proxy.$router.push({
        path: '/createCommondity',
        query: { title: '商品管理', subTitle: '创建商品', isEdit: 'true', itemIndex: '3' }
    })
}
const toCreateGoods = () => {
    proxy.$router.push({
        path: '/createCommondity',
        query: { title: '商品管理', subTitle: '创建商品', itemIndex: '3' }
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

span {
    font-size: 14px;
}

.span1,
.el-button {
    margin-left: 15px;
}

.el-input,
.el-select {
    width: 200px;
    margin-left: 7px;
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.el-tabs,
.btn,
.show {
    margin-top: 20px;
}

.show {
    margin-left: 15px;
}

.show .el-button {
    margin: 0;
}

.el-table {
    height: 55vh;
}

.delate {
    margin-left: 15px;
}

.edit,
.delate {
    color: skyblue;
    cursor: pointer;
}

.el-tabs {
    --el-tabs-header-height: 32px;
}

.demo-pagination-block {
    margin-top: 25px;
}

.cell img{
    width: 80px;
}
</style>