<template>
  <el-dialog
    :model-value="visible"
    title="编辑用户信息"
    width="90%"
    :style="{ maxWidth: '600px' }"
    :close-on-click-modal="false"
    :fullscreen="isMobile"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="120px"
      :disabled="loading"
      class="edit-form"
    >
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" type="email" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <!-- 只有管理员和超级管理员才能看到角色选择框 -->
      <el-form-item v-if="isAdmin || isSuperAdmin" label="用户角色">
        <el-select
          v-model="form.role_id"
          placeholder="请选择角色"
          style="width: 100%"
          :disabled="isEditingUserSuperAdmin"
        >
          <el-option
            v-for="role in filteredRoleOptions"
            :key="role.id"
            :label="role.name"
            :value="role.id"
            :disabled="role.id === 3 && !isSuperAdmin"
          >
            <span>{{ role.name }}</span>
            <el-tag
              v-if="role.code"
              size="small"
              type="info"
              style="margin-left: 8px"
            >
              {{ role.code }}
            </el-tag>
          </el-option>
        </el-select>
        <div style="margin-top: 4px; font-size: 12px; color: #909399">
          <span v-if="isEditingUserSuperAdmin">
            超级管理员角色不允许修改
          </span>
          <span v-else-if="!isSuperAdmin">
            只有超级管理员可以分配超级管理员角色
          </span>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birth_date"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="身高(cm)">
        <el-input-number
          v-model="form.height"
          :min="0"
          :max="300"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="目标体重(kg)">
        <el-input-number
          v-model="form.target_weight"
          :min="0"
          :max="500"
          :step="0.1"
          :precision="1"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="$emit('submit')">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { EditUserForm, RoleOption } from "../utils/types";

defineOptions({
  name: "EditUserDialog"
});

defineProps<{
  visible: boolean;
  loading: boolean;
  form: EditUserForm;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEditingUserSuperAdmin: boolean;
  filteredRoleOptions: RoleOption[];
}>();

defineEmits<{
  "update:visible": [value: boolean];
  submit: [];
}>();

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 768;
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .edit-form :deep(.el-form-item__label) {
    font-size: 14px;
  }

  .edit-form :deep(.el-form-item__content) {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .edit-form {
    :deep(.el-form-item) {
      margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
      width: 100px !important;
      font-size: 13px;
    }
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>
