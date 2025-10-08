const Layout = () => import("@/layout/index.vue");

export default {
  path: "/user-management",
  name: "UserManagement",
  component: Layout,
  redirect: "/user-management/list",
  meta: {
    icon: "ep/user-filled",
    title: "用户管理",
    rank: 2,
    roles: ["admin"]
  },
  children: [
    {
      path: "/user-management/list",
      name: "UserList",
      component: () => import("@/views/user-management/list/index.vue"),
      meta: {
        title: "用户列表",
        showLink: true,
        roles: ["admin"]
      }
    },
    {
      path: "/user-management/detail/:id",
      name: "UserDetail",
      component: () => import("@/views/user-management/detail/index.vue"),
      meta: {
        title: "用户详情",
        showLink: false,
        roles: ["admin"],
        activePath: "/user-management/list"
      }
    }
  ]
} satisfies RouteConfigsTable;
