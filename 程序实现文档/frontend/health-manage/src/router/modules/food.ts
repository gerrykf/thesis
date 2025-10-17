import { FoodPermission } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/food",
  redirect: "/food/index",
  name: "FoodManagement",
  component: Layout,
  meta: {
    icon: "ep:food",
    title: "食物管理",
    rank: 3
  },
  children: [
    {
      path: "/foods/index",
      name: "FoodList",
      component: () => import("@/views/food/list/index.vue"),
      meta: {
        title: "食物列表",
        showLink: true,
        auths: [FoodPermission.LIST]
      }
    }
  ]
} satisfies RouteConfigsTable;
