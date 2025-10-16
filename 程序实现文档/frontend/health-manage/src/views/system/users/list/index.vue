<template>
  <div class="user-management-container">
    <!-- 搜索和筛选区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="searchForm.nickname"
            placeholder="请输入昵称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="searchForm.role"
            placeholder="请选择角色"
            clearable
            style="width: 150px"
          >
            <el-option label="超级管理员" value="super_admin" />
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.is_active"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createdDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="最后登录">
          <el-date-picker
            v-model="searchForm.loginDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-users">
              <el-icon size="24">
                <User />
              </el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ userStats.totalUsers }}</h3>
              <p>总用户数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-users">
              <el-icon size="24">
                <UserFilled />
              </el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ userStats.activeUsers }}</h3>
              <p>活跃用户</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon new-users">
              <el-icon size="24">
                <Plus />
              </el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ userStats.newUsersToday }}</h3>
              <p>今日新增</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon admin-users">
              <el-icon size="24">
                <Setting />
              </el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ userStats.adminUsers }}</h3>
              <p>管理员</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户列表表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <div class="card-header-actions">
            <!-- v-perms="['user:add']" -->
            <el-button type="success" :icon="Plus" @click="showAddUserDialog">
              添加用户
            </el-button>
            <el-button type="primary" :icon="Refresh" @click="loadUserList">
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar
              :size="40"
              :src="row.avatar"
              :icon="UserFilled"
              class="user-avatar"
            />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120">
          <template #default="{ row }">
            {{ row.nickname || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180">
          <template #default="{ row }">
            {{ row.email || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120">
          <template #default="{ row }">
            {{ row.phone || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getUserRoleType(row.role)">
              {{ getUserRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'info'">
              {{ row.is_active ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后登录" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.last_login_at) }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="viewUserDetail(row.id)"
            >
              查看
            </el-button>
            <el-button
              :type="row.is_active ? 'warning' : 'success'"
              size="small"
              :disabled="row.role === 'admin' && row.id === currentUserId"
              @click="handleToggleUserStatus(row)"
            >
              {{ row.is_active ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadUserList"
          @current-change="loadUserList"
        />
      </div>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addUserDialog.visible"
      title="添加用户"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addUserFormRef"
        :model="addUserDialog.form"
        :rules="addUserDialog.rules"
        label-width="120px"
        :disabled="addUserDialog.loading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addUserDialog.form.username"
            placeholder="请输入用户名"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addUserDialog.form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="addUserDialog.form.nickname"
            placeholder="请输入昵称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addUserDialog.form.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="addUserDialog.form.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item v-if="isAdmin || isSuperAdmin" label="用户角色">
          <el-select
            v-model="addUserDialog.form.role_id"
            placeholder="请选择角色"
            style="width: 100%"
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
            <span v-if="!isSuperAdmin">
              只有超级管理员可以分配超级管理员角色
            </span>
          </div>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addUserDialog.form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="addUserDialog.form.birth_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="身高(cm)">
          <el-input-number
            v-model="addUserDialog.form.height"
            :min="0"
            :max="300"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="目标体重(kg)">
          <el-input-number
            v-model="addUserDialog.form.target_weight"
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
          <el-button @click="addUserDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="addUserDialog.loading"
            @click="handleAddUser"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Refresh,
  View,
  User,
  UserFilled,
  Plus,
  Setting
} from "@element-plus/icons-vue";
import { ElMessage, type FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import {
  useUserList,
  useUserStats,
  useUserActions,
  formatDate,
  getUserRoleText,
  getUserRoleType,
  getUserStatusText,
  getUserStatusType
} from "../utils";
import { postAdminUsers, getAdminRoles } from "@/api/admin";
import { unwrap } from "@/utils/api";

defineOptions({
  name: "UserList"
});

const router = useRouter();
const userStore = useUserStoreHook();

// 使用组合式函数
const {
  loading,
  userList,
  searchForm,
  pagination,
  loadUserList,
  handleSearch,
  handleReset
} = useUserList();

const { userStats, loadUserStats } = useUserStats();
const { toggleUserStatus } = useUserActions();

// 当前登录用户ID和角色
const currentUserId = ref((userStore as any).userId || 0);
const currentUserRoles = ref((userStore as any).roles || []);
const isSuperAdmin = ref(currentUserRoles.value.includes("super_admin"));
const isAdmin = ref(currentUserRoles.value.includes("admin"));

// 角色选项列表
const roleOptions = ref<Array<{ id: number; name: string; code: string }>>([]);

// 过滤后的角色选项 - 管理员无法看到超级管理员角色
const filteredRoleOptions = computed(() => {
  if (isSuperAdmin.value) {
    return roleOptions.value;
  } else if (isAdmin.value) {
    return roleOptions.value.filter(role => role.id !== 3);
  } else {
    return [];
  }
});

// 表单引用
const addUserFormRef = ref<FormInstance>();

// 添加用户对话框
const addUserDialog = reactive({
  visible: false,
  loading: false,
  form: {
    username: "",
    password: "",
    nickname: "",
    email: "",
    phone: "",
    role_id: 1,
    gender: undefined as "male" | "female" | "other" | undefined,
    birth_date: "",
    height: null as number | null,
    target_weight: null as number | null
  },
  rules: {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        min: 3,
        max: 50,
        message: "用户名长度在 3 到 50 个字符",
        trigger: "blur"
      }
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        min: 6,
        max: 50,
        message: "密码长度在 6 到 50 个字符",
        trigger: "blur"
      }
    ],
    email: [
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ]
  }
});

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

// 显示添加用户对话框
const showAddUserDialog = () => {
  // 重置表单
  addUserDialog.form = {
    username: "",
    password: "",
    nickname: "",
    email: "",
    phone: "",
    role_id: 1,
    gender: undefined,
    birth_date: "",
    height: null,
    target_weight: null
  };
  addUserFormRef.value?.resetFields();
  addUserDialog.visible = true;
};

// 添加用户
const handleAddUser = async () => {
  if (!addUserFormRef.value) return;

  await addUserFormRef.value.validate(async valid => {
    if (!valid) return;

    addUserDialog.loading = true;
    try {
      const response = await unwrap(postAdminUsers(addUserDialog.form));

      if (response?.success) {
        ElMessage.success("用户创建成功");
        addUserDialog.visible = false;
        // 重新加载用户列表和统计数据
        await Promise.all([loadUserList(), loadUserStats()]);
      } else {
        ElMessage.error(response?.message || "创建用户失败");
      }
    } catch (error: any) {
      console.error("创建用户失败:", error);
      ElMessage.error(error?.message || "创建用户失败");
    } finally {
      addUserDialog.loading = false;
    }
  });
};

// 查看用户详情
const viewUserDetail = (userId: number) => {
  router.push(`/users/detail/${userId}`);
};

// 处理用户状态切换
const handleToggleUserStatus = async (user: any) => {
  const result = await toggleUserStatus(user);
  if (result.success) {
    loadUserStats(); // 重新加载统计数据
  }
};

// 页面初始化
onMounted(() => {
  loadRoles();
  loadUserStats();
  loadUserList();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.total-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active-users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.new-users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.admin-users {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-gray-500, currentColor);
}

.stat-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-actions {
  display: flex;
  gap: 12px;
}

.user-avatar {
  border: 2px solid #f0f0f0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-table th) {
  color: #606266;
  font-weight: 600;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
