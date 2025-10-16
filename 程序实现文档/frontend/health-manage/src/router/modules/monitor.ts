import { RoleCode } from "@/utils/rbac";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/monitor",
  name: "SystemMonitor",
  component: Layout,
  meta: {
    icon: "ri:computer-line",
    title: "系统监控",
    rank: 3,
    roles: [RoleCode.SUPER_ADMIN]
  },
  children: [
    {
      path: "/monitor/online",
      name: "OnlineUser",
      component: () => import("@/views/monitor/online/index.vue"),
      meta: {
        icon: "ri:user-line",
        title: "在线用户",
        roles: [RoleCode.SUPER_ADMIN]
      }
    },
    {
      path: "/monitor/login-logs",
      name: "LoginLog",
      component: () => import("@/views/monitor/login-log/index.vue"),
      meta: {
        icon: "ri:shield-keyhole-line",
        title: "登录日志",
        roles: [RoleCode.SUPER_ADMIN]
      }
    },
    {
      path: "/monitor/operation-logs",
      name: "OperationLog",
      component: () => import("@/views/monitor/operation-log/index.vue"),
      meta: {
        icon: "ri:file-list-3-line",
        title: "操作日志",
        roles: [RoleCode.SUPER_ADMIN]
      }
    }
  ]
} satisfies RouteConfigsTable;
