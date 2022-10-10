<template>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules">
        <el-form-item label="商品名称：" prop="name" label-width="140px">
            <el-input v-model="ruleForm.name" clearable placeholder="请输入商品名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品分类：" prop="classify" label-width="140px">
            <el-tree-select v-model="ruleForm.classify" :data="data" :props="defaultProps" node-key="good_type_id"
                @check="currentChecked" :default-expanded-keys="tearr" placeholder="请选择商品分类" show-checkbox />
        </el-form-item>
        <el-form-item label="商品图片：" label-width="140px">
            <el-upload class="avatar-uploader" action="http://api_devs.wanxikeji.cn/api/savePic" :show-file-list="false"
                name="img" :auto-upload="false" :on-change="upfile">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="商品编码：" label-width="140px">
            <el-input v-model="ruleForm.code" clearable placeholder="请输入商品编码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="运费模板：" prop="bn" label-width="140px">
            <el-select v-model="ruleForm.bn" placeholder="请选择运费模板">
                <el-option value="全国包邮" lable="全国包邮"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="商品状态：" prop="status" label-width="140px">
            <el-radio-group v-model="ruleForm.status">
                <el-radio label="1" size="large">上架</el-radio>
                <el-radio label="2" size="large">下架</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item required label="排序：" prop="sort" label-width="140px">
            <el-input v-model="ruleForm.sort" autocomplete="off" style="width:80px" type="number" />
        </el-form-item>
        <p>数字越小越靠前</p>
    </el-form>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance()
const store = useStore()
let ruleFormRef = ref(null)
let data = ref([])
let arr = ref([])
// let tree = ref(null)
let tearr = ref([])
let imageUrl = ref('')
const ruleForm = ref({
    name: '',
    classify: '',
    img: '',
    code: '',
    bn: '全国包邮',
    status: '1',
    sort: '100'
})
const defaultProps = {
    label: 'type_name'
}
const currentChecked = (a, b) => {
    console.log(a);
    console.log(b);
    ruleForm.value.classify = a.good_type_id
    // console.log(ruleForm.value.classify);
}
const upfile = (uploadFile) => {
    // console.log(uploadFile);
    let form = new FormData()
    form.append("img", uploadFile.raw)
    proxy.$axios({
        url: "http://api_devs.wanxikeji.cn/api/savePic",
        method: "post",
        data: form
    }
    ).then((res) => {
        // console.log(res);
        imageUrl.value = "http://api_devs.wanxikeji.cn/" + res.data.data
    })
}
const rules = ref({
    name: [{ required: true, min: 2, message: '请输入至少2个字符', trigger: 'blur' }],
    classify: [{ required: true, message: '请至少选择一个商品分类', trigger: 'blur' }],
    img: [{ required: true, message: '请至少上传1张商品图片', trigger: 'blur' }],
    bn: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
})
const submitForm = (fun) => {
    ruleFormRef.value.validate(fun)
}
const good_name = () => {
    return ruleForm.value.name
}
const type_id = () => {
    return ruleForm.value.classify
}
const testimg = () => {
    return imageUrl.value
}
defineExpose(
    { submitForm: submitForm, good_name: good_name, type_id: type_id, testimg: testimg },
)
function getData() {
    proxy.$axios({
        method: 'post',
        url: 'http://api_devs.wanxikeji.cn/api/goodType'
    }).then((res) => {
        // console.log(res);
        arr.value = res.data.data
        arr.value.forEach((item) => {
            item.create_time = new Date(item.create_time * 1000).toLocaleString()
            item.value = item.good_type_id
        })
        data.value = changeData(0)
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
    let query = proxy.$route.query.isEdit
    if (query) {
        ruleForm.value.name = store.state.commondityInfo.good_name
        // console.log(store.state.commondityInfo.type_id);
        // ruleForm.value.classify = store.state.commondityInfo.type_id
        imageUrl.value = store.state.commondityInfo.img
        tearr.value.push(store.state.commondityInfo.type_id)
        // tree.value.setCheckedKeys(testArr,false)
        ruleForm.value.classify = store.state.commondityInfo.type_id
    }
})
</script>
<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

p {
    margin-left: 140px;
    font-size: 13px;
    color: rgba(0, 0, 0, .45);
}

.avatar-uploader .avatar {
    width: 78px;
    height: 78px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    text-align: center;
}
</style>