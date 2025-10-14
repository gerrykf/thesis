<template>
  <div class="user-detail-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="goBack">返回用户列表</el-button>
      <div class="header-info">
        <h2>用户详情</h2>
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
                <div class="stat-item clickable" @click="viewAllRecords">
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
                <div class="stat-item clickable" @click="viewDietRecords">
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
                <div class="stat-item clickable" @click="viewActiveGoals">
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
                <div class="stat-item clickable" @click="viewActiveDays">
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
          <el-table-column prop="record_date" label="日期">
            <template #default="{ row }">
              {{ formatDate(row.record_date) }}
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="体重(kg)">
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
          <el-table-column prop="exercise_type" label="运动类型">
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
          <el-table-column prop="sleep_quality" label="睡眠质量">
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
          <el-table-column prop="mood" label="心情">
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
          <el-table-column prop="notes" label="备注">
            <template #default="{ row }">
              {{ row.notes || "-" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 全部健康记录对话框 -->
    <el-dialog
      v-model="allRecordsDialog.visible"
      title="全部健康记录"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="allRecordsDialog.loading"
        :data="allRecordsDialog.records"
        stripe
        max-height="500"
      >
        <el-table-column prop="record_date" label="日期">
          <template #default="{ row }">
            {{ formatDate(row.record_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="体重(kg)">
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
        <el-table-column prop="exercise_type" label="运动类型">
          <template #default="{ row }">
            {{ row.exercise_type || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="sleep_hours" label="睡眠时长(小时)">
          <template #default="{ row }">
            {{ row.sleep_hours || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="sleep_quality" label="睡眠质量">
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
        <el-table-column prop="mood" label="心情">
          <template #default="{ row }">
            <el-tag v-if="row.mood" :type="getMoodType(row.mood)" size="small">
              {{ getMoodText(row.mood) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注">
          <template #default="{ row }">
            {{ row.notes || "-" }}
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px; text-align: center">
        <el-pagination
          v-model:current-page="allRecordsDialog.page"
          :page-size="allRecordsDialog.pageSize"
          :total="allRecordsDialog.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleRecordsPageChange"
        />
      </div>
    </el-dialog>

    <!-- 饮食记录对话框 -->
    <el-dialog
      v-model="dietRecordsDialog.visible"
      title="饮食记录"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-alert
        title="功能开发中"
        type="info"
        description="饮食记录功能正在开发中，敬请期待。"
        :closable="false"
        style="margin-bottom: 20px"
      />
    </el-dialog>

    <!-- 活跃目标对话框 -->
    <el-dialog
      v-model="activeGoalsDialog.visible"
      title="活跃目标"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-alert
        title="功能开发中"
        type="info"
        description="活跃目标功能正在开发中，敬请期待。"
        :closable="false"
        style="margin-bottom: 20px"
      />
    </el-dialog>

    <!-- 活跃天数对话框 -->
    <el-dialog
      v-model="activeDaysDialog.visible"
      title="活跃天数"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-alert
        title="功能开发中"
        type="info"
        description="活跃天数日历视图功能正在开发中，敬请期待。"
        :closable="false"
        style="margin-bottom: 20px"
      />
      <div style="text-align: center; padding: 40px 0">
        <el-statistic :value="healthStats.activeDays" title="累计活跃天数">
          <template #suffix>天</template>
        </el-statistic>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialog.visible"
      title="编辑用户信息"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editDialog.form"
        label-width="120px"
        :disabled="editDialog.loading"
      >
        <el-form-item label="昵称">
          <el-input
            v-model="editDialog.form.nickname"
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="editDialog.form.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="editDialog.form.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editDialog.form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editDialog.form.birth_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="身高(cm)">
          <el-input-number
            v-model="editDialog.form.height"
            :min="0"
            :max="300"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="目标体重(kg)">
          <el-input-number
            v-model="editDialog.form.target_weight"
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
          <el-button @click="editDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="editDialog.loading"
            @click="saveUserEdit"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
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
import {
  getAdminUsersId,
  getAdminUsersIdHealthStats,
  getAdminUsersIdHealthRecords,
  putAdminUsersId,
  patchAdminUsersIdToggleStatus,
  deleteAdminUsersId
} from "@/api/admin";
import { unwrap } from "@/utils/api";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "UserDetail"
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStoreHook();

// 当前登录用户ID
const currentUserId = ref((userStore as any).id || 1);

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

// 全部记录对话框
const allRecordsDialog = reactive({
  visible: false,
  records: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false
});

// 饮食记录对话框
const dietRecordsDialog = reactive({
  visible: false
});

// 活跃目标对话框
const activeGoalsDialog = reactive({
  visible: false
});

// 活跃天数对话框
const activeDaysDialog = reactive({
  visible: false
});

// 编辑用户对话框
const editDialog = reactive({
  visible: false,
  loading: false,
  form: {
    nickname: "",
    email: "",
    phone: "",
    gender: "",
    birth_date: "",
    height: null,
    target_weight: null
  }
});

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
    const userId = Number(route.params.id);

    // 调用API获取用户详情
    try {
      const userResponse = await unwrap(getAdminUsersId({ id: userId }));
      if (userResponse?.success && userResponse.data) {
        Object.assign(userInfo, userResponse.data);
      }
    } catch (error) {
      console.error("获取用户详情失败:", error);
      ElMessage.error("获取用户详情失败");
      router.push("/user-management/list");
      return;
    }

    // 加载健康统计数据
    try {
      const statsResponse = await unwrap(
        getAdminUsersIdHealthStats({ id: userId })
      );
      if (statsResponse?.success && statsResponse.data) {
        Object.assign(healthStats, statsResponse.data);
      }
    } catch (error) {
      console.error("获取健康统计失败:", error);
      // 继续加载其他数据
    }

    // 加载健康记录（只显示最近5条）
    try {
      const recordsResponse = await unwrap(
        getAdminUsersIdHealthRecords({
          id: userId,
          page: 1,
          pageSize: 5
        })
      );
      if (recordsResponse?.success && recordsResponse.data) {
        healthRecords.value = recordsResponse.data.records || [];
      }
    } catch (error) {
      console.error("获取健康记录失败:", error);
      // 不影响页面加载，只是健康记录不显示
    }
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

    // 调用API切换用户状态
    const response = await unwrap(
      patchAdminUsersIdToggleStatus({ id: userInfo.id })
    );

    if (response?.success) {
      // 更新本地状态
      userInfo.is_active = !userInfo.is_active;
      ElMessage.success(`${action}成功`);
    } else {
      ElMessage.error(`${action}失败`);
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error(`${action}用户失败:`, error);
      ElMessage.error(`${action}用户失败`);
    }
  }
};

// 编辑用户
const editUser = () => {
  // 打开编辑对话框并填充当前用户数据
  editDialog.form = {
    nickname: userInfo.nickname || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
    gender: (userInfo.gender || "") as "male" | "female" | "",
    birth_date: userInfo.birth_date || "",
    height: userInfo.height || null,
    target_weight: userInfo.target_weight || null
  };
  editDialog.visible = true;
};

// 保存用户编辑
const saveUserEdit = async () => {
  editDialog.loading = true;
  try {
    const response = await unwrap(
      putAdminUsersId({ id: userInfo.id }, editDialog.form as any)
    );

    if (response?.success) {
      ElMessage.success("保存成功");
      editDialog.visible = false;
      // 重新加载用户数据
      await loadUserDetail();
    } else {
      ElMessage.error(response?.message || "保存失败");
    }
  } catch (error) {
    console.error("保存用户信息失败:", error);
    ElMessage.error("保存用户信息失败");
  } finally {
    editDialog.loading = false;
  }
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

    // 调用API删除用户
    const response = await unwrap(deleteAdminUsersId({ id: userInfo.id }));

    if (response?.success) {
      ElMessage.success("删除成功");
      router.push("/user-management/list");
    } else {
      ElMessage.error(response?.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除用户失败:", error);
      ElMessage.error("删除用户失败");
    }
  }
};

// 查看全部记录
const viewAllRecords = async () => {
  allRecordsDialog.visible = true;
  await loadAllRecords();
};

// 加载所有健康记录
const loadAllRecords = async () => {
  allRecordsDialog.loading = true;
  try {
    const response = await unwrap(
      getAdminUsersIdHealthRecords({
        id: Number(route.params.id),
        page: allRecordsDialog.page,
        pageSize: allRecordsDialog.pageSize
      })
    );

    if (response?.success && response.data) {
      allRecordsDialog.records = response.data.records || [];
      allRecordsDialog.total = response.data.total || 0;
    }
  } catch (error) {
    console.error("加载健康记录失败:", error);
    ElMessage.error("加载健康记录失败");
  } finally {
    allRecordsDialog.loading = false;
  }
};

// 全部记录对话框分页变化
const handleRecordsPageChange = (page: number) => {
  allRecordsDialog.page = page;
  loadAllRecords();
};

// 查看饮食记录
const viewDietRecords = () => {
  dietRecordsDialog.visible = true;
};

// 查看活跃目标
const viewActiveGoals = () => {
  activeGoalsDialog.visible = true;
};

// 查看活跃天数
const viewActiveDays = () => {
  activeDaysDialog.visible = true;
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

.stat-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item.clickable:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #606266;
  font-weight: 600;
}
</style>
