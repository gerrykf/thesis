import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => {
      // 根据登录状态重定向
      const token = localStorage.getItem('token')
      return token ? '/home' : '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', anonymous: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: { title: '注册', anonymous: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', anonymous: false }
  },
  {
    path: '/health',
    name: 'Health',
    component: () => import('@/views/health/index.vue'),
    meta: { title: '健康打卡', anonymous: false }
  },
  {
    path: '/health/form',
    name: 'HealthForm',
    component: () => import('@/views/health/components/HealthForm.vue'),
    meta: { title: '健康打卡表单', anonymous: false }
  },
  {
    path: '/diet',
    name: 'Diet',
    component: () => import('@/views/diet/index.vue'),
    meta: { title: '饮食记录', anonymous: false }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/history/index.vue'),
    meta: { title: '历史记录', anonymous: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心', anonymous: false }
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('@/views/goals/index.vue'),
    meta: { title: '目标设置', anonymous: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '健康管理'

  // 检查是否允许匿名访问
  const isAnonymous = to.meta.anonymous as boolean

  // 如果允许匿名访问，直接放行
  if (isAnonymous) {
    next()
    return
  }

  // 不允许匿名访问，检查是否有 token
  const token = localStorage.getItem('token')

  if (token) {
    // 有 token，放行
    next()
  } else {
    // 没有 token，跳转到登录页
    next('/login')
  }
})

export default router
