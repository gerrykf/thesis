<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import AdminDashboard from "./components/AdminDashboard.vue";
import UserDashboard from "./components/UserDashboard.vue";

defineOptions({
  name: "Dashboard"
});

const route = useRoute();
const userStore = useUserStoreHook();

// 判断用户角色
const userRole = computed(() => {
  const roles = userStore.roles || [];
  return roles[0] || "user";
});

// 是否是管理员或超级管理员
const isAdmin = computed(() => {
  return userRole.value === "admin" || userRole.value === "super_admin";
});

// 判断是否在查看其他用户数据
// 如果 URL 中有 userId 参数，则强制显示 UserDashboard
const isViewingOtherUser = computed(() => {
  return route.query.userId !== undefined;
});

// 决定显示哪个 dashboard 组件
// 1. 如果正在查看其他用户数据（有 userId 参数），显示 UserDashboard
// 2. 如果是管理员且没有 userId 参数，显示 AdminDashboard
// 3. 如果是普通用户，显示 UserDashboard
const shouldShowAdminDashboard = computed(() => {
  return isAdmin.value && !isViewingOtherUser.value;
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 根据用户角色和是否查看其他用户数据来渲染不同的仪表盘 -->
    <AdminDashboard v-if="shouldShowAdminDashboard" />
    <UserDashboard v-else />
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  width: 100%;
  min-height: calc(100vh - 200px);
  padding: 16px;
  box-sizing: border-box;
  margin: 0 !important;

  // 移动端适配
  @media (max-width: 768px) {
    padding: 12px 8px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 8px 4px;
  }
}
</style>
