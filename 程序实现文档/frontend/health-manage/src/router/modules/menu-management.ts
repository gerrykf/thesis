// import { RoleCode } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/menu-management",
  name: "MenuManagement",
  component: Layout,
  redirect: "/menu-management/list",
  meta: {
    icon: "ep:menu",
    title: "菜单管理",
    rank: 4
    // roles: [RoleCode.SUPER_ADMIN]
  },
  children: [
    {
      path: "/menu-management/list",
      name: "MenuList",
      component: () => import("@/views/menu-management/index.vue"),
      meta: {
        title: "菜单列表",
        showLink: true
        // roles: [RoleCode.SUPER_ADMIN]
      }
    }
  ]
} satisfies RouteConfigsTable;
