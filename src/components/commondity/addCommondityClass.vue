<template>
    <el-dialog :model-value="props.dialogAddVisible" @open="open" @close="closeDown" title="新增商品分类" width="40%">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
            <el-form-item label="分类名称：" prop="className" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.className" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="上级分类：" :label-width="formLabelWidth">
                <el-tree-select v-model="ruleForm.lastClass" @current-change="currentChecked" node-key="good_type_id"
                    :data="props.classList" :default-expanded-keys="tearr" :props="defaultProps" check-strictly
                    :render-after-expand="false" />
            </el-form-item>
            <el-form-item label="分类图片：" :label-width="formLabelWidth">
                <el-upload class="avatar-uploader" action="http://api_devs.wanxikeji.cn/api/savePic"
                    :show-file-list="false" name="img" :auto-upload="false" :on-change="upfile">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item required label="状态：" :label-width="formLabelWidth">
                <el-radio-group v-model="radio1" class="ml-4">
                    <el-radio label="显示" size="large">显示</el-radio>
                    <el-radio label="隐藏" size="large">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <p>用户端是否显示</p>
            <el-form-item required label="排序：" prop="sort" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.sort" autocomplete="off" style="width:80px" type="number" />
            </el-form-item>
            <p>数字越小越靠前</p>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const formLabelWidth = '140px'
const { proxy } = getCurrentInstance()
let ruleFormRef = ref(null)
let radio1 = ref('显示')
let tearr = ref([])
// let pid = ref('')
let reload = inject('reload')
const ruleForm = ref({
    className: '',
    lastClass: '',
    img: '',
    status: '',
    sort: '100'
})
const imageUrl = ref('')
const defaultProps = {
    value: 'good_type_id',
    label: 'type_name'
}
const props = defineProps({
    dialogAddVisible: Boolean,
    closeAddDialog: Function,
    classList: Object,
    itemFormInfo: Object,
})
const currentChecked = (a, b) => {
    console.log(a);
    // console.log(b);
    // console.log(test.value.getCurrentNode());
    ruleForm.value.lastClass = a.parent_id
    // ruleForm.value.permissions = b.checkedKeys
}
function open() {
    console.log(props.itemFormInfo);
    // console.log(props.classList);
    if (Object.keys(props.itemFormInfo).length > 0) {
        ruleForm.value.className = props.itemFormInfo.type_name
        imageUrl.value = props.itemFormInfo.pic
        tearr.value.push(props.itemFormInfo.parent_id)
        if (props.itemFormInfo.parent_id == 0) {
            ruleForm.value.lastClass == ''
        } else {
            ruleForm.value.lastClass = props.itemFormInfo.parent_id
        }
    } else if (Object.keys(props.itemFormInfo).length == 0) {
        ruleForm.value.roleName = ''
        ruleForm.value.lastClass = ''
        ruleForm.value.sort = 100
        ruleForm.value.img = ''
    } else {
        console.log(1);
    }
}
const upfile = (uploadFile) => {
    let form = new FormData()
    form.append("img", uploadFile.raw)
    proxy.$axios({
        url: "http://api_devs.wanxikeji.cn/api/savePic",
        method: "post",
        data: form
    }
    ).then((res) => {
        console.log(res);
        imageUrl.value = "http://api_devs.wanxikeji.cn/" + res.data.data
    })
}
const rules = ref({
    className: [{ required: true, min: 2, message: '请输入至少2个字符', trigger: 'blur' }]
})
const submitForm = () => {
    if (!ruleFormRef.value) return
    ruleFormRef.value.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            if (Object.keys(props.itemFormInfo).length == 0) {
                getData1()
                reload()
            } else {
                getData2()
                reload()
            }
            ruleFormRef.value.resetFields()
        } else {
            console.log('error submit!')
            return false
        }
    })
}
function getData2() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/addGoodType',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            name: ruleForm.value.className,
            pid: ruleForm.value.lastClass,
            pic: imageUrl.value,
            id: props.itemFormInfo.good_type_id
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
            props.closeAddDialog()
            // ElMessage({
            //     message: '新增成功',
            //     type: 'success',
            // })
        }
    }).catch((error) => {
        console.log(error);
    })
}
function getData1() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn/api/admin/addGoodType',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            name: ruleForm.value.className,
            pid: ruleForm.value.lastClass,
            pic: imageUrl.value
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
            props.closeAddDialog()
            ElMessage({
                message: '新增成功',
                type: 'success',
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}
const cancel = () => {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
}
function closeDown() {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
}
onMounted(() => {
    // console.log(props.classList);
    // console.log(test.value);
})
</script>

<style scoped>
.el-input {
    width: 340px;
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