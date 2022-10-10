import {
  createRouter,
  createWebHistory
} from 'vue-router'

const routes = [{
    path: '/',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index.vue'),
    meta: {
      title: '首页',
      isLogin:true
    },
    // }
    children:[
    {
      path: '/adminList',
      name: 'adminList',
      component: () => import('@/views/admin/admin_list.vue'),
      meta: {
        title: '管理员列表'
      },
    },
    {
      path: '/userManager',
      name: 'userManager',
      component: () => import('@/views/admin/role_list.vue'),
      meta: {
        title: '角色管理'
      },
    },
    {
      path: '/goodlist',
      name: 'goodlist',
      component: () => import('@/views/good/good_list.vue'),
      meta: {
        title: '商品列表'
      },
    },
    {
      path: '/commondityClassify',
      name: 'commondityClassify',
      component: () => import('@/views/good/good_type.vue'),
      meta: {
        title: '商品分类'
      },
    },
    {
      path: '/createCommondity',
      name: 'createCommondity',
      component: () => import('@/views/good/createCommondity.vue'),
      meta: {
        title: '创建商品'
      },
    },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router