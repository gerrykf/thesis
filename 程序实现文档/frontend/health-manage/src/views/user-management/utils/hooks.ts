// 用户管理模块组合式函数

import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUserList,
  getUserDetail,
  getUserStats,
  updateUserStatus,
  getUserHealthStats,
  getUserHealthRecords
} from "@/api/user-management";
import type {
  UserListParams,
  UserStats,
  SearchForm,
  Pagination,
  UserActionResult
} from "./types";

// 用户列表管理Hook
export function useUserList() {
  const loading = ref(false);
  const userList = ref<API.User[]>([]);
  const searchForm = reactive<SearchForm>({
    username: "",
    nickname: "",
    role: "",
    is_active: null,
    createdDateRange: null,
    loginDateRange: null
  });

  const pagination = reactive<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0
  });

  // 加载用户列表
  const loadUserList = async () => {
    loading.value = true;
    try {
      const params: UserListParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        username: searchForm.username || undefined,
        nickname: searchForm.nickname || undefined,
        role: searchForm.role || undefined,
        is_active: searchForm.is_active,
        createdStartDate:
          searchForm.createdDateRange?.[0] || undefined,
        createdEndDate:
          searchForm.createdDateRange?.[1] || undefined,
        loginStartDate:
          searchForm.loginDateRange?.[0] || undefined,
        loginEndDate: searchForm.loginDateRange?.[1] || undefined
      };

      const response = await getUserList(params) as any;
      if (response?.success && response.data) {
        userList.value = response.data.users || [];
        pagination.total = response.data.total || 0;
      }
    } catch (error) {
      console.error("加载用户列表失败:", error);
      ElMessage.error("加载用户列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 搜索用户
  const handleSearch = () => {
    pagination.page = 1;
    loadUserList();
  };

  // 重置搜索
  const handleReset = () => {
    Object.assign(searchForm, {
      username: "",
      nickname: "",
      role: "",
      is_active: null,
      createdDateRange: null,
      loginDateRange: null
    });
    pagination.page = 1;
    loadUserList();
  };

  return {
    loading,
    userList,
    searchForm,
    pagination,
    loadUserList,
    handleSearch,
    handleReset
  };
}

// 用户统计Hook
export function useUserStats() {
  const userStats = reactive<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    adminUsers: 0
  });

  const loadUserStats = async () => {
    try {
      const response = await getUserStats() as any;
      if (response?.success && response.data) {
        Object.assign(userStats, {
          totalUsers: response.data.totalUsers || 0,
          activeUsers: response.data.activeUsers || 0,
          newUsersToday: response.data.newUsersToday || 0,
          adminUsers: response.data.adminUsers || 0
        });
      }
    } catch (error) {
      console.error("加载用户统计数据失败:", error);
    }
  };

  return {
    userStats,
    loadUserStats
  };
}

// 用户操作Hook
export function useUserActions() {
  // 切换用户状态
  const toggleUserStatus = async (
    user: API.User
  ): Promise<UserActionResult> => {
    const action = user.is_active ? "禁用" : "启用";

    try {
      await ElMessageBox.confirm(
        `确定要${action}用户 "${user.nickname || user.username}" 吗？`,
        "确认操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await updateUserStatus(user.id!, {
        is_active: !user.is_active
      }) as any;

      if (response?.success) {
        user.is_active = !user.is_active;
        ElMessage.success(`${action}成功`);
        return { success: true, message: `${action}成功` };
      } else {
        throw new Error(response.message || `${action}用户失败`);
      }
    } catch (error: any) {
      if (error !== "cancel") {
        console.error(`${action}用户失败:`, error);
        ElMessage.error(error.message || `${action}用户失败`);
        return { success: false, message: error.message };
      }
      return { success: false, message: "操作已取消" };
    }
  };

  return {
    toggleUserStatus
  };
}

// 用户详情Hook
export function useUserDetail(userId: string | number) {
  const loading = ref(false);
  const userInfo = ref<API.User>({});
  const healthStats = ref({
    totalRecords: 0,
    dietRecords: 0,
    activeGoals: 0,
    activeDays: 0
  });
  const healthRecords = ref<API.HealthRecord[]>([]);

  // 加载用户详情
  const loadUserDetail = async () => {
    loading.value = true;
    try {
      const response = await getUserDetail(Number(userId)) as any;
      if (response?.success && response.data) {
        userInfo.value = response.data;
      }
    } catch (error) {
      console.error("加载用户详情失败:", error);
      ElMessage.error("加载用户详情失败");
    } finally {
      loading.value = false;
    }
  };

  // 加载健康统计
  const loadHealthStats = async () => {
    try {
      const response = await getUserHealthStats(Number(userId)) as any;
      if (response?.success && response.data) {
        healthStats.value = response.data;
      }
    } catch (error) {
      console.error("加载健康统计失败:", error);
    }
  };

  // 加载健康记录
  const loadHealthRecords = async () => {
    try {
      const response = await getUserHealthRecords(Number(userId), {
        page: 1,
        pageSize: 10
      }) as any;
      if (response?.success && response.data) {
        healthRecords.value = response.data.records || [];
      }
    } catch (error) {
      console.error("加载健康记录失败:", error);
    }
  };

  return {
    loading,
    userInfo,
    healthStats,
    healthRecords,
    loadUserDetail,
    loadHealthStats,
    loadHealthRecords
  };
}
