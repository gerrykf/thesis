<template>
  <el-card class="actions-card" shadow="never">
    <template #header>
      <span class="card-title">操作</span>
    </template>

    <div class="action-buttons">
      <el-button
        :type="userInfo.is_active ? 'warning' : 'success'"
        :icon="userInfo.is_active ? 'Lock' : 'Unlock'"
        :disabled="userInfo.role === 'admin' && userInfo.id === currentUserId"
        @click="$emit('toggle-status')"
      >
        {{ userInfo.is_active ? "禁用账号" : "启用账号" }}
      </el-button>
      <el-button type="info" :icon="Edit" @click="$emit('edit-user')">
        编辑信息
      </el-button>
      <el-button
        type="danger"
        :icon="Delete"
        :disabled="userInfo.role === 'admin'"
        @click="$emit('delete-user')"
      >
        删除用户
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";
import type { UserInfo } from "../utils/types";

defineOptions({
  name: "UserActions"
});

defineProps<{
  userInfo: UserInfo;
  currentUserId: number;
}>();

defineEmits<{
  "toggle-status": [];
  "edit-user": [];
  "delete-user": [];
}>();
</script>

<style scoped>
.actions-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  color: var(--el-text-color);
  font-size: 16px;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.action-buttons .el-button {
  min-height: 40px;
}

/* 平板适配 */
@media (max-width: 992px) {
  .action-buttons {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .action-buttons {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-buttons .el-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    gap: 8px;
  }

  .action-buttons .el-button {
    min-height: 44px;
    font-size: 14px;
  }
}
</style>
