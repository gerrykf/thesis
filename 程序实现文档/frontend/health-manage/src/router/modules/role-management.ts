const Layout = () => import("@/layout/index.vue");

export default {
  path: "/role-management",
  name: "RoleManagement",
  component: Layout,
  redirect: "/role-management/list",
  meta: {
    icon: "ep:lock",
    title: "角色管理",
    rank: 3,
    roles: ["super_admin"]
  },
  children: [
    {
      path: "/role-management/list",
      name: "RoleList",
      component: () => import("@/views/role-management/index.vue"),
      meta: {
        title: "角色列表",
        showLink: true,
        roles: ["super_admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
