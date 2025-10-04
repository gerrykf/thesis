import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/health',
    name: 'Health',
    component: () => import('@/views/health/index.vue'),
    meta: { title: '健康打卡' }
  },
  {
    path: '/diet',
    name: 'Diet',
    component: () => import('@/views/diet/index.vue'),
    meta: { title: '饮食记录' }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/history/index.vue'),
    meta: { title: '历史记录' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '健康管理'
  next()
})

export default router
