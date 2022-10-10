<template>
    <div class="container">
        <span>创建商品</span>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <basicInfor ref="myBasicInfor" />
            </el-tab-pane>
            <el-tab-pane label="规格/库存" name="second">
                <specification ref="mySpecification" />
            </el-tab-pane>
            <el-tab-pane label="商品详情" name="third">
                <wangeditor ref="myWangeditor" />
            </el-tab-pane>
        </el-tabs>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import basicInfor from '@/components/commondity/basicInfor.vue'
import specification from '@/components/commondity/specification.vue'
import wangeditor from '@/components/commondity/wangeditor.vue'
const store = useStore()
const { proxy } = getCurrentInstance()
let activeName = ref('first')
let myBasicInfor = ref(null)
let mySpecification = ref(null)
let myWangeditor = ref(null)
let obj = ref(
    { good_name: '', type_id: '', price: '', img: '', imgs: '', info: '', colour: {}, edition: {} }
)
const handleClick = (tab, event) => { }
const submitForm = () => {
    myBasicInfor.value.submitForm((valid) => {
        if (valid) {
            obj.value.good_name = myBasicInfor.value.good_name()
            obj.value.type_id = myBasicInfor.value.type_id()
            obj.value.img = myBasicInfor.value.testimg()
            obj.value.imgs = myBasicInfor.value.testimg()
            mySpecification.value.submitForm((valid2) => {
                if (valid2) {
                    obj.value.price = mySpecification.value.price()
                    obj.value.colour.skuCode = mySpecification.value.sendskuList()[0].skuCode
                    obj.value.colour.weight = mySpecification.value.sendskuList()[0].weight
                    obj.value.colour.linePrice = mySpecification.value.sendskuList()[0].linePrice
                    obj.value.edition.sku_column = mySpecification.value.sendkeyList()
                    obj.value.edition.sku_list = mySpecification.value.sendskuList()
                    // store.commit('getEdition', obj.value.edition)
                    myWangeditor.value.submitForm((valid3) => {
                        if (valid3) {
                            obj.value.info = myWangeditor.value.info()
                            // store.commit('getInfo', obj.value.info)
                            let query = proxy.$route.query.isEdit
                            if (query) {
                                getData2()
                            } else {
                                getData()
                            }
                        } else {
                            activeName.value = "third"
                        }
                    })
                } else {
                    activeName.value = "second"
                    console.log('error');
                }
            })
        } else {
            activeName.value = "first"
        }
    })
}
function getData2() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/addModifyGood',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            good_name: obj.value.good_name,
            type_id: obj.value.type_id,
            price: obj.value.price,
            img: obj.value.img,
            type_parent_id: 2,
            imgs: obj.value.imgs,
            info: obj.value.info,
            colour: obj.value.colour,
            edition: obj.value.edition,
            good_id: store.state.commondityInfo.good_id
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res, 1);
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
            proxy.$router.push({
                path: '/goodlist',
                query: {
                    title: '商品管理',
                    subTitle: '商品列表',
                    itemIndex: 3
                }
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/addModifyGood',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            good_name: obj.value.good_name,
            type_id: obj.value.type_id,
            price: obj.value.price,
            img: obj.value.img,
            type_parent_id: 2,
            imgs: obj.value.imgs,
            info: obj.value.info,
            colour: obj.value.colour,
            edition: obj.value.edition,
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
            ElMessage({
                message: '新增成功',
                type: 'success',
            })
            proxy.$router.push({
                path: '/commondityList',
                query: {
                    title: '商品管理',
                    subTitle: '商品列表',
                    itemIndex: 3
                }
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}
function getDataTest() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/goodInfo',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            good_id: store.state.commondityInfo.good_id
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
        }
    }).catch((error) => {
        console.log(error);
    })
}
onMounted(() => {
    let query = proxy.$route.query.isEdit
    if (query) {
        getDataTest()
    }
})
</script>

<style scoped>
.container {
    background-color: #fff;
    padding: 20px;
}

.el-button {
    margin-left: 150px;
}
</style>