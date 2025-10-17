const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/dashboard",
  meta: {
    icon: "ep/home-filled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: "数据趋势",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
    // {
    //   path: "/welcome",
    //   name: "Welcome",
    //   component: () => import("@/views/welcome/index.vue"),
    //   meta: {
    //     title: "欢迎页",
    //     showLink: false
    //   }
    // }
  ]
} satisfies RouteConfigsTable;
