<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item required label="规格类型：" prop="type" :label-width="formLabelWidth">
            <el-radio-group @change="changeLable" v-model="ruleForm.type" class="ml-4">
                <el-radio label="1" size="large">单规格</el-radio>
                <el-radio label="2" size="large">多规格</el-radio>
            </el-radio-group>
        </el-form-item>
        <div v-show="show1">
            <el-form-item required label="商品价格：" prop="price" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.price" type="number" autocomplete="off" />元
            </el-form-item>
            <el-form-item label="划价线：" prop="line" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.line" type="number" autocomplete="off" />元
            </el-form-item>
            <el-form-item label="当前库存数量：" prop="count" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.count" type="number" autocomplete="off" />件
            </el-form-item>
            <el-form-item required label="商品重量：" prop="wei" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.wei" type="number" autocomplete="off" />千克(Kg)
            </el-form-item>
        </div>
        <div v-show="show2">
            <el-form-item label="商品规格：" :label-width="formLabelWidth">
                <div v-for="(item, index) in key_list" :key="index" style="margin:60px 0">
                    <el-row style="margin-bottom: 20px; justify-content: space-between;">
                        <el-col :span="2">
                            <el-input v-model="item.title" placeholder=""></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button @click="remove(index)">删除规格组</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2" :offset="1" v-for="(items, indexs) in item.value" :key="'a' + indexs">
                            <el-input v-model="item.value[indexs]" placeholder=""></el-input>
                        </el-col>
                        <el-col :span="2" :offset="1">
                            <el-button @click="addValue(index)">+新增规格值</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-col :span="2">
                        <el-button @click="addKey">新增规格组</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="makeList">生成sku列表</el-button>
                    </el-col>
                </el-row>
                <el-table :data="sku_list">
                    <el-table-column :label="item.title" v-for="(item, index) in key_list" :key="index">
                        <template #default="scope">
                            {{ scope.row.sku[index] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="预览图" prop="img">
                        <template #default="a">
                            <el-upload class="avatar-uploader" name="img"
                                action="http://api_devs.wanxikeji.cn/api/savePic" :show-file-list="false" :on-success="(res, file) => {
                                    handleAvatarSuccess(res, a.$index)
                                }">
                                <img v-if="a.row.img" :src="a.row.img" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品价格">
                        <template #default="scope">
                            <el-input v-model="scope.row.price" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="划线价格">
                        <template #default="scope">
                            <el-input v-model="scope.row.linePrice" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存数量">
                        <template #default="scope">
                            <el-input v-model="scope.row.count" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品重量(KG)">
                        <template #default="scope">
                            <el-input v-model="scope.row.weight" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="SKU编码">
                        <template #default="scope">
                            <el-input v-model="scope.row.skuCode" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </div>
        <el-form-item required label="库存计算方式：" prop="check" :label-width="formLabelWidth">
            <el-radio-group v-model="ruleForm.check" class="ml-4">
                <el-radio label="1" size="large">下单减库存</el-radio>
                <el-radio label="2" size="large">付款减库存</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const store = useStore()
let ruleFormRef = ref(null)
const formLabelWidth = '140px'
let show1 = ref(true)
let show2 = ref(false)
let key_list = ref([])
let sku_list = ref([])
// let editInfo = ref({})
const ruleForm = ref({
    type: '1',
    price: 1.00,
    line: '',
    count: 100,
    wei: 0,
    check: '1',
})
const props = defineProps({
    editInfo: Object
})
const changeLable = (val) => {
    if (val == 1) {
        show1.value = true
        show2.value = false
    } else if (val == 2) {
        show2.value = true
        show1.value = false
    }
}
const submitForm = (fun) => {
    ruleFormRef.value.validate(fun)
}
const price = () => {
    return ruleForm.value.price
}
const sendkeyList = () => {
    return key_list.value
}
const sendskuList = () => {
    return sku_list.value
}
defineExpose(
    { submitForm: submitForm, price: price, sendkeyList: sendkeyList, sendskuList: sendskuList }
)
let addValue = (index) => {
    key_list.value[index].value.push('')
}
let addKey = () => {
    key_list.value.push(
        {
            title: "",
            value: ['']
        }
    )
}
const remove = (index) => {
    ElMessageBox.confirm(
        '确定删除该规格组吗',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        key_list.value.splice(index, 1)
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        })
    }).catch(() => {})
}
let makeList = () => {
    sku_list.value = []
    let temp = []
    key_list.value.forEach((item, index) => {
        if (index == 0) {
            temp = item.value
        } else {
            let arr = []
            temp.forEach(v1 => {
                item.value.forEach(v2 => {
                    arr.push(v1 + "+" + v2)
                })
            })
            temp = arr
        }
    })
    temp.forEach(item => {
        sku_list.value.push({
            sku: item.split("+"),
            img: '',
            price: ''
        })
    })
}
const handleAvatarSuccess = (
    response,
    index
) => {
    sku_list.value[index].img = "http://api_devs.wanxikeji.cn/" + response.data
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/goodInfo',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            good_id: store.state.commondityInfo.good_id
        }
    }).then((res) => {
        if (res.status == 200) {
            // console.log(res);
            key_list.value = JSON.parse(res.data.data.info[0].edition).sku_column
            sku_list.value = JSON.parse(res.data.data.info[0].edition).sku_list
        }
    }).catch((error) => {
        console.log(error);
    })
}
onMounted(() => {
    let query = proxy.$route.query.isEdit
    if (query) {
        getData()
        ruleForm.value.price = store.state.commondityInfo.price
    }
    // console.log(editInfo.value);
})
</script>
<style scoped>
.el-form {
    max-height: 70vh;
    overflow: auto;
}

:deep(.el-tabs) {
    height: 70vh;
    overflow: auto;
}

.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 100px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

p {
    margin-left: 140px;
    font-size: 13px;
    color: rgba(0, 0, 0, .45);
}

.avatar {
    width: 50px;
}

/* .el-row {
    justify-content: ;
} */

.el-col-offset-1 {
    margin: 0;
    margin-left: 40px;
}

.el-col-2:nth-child(2) {
    margin-left: 50px;
}

:deep(.el-form-item__content) {
    display: inline-block;
    max-width: 900px;
}
</style>