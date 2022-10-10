import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import myaxios from './api/axios'

// if (sessionStorage.getItem('permissions')) {
//     let arr = JSON.parse(sessionStorage.getItem('permissions'))
//     const addRoute = []
//     arr.forEach(item => {
//         item.children.forEach(items => {
//             addRoute.push({
//                 path: items.path,
//                 name: items.permission_name,
//                 component: () => import(`@/${items.component}`)
//             })
//         })
//     });
//     addRoute.forEach((item) => {
//         router.addRoute('index', item)
//     })
// }else{
//     router.push('/')
// }
// next()

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next()
    } else {
        if (localStorage.getItem("token")) {
            next()
        } else {
            next("/")
        }
    }
})


const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$axios = myaxios
app.mount('#app')