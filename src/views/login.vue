<template>
    <div class="container">
        <el-row justify="center" class="m-1">
            <el-col :span="4">
                <img width="50" src="../assets/logo.a3adccf1.svg" alt="">
            </el-col>
        </el-row>
        <el-row justify="center" class="m-1">
            <el-col :span="4">
                <p>商城系统登录</p>
            </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="4">
                <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
                    <el-form-item prop="name">
                        <el-input v-model="ruleForm.name" :prefix-icon="User" size="large" placeholder="请输入用户名"
                            clearable autocomplete="off" />
                    </el-form-item>
                    <el-form-item prop="pw">
                        <el-input v-model="ruleForm.pw" :prefix-icon="Lock" size="large" type="password"
                            placeholder="请输入用户密码" clearable show-password autocomplete="off" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="large" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, getCurrentInstance } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useStore } from "vuex";
const { proxy } = getCurrentInstance()
const store = useStore()
let arr = ref([])
let newArr = ref([])
let ruleFormRef = ref(null)
let ruleForm = ref({
    name: '',
    pw: '',
})
const validateUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('用户名不能为空'))
    } else {
        if (ruleForm.value.pw !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('pw', () => null)
        }
        callback()
    }
}
const validatePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        callback()
    }
}
const rules = ref({
    name: [{ validator: validateUsername, trigger: 'blur' }],
    pw: [{ validator: validatePassword, trigger: 'blur' },]
})
const onSubmit = () => {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            proxy.$axios({
                url: 'http://api_devs.wanxikeji.cn/api/admin/login',
                method: 'post',
                data: ruleForm.value
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res);
                    // arr.value = res.data.data.permissions
                    // console.log(arr.value);
                    // newArr.value = changeData(0)
                    // console.log(newArr.value);
                    // store.dispatch('setValFunc',newArr.value)
                    localStorage.setItem('token', res.data.data.token)
                    // sessionStorage.setItem('permissions', JSON.stringify(newArr.value))
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                    proxy.$router.push({ path: '/index' })
                    let path = localStorage.getItem('path')
                    let title = localStorage.getItem('title')
                    let subTitle = localStorage.getItem('subTitle')
                    let itemIndex = localStorage.getItem('itemIndex')
                    if (path == '/index') {
                        setTimeout(() => {
                            proxy.$router.push({ path: '/index', query: { itemIndex: itemIndex } })
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            proxy.$router.push({ path: path, query: { title: title, subTitle: subTitle, itemIndex: itemIndex } })
                        }, 1500);
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
// function changeData(temp) {
//     let newArr = []
//     for (let i = 0; i < arr.value.length; i++) {
//         if (arr.value[i].parent_id == temp) {
//             newArr.push(arr.value[i])
//             arr.value[i].children = changeData(arr.value[i].permission_id)
//         }
//     }
//     return newArr
// }
</script>

<style scoped>
.container {
    background-image: url(../assets/background.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100%;
    height: 100%;
    margin-top: 270px;
}

.m-1 {
    text-align: center;
    margin-bottom: 20px;
}

p {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: #6c7293;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.el-input {
    margin-bottom: 12px;
}

:deep(.el-input__wrapper) {
    background: rgba(235, 237, 242, .4);
}

.el-button {
    border: none;
    width: 100%;
    font-size: 16px;
    margin-top: 12px;
    background-color: #1890ff;
}

.el-button:hover {
    box-shadow: 0 16px 16px 0 rgba(34, 185, 255, .15);
    background-color: rgb(64, 169, 255);
}
</style>