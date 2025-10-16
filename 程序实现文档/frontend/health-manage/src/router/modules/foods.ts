import { FoodPermission } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/foods",
  name: "FoodManagement",
  component: Layout,
  redirect: "/foods/list",
  meta: {
    icon: "ep:food",
    title: "食物管理",
    rank: 3
  },
  children: [
    {
      path: "/foods/list",
      name: "FoodList",
      component: () => import("@/views/foods/list/index.vue"),
      meta: {
        title: "食物列表",
        showLink: true,
        auths: [FoodPermission.LIST]
      }
    }
  ]
} satisfies RouteConfigsTable;
