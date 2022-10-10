<template>
    <el-dialog :model-value="props.dialogAddVisible" @open="open" @close="closeDown" title="新增角色" width="40%">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName" label-width="140px">
                <el-input v-model="ruleForm.roleName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="上级角色" label-width="140px">
                <el-select v-model="ruleForm.lastRole" class="m-2" placeholder=" ">
                    <el-option label="顶级角色" value="顶级角色">顶级角色</el-option>
                    <el-option v-for="(item, index) in props.tableData" :key="index" :label="item.role_name"
                        :value="item.role_name" />
                </el-select>
            </el-form-item>
            <el-form-item label="菜单权限" label-width="140px">
                <el-tree ref="tree" v-model="ruleForm.permissions" :data="data" node-key="permission_id"
                    :props="defaultProps" show-checkbox @check-change="currentChecked" />
            </el-form-item>
            <p>设置该角色有权操作的功能</p>
            <el-form-item required label="排序" prop="sort" label-width="140px">
                <el-input class="sort" v-model.number="ruleForm.sort" type="number" />
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
import { ref, getCurrentInstance, onMounted, nextTick, inject } from 'vue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
let ruleFormRef = ref(null)
let tree = ref(null)
let reload = inject('reload')
let testarr = ref([])
const ruleForm = ref({
    roleName: '',
    lastRole: '顶级角色',
    permissions: '',
    sort: '100'
})
const data = ref([])
let arr = ref([])
let newAr = ref([])
const defaultProps = ref({
    children: 'children',
    label: 'permission_name',
})
const props = defineProps({
    dialogAddVisible: Boolean,
    closeAddDialog: Function,
    tableData: Object,
    itemFormInfo: Object,
})
const currentChecked = () => {
    ruleForm.value.permissions = tree.value.getCheckedKeys()
}
const cancel = () => {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
}
function closeDown() {
    props.closeAddDialog()
    ruleFormRef.value.resetFields()
    newAr.value = []
    nextTick(() => {
        tree.value.setCheckedKeys([])
    })
}
function open() {
    console.log(props.itemFormInfo);
    if (Object.keys(props.itemFormInfo).length > 0) {
        ruleForm.value.roleName = props.itemFormInfo.role_name
        ruleForm.value.sort = props.itemFormInfo.sort
        props.itemFormInfo.permission.forEach((item) => {
            newAr.value.push(item.permission_id)
        })
        nextTick(() => {
            tree.value.setCheckedKeys(newAr.value)
        })
    } else if (Object.keys(props.itemFormInfo).length == 0) {
        ruleForm.value.roleName = ''
        ruleForm.value.sort = 100
        ruleForm.value.permissions = ''
    } else {
        console.log(1);
    }
}
const rules = ref({
    roleName: [{ required: true, min: 2, message: '请输入至少2个字符', trigger: 'blur' }]
})
const submitForm = () => {
    ruleFormRef.value.validate((valid) => {
        if (valid) {
            if (Object.keys(props.itemFormInfo).length == 0) {
                getData1()
                reload()
            } else {
                // console.log(ruleForm.value.permissions);
                getData2()
                reload()
            }
        } else {
            console.log('error submit!')
            return false
        }
    })
}
function getData2() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn//api/admin/roleAddModify',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            role_name: ruleForm.value.roleName,
            permissions: ruleForm.value.permissions,
            sort: ruleForm.value.sort,
            role_id: props.itemFormInfo.role_id
        }
    }).then((res) => {
        if (res.status == 200) {
            console.log(res);
            props.closeAddDialog()
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}
function getData1() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn//api/admin/roleAddModify',
        method: 'post',
        data: {
            token: localStorage.getItem('token'),
            role_name: ruleForm.value.roleName,
            permissions: ruleForm.value.permissions,
            sort: ruleForm.value.sort,
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
function getListData() {
    proxy.$axios({
        url: 'http://api_devs.wanxikeji.cn//api/admin/permissionList',
        method: 'post',
        data: {
            token: localStorage.getItem('token')
        }
    }).then((res) => {
        if (res.status == 200) {
            // console.log(res);
            arr.value = res.data.data
            data.value = changeData(0)
            // console.log(data.value);
        }
    })
}
function changeData(temp) {
    let newArr = []
    for (let i = 0; i < arr.value.length; i++) {
        if (arr.value[i].parent_id == temp) {
            newArr.push(arr.value[i])
            arr.value[i].children = changeData(arr.value[i].permission_id)
        }
    }
    return newArr
}
onMounted(() => {
    getListData()
})
</script>

<style scoped>
.el-input,
.el-select {
    width: 50%;
}

.sort {
    width: 80px;
}

p {
    margin-left: 140px;
    font-size: 13px;
    color: rgba(0, 0, 0, .45);
}
</style>