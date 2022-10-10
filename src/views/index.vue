<template>
    <div class="common-layout">
        <el-container>
            <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="store.state.collapse"
                active-text-color="#fff" background-color="#001529" text-color="#A6ADB4">
                <div class="mb-2">w购商城2.0</div>
                <el-menu-item class="el-item-m1" v-for="(item, index) in arr" :key="index"
                    @click="showSubMenu(item, index)" :index="index + ''">
                    <span class="iconfont">{{ item.unicode }}</span>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
            </el-menu>
            <el-container>
                <el-header>
                    <topBar />
                </el-header>
                <el-container>
                    <el-Aside width="120px">
                        <p class="subTitle">{{ $route.query.title }}</p>
                        <el-menu router :default-active="$route.path" class="el-menu-vertical-demo">
                            <el-menu-item class="el-item-m2" v-for="(subItem, subIndex) in newArr" :key="subIndex"
                                :index="subItem.path"
                                :route="{ path: subItem.path, query: { title: $route.query.title, subTitle: subItem.title, itemIndex: $route.query.itemIndex } }">
                                <template #title>{{ subItem.title }}</template>
                            </el-menu-item>
                        </el-menu>
                    </el-Aside>
                    <el-main>
                        <router-view />
                        <myFoot />
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import topBar from '@/components/topBar.vue'
import myFoot from '@/components/footer.vue'
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex';
const store = useStore()
const { proxy } = getCurrentInstance()
let defaultActive = ref(proxy.$route.query.itemIndex)
// let arr = ref([])
let newArr = ref([])
let arr = ref([
    { title: '首页', unicode: '\ue632',child:[]},
    {
        title: '管理员', unicode: '\ue696', child: [
            { title: '管理员列表', path: '/adminList', index: 1 },
            { title: '角色管理', path: '/userManager', index: 1 }
        ]
    },
    { title: '店铺管理', unicode: '\ue61d' },
    {
        title: '商品管理', unicode: '\ue65d', child: [
            { title: '商品列表', path: '/goodlist', index: 3 },
            { title: '商品分类', path: '/commondityClassify', index: 3 }
        ]
    },
    { title: '订单管理', unicode: '\ue61c',child:[] },
    { title: '会员管理', unicode: '\ue749',child:[] },
    { title: '内容管理', unicode: '\ue686',child:[] },
    { title: '营销管理', unicode: '\ue62e',child:[] },
    { title: '数据统计', unicode: '\ue619',child:[] },
    { title: '客户端', unicode: '\ue650',child:[] },
    { title: '设置', unicode: '\ue64b',child:[] }
])

const showSubMenu = (_item, _index) => {
    if (_index == 0) {
        proxy.$router.push({ path: '/index', query: { itemIndex: _index } })
    }
    if (_item.child !== []) {
        newArr.value = _item.child
        // console.log(newArr.value);
        proxy.$router.push({
            path: newArr.value[0].path,
            query: { title: _item.title, subTitle: _item.child[0].title, itemIndex: _index }
        })
    } else {
        newArr.value = []
        console.log(1);
        proxy.$router.push({ path: _item.path, query: { title: _item.title, itemIndex: _index } })
    }
}
onMounted(() => {
    // arr.value = JSON.parse(sessionStorage.getItem('permissions'))
    // const addRoute = []
    // arr.value.forEach(item => {
    //     item.children.forEach(items => {
    //         addRoute.push({
    //             path: items.path,
    //             name: items.permission_name,
    //             component: () => import(`@/${items.component}`)
    //         })
    //     })
    // });
    // addRoute.forEach((item) => {
    //     proxy.$router.addRoute('index', item)
    // })
    // console.log(arr.value);
    // console.log(addRoute);
    // let path = proxy.$route.path
    // let query = proxy.$route.query.title
    // arr.value.forEach((item) => {
    //     // if (item.child != []) {
    //         item.child.forEach((items) => {
    //             if (items.path == path || item.title == query) {
    //                 newArr.value = item.child
    //             }
    //         })
    //     // }
    // })
})
</script>

<style scoped>
a {
    text-decoration: none;
    color: #fff;
}

.el-header {
    height: 64px;
}

.el-main,
.el-footer {
    background-color: rgb(240, 242, 245);
}

.el-menu-vertical-demo {
    height: 100vh;
    border-right: 0;
}

.el-item-m1.is-active {
    background-color: #3370ff !important;
    color: #fff;
}

.el-item-m2.is-active {
    background-color: #F5F5F5 !important;
    color: black;
}

.el-item-m2:hover {
    color: #3370ff;
}

.el-menu-item {
    height: 40px;
    margin-bottom: 12px;
    padding: 0;
    padding-right: 52px;
}

.mb-2 {
    background-color: #001529;
    color: #fff;
    font-size: 15px;
    height: 64px;
    padding-left: 18px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.subTitle {
    height: 40px;
    line-height: 40px;
    margin: 0;
    margin-bottom: 12px;
    padding: 0 20px;
    font-size: 15px;
}

@font-face {
    font-family: 'iconfont';
    src: url('@/iconfont/iconfont.ttf?t=1660098496408') format('truetype');
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    margin-right: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>