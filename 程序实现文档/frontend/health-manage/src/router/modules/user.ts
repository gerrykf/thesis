import { UserPermission } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/user",
  redirect: "/user/index",
  name: "FoodManagement",
  component: Layout,
  meta: {
    icon: "ri:admin-line",
    title: "用户管理",
    rank: 1
  },
  children: [
    {
      path: "/user/index",
      name: "UserList",
      component: () => import("@/views/user/list/index.vue"),
      meta: {
        title: "用户列表",
        showLink: true,
        auths: [UserPermission.LIST]
      }
    },
    {
      path: "/user/detail/:userId?",
      name: "UserDetail",
      component: () => import("@/views/user/detail/index.vue"),
      meta: {
        title: "用户详情",
        showLink: true,
        auths: [UserPermission.LIST]
      }
    }
  ]
} satisfies RouteConfigsTable;
