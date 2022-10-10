<template>
    <el-dialog :model-value="props.dialogAddVisible" @close="closeDown" title="新增管理员" width="40%">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
            <el-form-item label="管理员姓名：" prop="name" label-width="140px">
                <el-input v-model="ruleForm.name" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户名：" prop="username" label-width="140px">
                <el-input v-model="ruleForm.username" clearable autocomplete="off" />
            </el-form-item>
            <p>后台登录用户名</p>
            <el-form-item label="所属角色：" prop="role" label-width="140px">
                <el-tree-select v-model="ruleForm.role" :data="data" :props="defaultProps" :render-after-expand="false"
                    placeholder=" " multiple show-checkbox />
            </el-form-item>
            <p>后台管理员角色</p>
            <el-form-item label="用户密码：" prop="pw" label-width="140px">
                <el-input v-model="ruleForm.pw" clearable show-password type="password" autocomplete="off" />
            </el-form-item>
            <p>后台登录密码</p>
            <el-form-item required label="确认密码：" prop="confirmPw" label-width="140px">
                <el-input v-model="ruleForm.confirmPw" clearable show-password type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item required label="排序：" prop="sort" label-width="140px">
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
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
// const store = useStore()
let ruleFormRef = ref(null)
let data = ref([])
let reload = inject('reload')
let ruleForm = ref({
    name: '',
    username: '',
    role: '',
    pw: '',
    confirmPw: '',
    sort: '100'
})
const defaultProps = {
    label: 'role_name'
}
const props = defineProps({
    dialogAddVisible: Boolean,
    closeAddDialog: Function,
})
const rules = ref({
    name: [{ required: true, min: 2, message: '请输入至少2个字符', trigger: 'blur' },],
    username: [{ required: true, min: 4, message: '请输入至少4个字符', trigger: 'blur' },],
    role: [{ required: true, message: '请至少选择一个角色', trigger: 'blur' }],
    pw: [{ required: true, message: '请输入至少6个字符', trigger: 'blur' }],
    confirmPw: [{ validator: checkPw, trigger: 'blur' }],
})
const submitForm = () => {
    if (!ruleFormRef.value) return
    ruleFormRef.value.validate((valid) => {
        if (valid) {
            proxy.$axios({
                url: 'http://api_devs.wanxikeji.cn/api/admin/register',
                method: 'post',
                data: {
                    token: localStorage.getItem('token'),
                    name: ruleForm.value.username,
                    pw: ruleForm.value.pw,
                    roles: ruleForm.value.role
                }
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res);
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    props.closeAddDialog()
                    reload()
                }
            }).catch((error) => {
                console.log(error);
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
function checkPw(rule, value, callback) {
    if (value == '') {
        callback(new Error('请输入确认密码'))
    } else if (value != ruleForm.value.pw) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}
function cancel() {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
}
function closeDown() {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
}
function getData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn//api/admin/roleLise',
        method: 'post',
        data: {
            token: localStorage.getItem('token')
        }
    }).then((res) => {
        if (res.status == 200) {
            // console.log(res);
            data.value = res.data.data.data
            // store.dispatch('setValFuncTest', res.data.data.data)
            data.value.forEach((item) => {
                item.value = item.role_id
            })
        }
    })
}
onMounted(() => {
    getData()
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
</style>