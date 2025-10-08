<template>
  <div class="user-detail-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="goBack">返回用户列表</el-button>
      <div class="header-info">
        <h2>用户详情</h2>
        <p>查看用户的详细信息和健康数据</p>
      </div>
    </div>

    <div v-loading="loading" class="detail-content">
      <!-- 用户基本信息 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="user-profile-card" shadow="never">
            <template #header>
              <span class="card-title">基本信息</span>
            </template>

            <div class="profile-content">
              <div class="avatar-section">
                <el-avatar
                  :size="80"
                  :src="userInfo.avatar"
                  :icon="UserFilled"
                  class="user-avatar"
                />
                <div class="user-basic">
                  <h3>{{ userInfo.nickname || userInfo.username }}</h3>
                  <p class="username">@{{ userInfo.username }}</p>
                  <el-tag
                    :type="userInfo.role === 'admin' ? 'danger' : 'primary'"
                    size="small"
                  >
                    {{ userInfo.role === "admin" ? "管理员" : "普通用户" }}
                  </el-tag>
                </div>
              </div>

              <el-divider />

              <div class="info-list">
                <div class="info-item">
                  <span class="label">邮箱：</span>
                  <span class="value">{{ userInfo.email || "-" }}</span>
                </div>
                <div class="info-item">
                  <span class="label">手机号：</span>
                  <span class="value">{{ userInfo.phone || "-" }}</span>
                </div>
                <div class="info-item">
                  <span class="label">性别：</span>
                  <span class="value">{{
                    getGenderText(userInfo.gender)
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生日：</span>
                  <span class="value">{{
                    formatDate(userInfo.birth_date)
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">身高：</span>
                  <span class="value">{{
                    userInfo.height ? `${userInfo.height}cm` : "-"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">目标体重：</span>
                  <span class="value">{{
                    userInfo.target_weight ? `${userInfo.target_weight}kg` : "-"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">账号状态：</span>
                  <el-tag
                    :type="userInfo.is_active ? 'success' : 'danger'"
                    size="small"
                  >
                    {{ userInfo.is_active ? "正常" : "已禁用" }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <span class="label">最后登录：</span>
                  <span class="value">{{
                    formatDateTime(userInfo.last_login_at)
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">注册时间：</span>
                  <span class="value">{{
                    formatDateTime(userInfo.created_at)
                  }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="16">
          <!-- 健康数据统计 -->
          <el-card class="health-stats-card" shadow="never">
            <template #header>
              <span class="card-title">健康数据统计</span>
            </template>

            <el-row :gutter="20">
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-icon health">
                    <el-icon size="24"><DataAnalysis /></el-icon>
                  </div>
                  <div class="stat-info">
                    <h3>{{ healthStats.totalRecords }}</h3>
                    <p>健康记录</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-icon diet">
                    <el-icon size="24"><Food /></el-icon>
                  </div>
                  <div class="stat-info">
                    <h3>{{ healthStats.dietRecords }}</h3>
                    <p>饮食记录</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-icon goals">
                    <el-icon size="24"><Flag /></el-icon>
                  </div>
                  <div class="stat-info">
                    <h3>{{ healthStats.activeGoals }}</h3>
                    <p>活跃目标</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-icon days">
                    <el-icon size="24"><Calendar /></el-icon>
                  </div>
                  <div class="stat-info">
                    <h3>{{ healthStats.activeDays }}</h3>
                    <p>活跃天数</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 操作按钮 -->
          <el-card class="actions-card" shadow="never">
            <template #header>
              <span class="card-title">操作</span>
            </template>

            <div class="action-buttons">
              <el-button
                :type="userInfo.is_active ? 'warning' : 'success'"
                :icon="userInfo.is_active ? 'Lock' : 'Unlock'"
                :disabled="
                  userInfo.role === 'admin' && userInfo.id === currentUserId
                "
                @click="toggleUserStatus"
              >
                {{ userInfo.is_active ? "禁用账号" : "启用账号" }}
              </el-button>
              <el-button type="info" :icon="Edit" @click="editUser">
                编辑信息
              </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="userInfo.role === 'admin'"
                @click="deleteUser"
              >
                删除用户
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 健康记录列表 -->
      <el-card class="records-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">最近健康记录</span>
            <el-button type="text" @click="viewAllRecords">查看全部</el-button>
          </div>
        </template>

        <el-table :data="healthRecords" stripe>
          <el-table-column prop="record_date" label="日期" width="120">
            <template #default="{ row }">
              {{ formatDate(row.record_date) }}
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="体重(kg)" width="100">
            <template #default="{ row }">
              {{ row.weight || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="exercise_duration"
            label="运动时长(分钟)"
            width="130"
          >
            <template #default="{ row }">
              {{ row.exercise_duration || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="exercise_type" label="运动类型" width="120">
            <template #default="{ row }">
              {{ row.exercise_type || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sleep_hours"
            label="睡眠时长(小时)"
            width="130"
          >
            <template #default="{ row }">
              {{ row.sleep_hours || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="sleep_quality" label="睡眠质量" width="100">
            <template #default="{ row }">
              <el-tag
                v-if="row.sleep_quality"
                :type="getSleepQualityType(row.sleep_quality)"
                size="small"
              >
                {{ getSleepQualityText(row.sleep_quality) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="mood" label="心情" width="80">
            <template #default="{ row }">
              <el-tag
                v-if="row.mood"
                :type="getMoodType(row.mood)"
                size="small"
              >
                {{ getMoodText(row.mood) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="notes" label="备注" min-width="150">
            <template #default="{ row }">
              {{ row.notes || "-" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  ArrowLeft,
  UserFilled,
  DataAnalysis,
  Food,
  Flag,
  Calendar,
  Edit,
  Delete
} from "@element-plus/icons-vue";

defineOptions({
  name: "UserDetail"
});

const router = useRouter();
const route = useRoute();

// 当前登录用户ID
const currentUserId = ref(1); // TODO: 从store获取

// 加载状态
const loading = ref(false);

// 用户信息
const userInfo = reactive({
  id: 0,
  username: "",
  nickname: "",
  email: "",
  phone: "",
  gender: "",
  birth_date: "",
  height: 0,
  target_weight: 0,
  avatar: "",
  role: "",
  is_active: true,
  last_login_at: "",
  created_at: ""
});

// 健康数据统计
const healthStats = reactive({
  totalRecords: 0,
  dietRecords: 0,
  activeGoals: 0,
  activeDays: 0
});

// 健康记录列表
const healthRecords = ref([]);

// 返回用户列表
const goBack = () => {
  router.back();
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("zh-CN");
};

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("zh-CN");
};

// 获取性别文本
const getGenderText = (gender: string) => {
  const map = {
    male: "男",
    female: "女"
  };
  return map[gender] || "-";
};

// 获取睡眠质量类型
const getSleepQualityType = (quality: string) => {
  const map = {
    excellent: "success",
    good: "primary",
    fair: "warning",
    poor: "danger"
  };
  return map[quality] || "info";
};

// 获取睡眠质量文本
const getSleepQualityText = (quality: string) => {
  const map = {
    excellent: "优秀",
    good: "良好",
    fair: "一般",
    poor: "较差"
  };
  return map[quality] || quality;
};

// 获取心情类型
const getMoodType = (mood: string) => {
  const map = {
    excellent: "success",
    good: "primary",
    fair: "warning",
    poor: "danger"
  };
  return map[mood] || "info";
};

// 获取心情文本
const getMoodText = (mood: string) => {
  const map = {
    excellent: "很好",
    good: "不错",
    fair: "一般",
    poor: "较差"
  };
  return map[mood] || mood;
};

// 加载用户详情
const loadUserDetail = async () => {
  loading.value = true;
  try {
    const userId = route.params.id;

    // TODO: 调用API获取用户详情
    // const response = await getUserDetail(userId);

    // 模拟数据
    Object.assign(userInfo, {
      id: Number(userId),
      username: "user001",
      nickname: "张小明",
      email: "zhangming@example.com",
      phone: "13800000002",
      gender: "male",
      birth_date: "1995-03-15",
      height: 172,
      target_weight: 68,
      avatar: "",
      role: "user",
      is_active: true,
      last_login_at: "2024-01-15T09:15:00.000Z",
      created_at: "2024-01-02T10:30:00.000Z"
    });

    // 加载健康统计数据
    Object.assign(healthStats, {
      totalRecords: 45,
      dietRecords: 128,
      activeGoals: 3,
      activeDays: 42
    });

    // 加载健康记录
    healthRecords.value = [
      {
        record_date: "2024-01-15",
        weight: 69.5,
        exercise_duration: 45,
        exercise_type: "跑步",
        sleep_hours: 7.5,
        sleep_quality: "good",
        mood: "excellent",
        notes: "今天感觉很棒"
      },
      {
        record_date: "2024-01-14",
        weight: 69.8,
        exercise_duration: 30,
        exercise_type: "瑜伽",
        sleep_hours: 8,
        sleep_quality: "excellent",
        mood: "good",
        notes: "瑜伽很放松"
      },
      {
        record_date: "2024-01-13",
        weight: 70.0,
        exercise_duration: 60,
        exercise_type: "游泳",
        sleep_hours: 7,
        sleep_quality: "good",
        mood: "good",
        notes: "游泳1小时"
      }
    ];
  } catch (error) {
    console.error("加载用户详情失败:", error);
    ElMessage.error("加载用户详情失败");
  } finally {
    loading.value = false;
  }
};

// 切换用户状态
const toggleUserStatus = async () => {
  const action = userInfo.is_active ? "禁用" : "启用";

  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${userInfo.nickname || userInfo.username}" 吗？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    // TODO: 调用API切换用户状态
    // await updateUserStatus(userInfo.id, !userInfo.is_active);

    // 模拟状态切换
    userInfo.is_active = !userInfo.is_active;

    ElMessage.success(`${action}成功`);
  } catch (error) {
    if (error !== "cancel") {
      console.error(`${action}用户失败:`, error);
      ElMessage.error(`${action}用户失败`);
    }
  }
};

// 编辑用户
const editUser = () => {
  ElMessage.info("编辑功能开发中...");
};

// 删除用户
const deleteUser = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${userInfo.nickname || userInfo.username}" 吗？此操作不可恢复！`,
      "确认删除",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "error"
      }
    );

    // TODO: 调用API删除用户
    // await deleteUser(userInfo.id);

    ElMessage.success("删除成功");
    router.push("/user-management/list");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除用户失败:", error);
      ElMessage.error("删除用户失败");
    }
  }
};

// 查看全部记录
const viewAllRecords = () => {
  ElMessage.info("查看全部记录功能开发中...");
};

// 页面初始化
onMounted(() => {
  loadUserDetail();
});
</script>

<style scoped>
.user-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header-info h2 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.header-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-title {
  font-weight: 600;
  color: #303133;
}

.user-profile-card {
  margin-bottom: 20px;
}

.profile-content {
  padding: 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.user-avatar {
  border: 3px solid #f0f0f0;
}

.user-basic h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.username {
  margin: 0 0 8px 0;
  color: #909399;
  font-size: 14px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  min-width: 80px;
  color: #606266;
  font-size: 14px;
}

.info-item .value {
  color: #303133;
  font-size: 14px;
  flex: 1;
}

.health-stats-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 8px;
  background: #fafafa;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.health {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.diet {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.goals {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.days {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.stat-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.actions-card {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.records-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}
</style>
