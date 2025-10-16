import { RoleCode } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system",
  name: "SystemManagement",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: 2,
    roles: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN]
  },
  children: [
    {
      path: "/users",
      name: "UserManagement",
      redirect: "/users/list",
      meta: {
        icon: "ep:user-filled",
        title: "用户管理",
        rank: 1,
        roles: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN]
      },
      children: [
        {
          path: "/users/list",
          name: "UserList",
          component: () => import("@/views/system/users/list/index.vue"),
          meta: {
            title: "用户列表",
            showLink: true,
            roles: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN]
          }
        },
        {
          path: "/users/detail/:id",
          name: "UserDetail",
          component: () => import("@/views/system/users/detail/index.vue"),
          meta: {
            title: "用户详情",
            showLink: false,
            roles: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN],
            activePath: "/users/list"
          }
        }
      ]
    },
    {
      path: "/roles",
      name: "RoleManagement",
      component: Layout,
      redirect: "/roles/list",
      meta: {
        icon: "ep:lock",
        title: "角色管理",
        rank: 3,
        roles: ["super_admin"]
      },
      children: [
        {
          path: "/roles/list",
          name: "RoleList",
          component: () => import("@/views/system/roles/index.vue"),
          meta: {
            title: "角色列表",
            showLink: true,
            roles: ["super_admin"]
          }
        }
      ]
    },
    {
      path: "/menus",
      name: "MenuManagement",
      component: Layout,
      redirect: "/menus/list",
      meta: {
        icon: "ep:menu",
        title: "菜单管理",
        rank: 4
        // roles: [RoleCode.SUPER_ADMIN]
      },
      children: [
        {
          path: "/menus/list",
          name: "MenuList",
          component: () => import("@/views/system/menus/index.vue"),
          meta: {
            title: "菜单列表",
            showLink: true
            // roles: [RoleCode.SUPER_ADMIN]
          }
        }
      ]
    }
  ]
} satisfies RouteConfigsTable;
