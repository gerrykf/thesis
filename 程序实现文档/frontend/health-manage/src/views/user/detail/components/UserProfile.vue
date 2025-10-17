<template>
  <el-card class="user-profile-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="card-title">用户信息</span>
        <!-- 操作按钮组 -->
        <div class="action-buttons-header">
          <el-button
            type="primary"
            :icon="Edit"
            @click="$emit('edit-user')"
            size="small"
          >
            编辑
          </el-button>
          <el-button
            :type="userInfo.is_active ? 'warning' : 'success'"
            :icon="userInfo.is_active ? Lock : Unlock"
            :disabled="
              userInfo.role === 'admin' && userInfo.id === currentUserId
            "
            @click="$emit('toggle-status')"
            size="small"
          >
            {{ userInfo.is_active ? "禁用" : "启用" }}
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="userInfo.role === 'admin'"
            @click="$emit('delete-user')"
            size="small"
          >
            删除
          </el-button>
        </div>
      </div>
    </template>

    <div class="profile-content">
      <!-- 详细信息描述列表 -->
      <el-descriptions :column="descriptionColumn" border>
        <el-descriptions-item
          :rowspan="windowWidth < 775 ? 1 : 3"
          label="头像"
          align="center"
        >
          <!-- 用户头像和基本信息 -->
          <div class="avatar-section">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :headers="uploadHeaders"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              name="avatar"
            >
              <el-avatar
                :size="80"
                :src="userInfo.avatar || undefined"
                class="user-avatar"
              >
                <el-icon :size="50"><UserFilled /></el-icon>
              </el-avatar>
              <template #tip>
                <div class="upload-tip">点击头像上传</div>
              </template>
            </el-upload>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="昵称" label-align="right">
          <el-text>{{ userInfo.nickname || "-" }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="用户名" label-align="right">
          <el-text>{{ userInfo.username || "-" }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="角色" label-align="right">
          <el-tag
            :type="getRoleTagType(userInfo.role)"
            size="default"
            effect="dark"
          >
            {{ getRoleText(userInfo.role) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态" label-align="right">
          <el-tag
            :type="userInfo.is_active ? 'success' : 'danger'"
            size="default"
          >
            {{ userInfo.is_active ? "正常" : "已禁用" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱" label-align="right">
          <el-text>{{ userInfo.email || "-" }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="手机号" label-align="right">
          <el-text>{{ userInfo.phone || "-" }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="性别" label-align="right">
          <el-text>{{ getGenderText(userInfo.gender) }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="生日" label-align="right">
          <el-text>{{ formatDate(userInfo.birth_date) }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="身高" label-align="right">
          <el-text>{{
            userInfo.height ? `${userInfo.height} cm` : "-"
          }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="目标体重" label-align="right">
          <el-text>{{
            userInfo.target_weight ? `${userInfo.target_weight} kg` : "-"
          }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="最后登录" label-align="right">
          <el-text>{{ formatDateTime(userInfo.last_login_at) }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" label-align="right">
          <el-text>{{ formatDateTime(userInfo.created_at) }}</el-text>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ElIcon, ElMessage } from "element-plus";
import {
  UserFilled,
  Edit,
  Delete,
  Lock,
  Unlock,
  Upload
} from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import type { UserInfo } from "../utils/types";
import { formatDate, formatDateTime, getGenderText } from "../utils/helpers";
import { getToken } from "@/utils/auth";

defineOptions({
  name: "UserProfile"
});

const props = defineProps<{
  userInfo: UserInfo;
  currentUserId: number;
}>();

const emit = defineEmits<{
  "toggle-status": [];
  "edit-user": [];
  "delete-user": [];
  "avatar-updated": [url: string];
}>();

// 窗口宽度
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200
);

// 上传配置
const uploadAction = ref("/api/auth/avatar");
const uploadHeaders = computed(() => {
  const tokenData = getToken();
  return {
    Authorization: tokenData?.accessToken
      ? `Bearer ${tokenData.accessToken}`
      : ""
  };
});

// 上传前验证
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  const isImage = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif"
  ].includes(rawFile.type);
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("头像必须是 JPG/PNG/GIF 格式的图片!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("头像图片大小不能超过 2MB!");
    return false;
  }
  return true;
};

// 上传成功
const handleAvatarSuccess: UploadProps["onSuccess"] = response => {
  if (response.success && response.data?.avatarUrl) {
    ElMessage.success("头像上传成功！");
    emit("avatar-updated", response.data.avatarUrl);
  } else {
    ElMessage.error(response.message || "头像上传失败");
  }
};

// 上传失败
const handleAvatarError: UploadProps["onError"] = error => {
  console.error("头像上传失败:", error);
  ElMessage.error("头像上传失败，请重试");
};

// 响应式 descriptions 列数
const descriptionColumn = computed(() => {
  const width = windowWidth.value;
  if (width < 576) return 1; // 移动端：1列
  if (width < 768) return 1; // 小平板：1列
  if (width < 992) return 2; // 平板：2列
  if (width < 1200) return 2; // 小桌面：2列
  return; // 大桌面：3列
});

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 获取角色标签类型
const getRoleTagType = (role: string) => {
  switch (role) {
    case "super_admin":
      return "danger";
    case "admin":
      return "warning";
    default:
      return "info";
  }
};

// 获取角色文本
const getRoleText = (role: string) => {
  switch (role) {
    case "super_admin":
      return "超级管理员";
    case "admin":
      return "管理员";
    default:
      return "普通用户";
  }
};
</script>

<style scoped>
.user-profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-title {
  font-weight: 600;
  color: var(--el-text-color);
  font-size: 16px;
  flex-shrink: 0;
}

.action-buttons-header {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.profile-content {
  padding: 0;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 12px;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-uploader :deep(.el-upload) {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.avatar-uploader :deep(.el-upload:hover) {
  transform: scale(1.05);
}

.avatar-uploader :deep(.el-upload:hover .user-avatar) {
  filter: brightness(0.8);
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-avatar :deep(.el-icon) {
  color: white;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 4px;
}

.user-basic {
  flex: 1;
  min-width: 0;
}

.user-basic h3 {
  margin: 0 0 8px 0;
  color: var(--el-text-color);
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.username {
  margin: 0 0 12px 0;
  color: #909399;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Descriptions 样式优化 */
:deep(.el-descriptions) {
  margin: 0;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  background-color: #fafafa;
}

:deep(.el-descriptions__content) {
  font-weight: normal;
}

/* 平板适配 */
@media (max-width: 992px) {
  .avatar-section {
    padding: 16px;
    gap: 16px;
  }

  .user-basic h3 {
    font-size: 20px;
  }

  :deep(.el-descriptions__label) {
    font-size: 13px;
  }

  :deep(.el-descriptions__content) {
    font-size: 13px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .card-header {
    gap: 12px;
  }

  .action-buttons-header {
    gap: 6px;
  }

  .action-buttons-header .el-button {
    font-size: 12px;
    padding: 5px 10px;
  }

  .avatar-section {
    padding: 16px;
    gap: 14px;
  }

  .user-avatar {
    border-width: 3px;
  }

  .user-basic h3 {
    font-size: 18px;
  }

  .username {
    font-size: 13px;
  }

  .user-tags .el-tag {
    font-size: 12px;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    font-size: 12px;
    padding: 8px 10px;
  }

  :deep(.el-descriptions__content) {
    font-size: 12px;
    padding: 8px 10px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .action-buttons-header {
    width: 100%;
    justify-content: flex-start;
  }

  .action-buttons-header .el-button {
    flex: 1;
    min-width: 0;
    font-size: 11px;
    padding: 6px 8px;
  }

  .action-buttons-header .el-button span {
    display: inline;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
    gap: 12px;
  }

  .user-avatar {
    border-width: 3px;
  }

  .user-basic {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .user-basic h3 {
    font-size: 18px;
    white-space: normal;
    word-break: break-word;
    text-align: center;
  }

  .username {
    font-size: 13px;
    white-space: normal;
    word-break: break-word;
  }

  .user-tags {
    justify-content: center;
  }

  :deep(.el-descriptions__label) {
    font-size: 12px;
    padding: 8px;
  }

  :deep(.el-descriptions__content) {
    font-size: 12px;
    padding: 8px;
  }
}

/* 超小屏幕 */
@media (max-width: 375px) {
  .action-buttons-header .el-button {
    font-size: 10px;
    padding: 5px 6px;
  }

  .avatar-section {
    align-items: center;
    padding: 12px;
  }

  .user-basic h3 {
    font-size: 16px;
  }

  .username {
    font-size: 12px;
  }

  .user-tags .el-tag {
    font-size: 11px;
  }
}
</style>
