<script setup lang="ts">
import { computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import AdminDashboard from "./components/AdminDashboard.vue";
import UserDashboard from "./components/UserDashboard.vue";

defineOptions({
  name: "Dashboard"
});

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
</script>

<template>
  <div class="dashboard-container">
    <!-- 根据用户角色渲染不同的仪表盘 -->
    <AdminDashboard v-if="isAdmin" />
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
