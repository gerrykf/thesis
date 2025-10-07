import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: () => {
      // 根据登录状态重定向
      const token = localStorage.getItem("token");
      return token ? "/home" : "/login";
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", anonymous: true, hideFooter: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/index.vue"),
    meta: { title: "注册", anonymous: true, hideFooter: true },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    meta: { title: "首页", anonymous: false },
  },
  {
    path: "/health",
    name: "Health",
    component: () => import("@/views/health/index.vue"),
    meta: { title: "健康打卡", anonymous: false },
  },
  {
    path: "/health/form",
    name: "HealthForm",
    component: () => import("@/views/health/components/HealthForm.vue"),
    meta: { title: "健康打卡表单", anonymous: false, hideFooter: true },
  },
  {
    path: "/diet",
    name: "Diet",
    component: () => import("@/views/diet/index.vue"),
    meta: { title: "饮食记录", anonymous: false },
  },
  {
    path: "/history",
    name: "History",
    component: () => import("@/views/history/index.vue"),
    meta: { title: "历史记录", anonymous: false },
  },
  {
    path: "/my",
    name: "My",
    component: () => import("@/views/my/index.vue"),
    meta: { title: "个人中心", anonymous: false },
  },
  {
    path: "/goals",
    name: "Goals",
    component: () => import("@/views/goals/index.vue"),
    meta: { title: "目标设置", anonymous: false, hideFooter: true },
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: () => import("@/views/analysis/index.vue"),
    meta: { title: "数据分析", anonymous: false, hideFooter: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/my/profile.vue"),
    meta: { title: "个人资料", anonymous: false, hideFooter: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || "健康管理";

  // 检查是否允许匿名访问
  const isAnonymous = to.meta.anonymous as boolean;

  // 如果允许匿名访问，直接放行
  if (isAnonymous) {
    next();
    return;
  }

  // 不允许匿名访问，检查是否有 token
  const token = localStorage.getItem("token");

  if (token) {
    // 有 token，放行
    next();
  } else {
    // 没有 token，跳转到登录页
    next("/login");
  }
});

export default router;
