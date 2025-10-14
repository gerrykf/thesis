const Layout = () => import("@/layout/index.vue");

export default {
  path: "/food-management",
  name: "FoodManagement",
  component: Layout,
  redirect: "/food-management/list",
  meta: {
    icon: "ep:food",
    title: "食物管理",
    rank: 3,
    roles: ["admin"]
  },
  children: [
    {
      path: "/food-management/list",
      name: "FoodList",
      component: () => import("@/views/food-management/list/index.vue"),
      meta: {
        title: "食物列表",
        showLink: true,
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
