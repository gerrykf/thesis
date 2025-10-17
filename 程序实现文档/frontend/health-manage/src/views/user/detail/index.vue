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
      <UserProfile
        :user-info="userInfo"
        :current-user-id="currentUserId"
        @toggle-status="toggleUserStatus"
        @edit-user="editUser"
        @delete-user="deleteUser"
        @avatar-updated="handleAvatarUpdated"
      />

      <!-- 健康数据统计 -->
      <HealthStats
        :health-stats="healthStats"
        @view-health-records="viewAllRecords"
        @view-diet-records="viewDietRecords"
        @view-active-goals="viewActiveGoals"
        @view-active-days="viewActiveDays"
      />
    </div>

    <!-- 健康记录对话框 -->
    <HealthRecordsDialog
      v-model:visible="allRecordsDialog.visible"
      :loading="allRecordsDialog.loading"
      :records="allRecordsDialog.records"
      :total="allRecordsDialog.total"
      :page="allRecordsDialog.page"
      :page-size="allRecordsDialog.pageSize"
      @page-change="handleRecordsPageChange"
    />

    <!-- 饮食记录对话框 -->
    <DietRecordsDialog
      v-model:visible="dietRecordsDialog.visible"
      :loading="dietRecordsDialog.loading"
      :records="dietRecordsDialog.records"
      :total="dietRecordsDialog.total"
      :page="dietRecordsDialog.page"
      :page-size="dietRecordsDialog.pageSize"
      @page-change="handleDietRecordsPageChange"
    />

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
    <EditUserDialog
      v-model:visible="editDialog.visible"
      :loading="editDialog.loading"
      :form="editDialog.form"
      :is-admin="isAdmin"
      :is-super-admin="isSuperAdmin"
      :is-editing-user-super-admin="isEditingUserSuperAdmin"
      :filtered-role-options="filteredRoleOptions"
      @submit="saveUserEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import {
  getAdminUsersId,
  getAdminUsersIdHealthStats,
  getAdminUsersIdHealthRecords,
  putAdminUsersId,
  patchAdminUsersIdToggleStatus,
  deleteAdminUsersId,
  getAdminRoles,
  putAdminUsersIdRole
} from "@/api/admin";
import { unwrap } from "@/utils/api";

// 导入组件
import UserProfile from "./components/UserProfile.vue";
import HealthStats from "./components/HealthStats.vue";
import HealthRecordsDialog from "./components/HealthRecordsDialog.vue";
import DietRecordsDialog from "./components/DietRecordsDialog.vue";
import EditUserDialog from "./components/EditUserDialog.vue";

// 导入类型
import type {
  UserInfo,
  HealthStats as HealthStatsType,
  HealthRecord,
  DietRecord,
  RoleOption,
  EditUserForm
} from "./utils/types";

defineOptions({
  name: "UserDetail"
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStoreHook();

// 当前登录用户ID和角色
const currentUserId = ref((userStore as any).userId || 0);
const currentUserRoles = ref((userStore as any).roles || []);
const isSuperAdmin = ref(currentUserRoles.value.includes("super_admin"));
const isAdmin = ref(currentUserRoles.value.includes("admin"));

// 加载状态
const loading = ref(false);

// 角色选项列表
const roleOptions = ref<RoleOption[]>([]);

// 过滤后的角色选项
const filteredRoleOptions = computed(() => {
  if (isSuperAdmin.value) {
    return roleOptions.value;
  } else if (isAdmin.value) {
    return roleOptions.value.filter(role => role.id !== 3);
  } else {
    return [];
  }
});

// 检查被编辑的用户是否是超级管理员
const isEditingUserSuperAdmin = computed(() => {
  return userInfo.role === "super_admin";
});

// 用户信息
const userInfo = reactive<UserInfo>({
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
const healthStats = reactive<HealthStatsType>({
  totalRecords: 0,
  dietRecords: 0,
  activeGoals: 0,
  activeDays: 0
});

// 全部记录对话框
const allRecordsDialog = reactive({
  visible: false,
  records: [] as HealthRecord[],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false
});

// 饮食记录对话框
const dietRecordsDialog = reactive({
  visible: false,
  records: [] as DietRecord[],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false
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
    gender: "" as "male" | "female" | "",
    birth_date: "",
    height: null as number | null,
    target_weight: null as number | null,
    role_id: null as number | null
  } as EditUserForm
});

// 返回用户列表
const goBack = () => {
  router.back();
};

// 根据角色code获取角色ID
const getRoleIdByCode = (code: string): number | null => {
  const role = roleOptions.value.find(r => r.code === code);
  return role ? role.id : null;
};

// 加载角色列表
const loadRoles = async () => {
  try {
    const response = await unwrap(getAdminRoles({ page: 1, limit: 100 }));
    if (response?.success && response.data?.roles) {
      roleOptions.value = response.data.roles.map((role: any) => ({
        id: role.id,
        name: role.name,
        code: role.code
      }));
    }
  } catch (error) {
    console.error("获取角色列表失败:", error);
  }
};

// 加载用户详情
const loadUserDetail = async () => {
  loading.value = true;
  try {
    const userId = Number(route.params.userId);

    // 调用API获取用户详情
    try {
      const userResponse = await unwrap(getAdminUsersId({ id: userId }));
      if (userResponse?.success && userResponse.data) {
        Object.assign(userInfo, userResponse.data);
      }
    } catch (error) {
      console.error("获取用户详情失败:", error);
      ElMessage.error("获取用户详情失败");
      router.push("/user/index");
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

    const response = await unwrap(
      patchAdminUsersIdToggleStatus({ id: userInfo.id })
    );

    if (response?.success) {
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
  editDialog.form = {
    nickname: userInfo.nickname || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
    gender: (userInfo.gender || "") as "male" | "female" | "",
    birth_date: userInfo.birth_date || "",
    height: userInfo.height || null,
    target_weight: userInfo.target_weight || null,
    role_id: getRoleIdByCode(userInfo.role) || null
  };
  editDialog.visible = true;
};

// 保存用户编辑
const saveUserEdit = async () => {
  editDialog.loading = true;
  try {
    const currentRoleId = getRoleIdByCode(userInfo.role);
    const roleChanged = editDialog.form.role_id !== currentRoleId;

    const updateData: any = {
      nickname: editDialog.form.nickname,
      email: editDialog.form.email,
      phone: editDialog.form.phone,
      gender: editDialog.form.gender,
      birth_date: editDialog.form.birth_date,
      height: editDialog.form.height,
      target_weight: editDialog.form.target_weight
    };

    const response = await unwrap(
      putAdminUsersId({ id: userInfo.id }, updateData)
    );

    if (!response?.success) {
      ElMessage.error(response?.message || "保存失败");
      return;
    }

    if (roleChanged && editDialog.form.role_id !== null) {
      try {
        const roleResponse = await unwrap(
          putAdminUsersIdRole(
            { id: userInfo.id },
            { roleId: editDialog.form.role_id }
          )
        );

        if (!roleResponse?.success) {
          ElMessage.warning("基本信息已更新，但角色更新失败");
          await loadUserDetail();
          return;
        }
      } catch (error) {
        console.error("更新用户角色失败:", error);
        ElMessage.warning("基本信息已更新，但角色更新失败");
        await loadUserDetail();
        return;
      }
    }

    ElMessage.success("保存成功");
    editDialog.visible = false;
    await loadUserDetail();
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

    const response = await unwrap(deleteAdminUsersId({ id: userInfo.id }));

    if (response?.success) {
      ElMessage.success("删除成功");
      router.push("/user/index");
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

// 查看全部健康记录
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
        id: Number(route.params.userId),
        page: allRecordsDialog.page,
        pageSize: allRecordsDialog.pageSize
      })
    );

    if (response?.success && response.data) {
      allRecordsDialog.records = (response.data.records ||
        []) as HealthRecord[];
      allRecordsDialog.total = response.data.total || 0;
    }
  } catch (error) {
    console.error("加载健康记录失败:", error);
    ElMessage.error("加载健康记录失败");
  } finally {
    allRecordsDialog.loading = false;
  }
};

// 健康记录分页变化
const handleRecordsPageChange = (page: number) => {
  allRecordsDialog.page = page;
  loadAllRecords();
};

// 查看饮食记录
const viewDietRecords = async () => {
  dietRecordsDialog.visible = true;
  await loadDietRecords();
};

// 加载饮食记录
const loadDietRecords = async () => {
  dietRecordsDialog.loading = true;
  try {
    // TODO: 等待后端实现 GET /api/admin/users/:id/diet-records 接口
    ElMessage.warning("饮食记录API接口开发中，当前显示为模拟数据");

    // 模拟数据
    const mockData = {
      records: [
        {
          id: 1,
          record_date: "2025-01-15",
          meal_type: "breakfast",
          food_name: "全麦面包 + 牛奶",
          portion: 200,
          calories: 350,
          protein: 15,
          fat: 8,
          carbs: 55,
          notes: "早餐"
        },
        {
          id: 2,
          record_date: "2025-01-15",
          meal_type: "lunch",
          food_name: "鸡胸肉沙拉",
          portion: 300,
          calories: 450,
          protein: 35,
          fat: 12,
          carbs: 40,
          notes: "午餐"
        }
      ],
      total: 2
    };

    dietRecordsDialog.records = mockData.records;
    dietRecordsDialog.total = mockData.total;
  } catch (error) {
    console.error("加载饮食记录失败:", error);
    ElMessage.error("加载饮食记录失败");
  } finally {
    dietRecordsDialog.loading = false;
  }
};

// 饮食记录分页变化
const handleDietRecordsPageChange = (page: number) => {
  dietRecordsDialog.page = page;
  loadDietRecords();
};

// 查看活跃目标
const viewActiveGoals = () => {
  activeGoalsDialog.visible = true;
};

// 查看活跃天数
const viewActiveDays = () => {
  activeDaysDialog.visible = true;
};

// 处理头像更新
const handleAvatarUpdated = (avatarUrl: string) => {
  userInfo.avatar = avatarUrl;
};

// 页面初始化
onMounted(async () => {
  await Promise.all([loadRoles(), loadUserDetail()]);
});
</script>

<style scoped>
.main-content {
  margin: 0 !important;
}

.user-detail-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 2px solid #f0f0f0;
}

.header-info {
  flex: 1;
}

.header-info h2 {
  margin: 0;
  color: var(--el-text-color);
  font-size: 24px;
  font-weight: 600;
}

.detail-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 平板适配 */
@media (max-width: 992px) {
  .user-detail-container {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 20px;
    padding: 12px 0;
  }

  .header-info h2 {
    font-size: 22px;
  }

  .detail-content {
    gap: 16px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-detail-container {
    padding: 12px;
  }

  .page-header {
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .header-info h2 {
    font-size: 20px;
  }

  .detail-content {
    gap: 12px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 480px) {
  .user-detail-container {
    padding: 8px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    padding: 8px 0;
  }

  .page-header .el-button {
    width: 100%;
    justify-content: center;
  }

  .header-info h2 {
    font-size: 18px;
  }

  .detail-content {
    gap: 10px;
  }
}
</style>
