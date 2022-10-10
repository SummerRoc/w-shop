<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" :size="formSize" status-icon>
        <el-form-item prop="text">
            <el-row>
                <el-col :span="7">
                    <div style="border: 1px solid #ccc">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                            :defaultConfig="toolbarConfig" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="ruleForm.text"
                            :defaultConfig="editorConfig" @onCreated="handleCreated" />
                    </div>
                </el-col>
            </el-row>
        </el-form-item>
    </el-form>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, reactive, ref, shallowRef, onMounted, getCurrentInstance } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useStore } from 'vuex';
let { proxy } = getCurrentInstance()
const store = useStore()
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
    text: ''
})
const props = defineProps({
    info: String
})
const check = (rule, value, callback) => {
    if (!value || value == "<p><br></p>") {
        callback(new Error("商品详情不可为空"))
    } else {
        callback()
    }
}
const rules = reactive({
    text: [
        { validator: check, trigger: 'blur' },
    ],
})

const submitForm = (fun) => {
    ruleFormRef.value.validate(fun)
}
const info = () => {
    return ruleForm.text
}
defineExpose(
    { submitForm: submitForm, info: info }
)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         ruleForm.text = '<p>模拟 Ajax 异步设置内容</p>'
//     }, 3500)
// })

const toolbarConfig = {}
// toolbarConfig.toolbarKeys = ['bold', 'underline', 'italic', 'through', 'code', 'sub', 'sup', 'clearStyle', 'color', 'bgColor', 'fontSize', 'fontFamily', 'indent', 'delIndent', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify', 'lineHeight', 'insertImage', 'deleteImage', 'editImage', 'viewImageLink', 'imageWidth30', 'imageWidth50', 'imageWidth100', 'divider', 'emotion', 'insertLink', 'editLink', 'unLink', 'viewLink', 'codeBlock', 'blockquote', 'headerSelect', 'header1', 'header2', 'header3', 'header4', 'header5', 'todo', 'redo', 'undo', 'fullScreen', 'enter', 'bulletedList', 'numberedList', 'insertTable', 'deleteTable', 'insertTableRow', 'deleteTableRow', 'insertTableCol', 'deleteTableCol', 'tableHeader', 'tableFullWidth', 'insertVideo', 'uploadVideo', 'editVideoSize', 'uploadImage', 'codeSelectLang']

const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }

editorConfig.MENU_CONF['uploadImage'] = {
    // 自定义上传
    async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        console.log(file);
        let form = new FormData()
        form.append("img", file)
        proxy.$axios({
            url: "http://api_devs.wanxikeji.cn/api/savePic",
            method: "post",
            data: form
        }).then((res) => {
            let url = "http://api_devs.wanxikeji.cn/" + res.data.data
            // 自己实现上传，并得到图片 url alt href
            // 最后插入图片
            insertFn(url, "sdf")
        })

    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
    // console.log(editor.getAllMenuKeys(), '5454545');
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
            ruleForm.text = JSON.parse(res.data.data.info[0].info)
        }
    }).catch((error) => {
        console.log(error);
    })
}
onMounted(() => {
    let query = proxy.$route.query.isEdit
    if (query) {
        getData()
        ruleForm.text = props.info
    }
    // console.log(editInfo.value);
})
</script>
