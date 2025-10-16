<template>
  <div class="menu-management-container">
    <!-- 菜单列表表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>菜单列表</span>
          <div class="card-header-actions">
            <el-button
              v-perms="['menu:add']"
              type="success"
              :icon="Plus"
              @click="showAddMenuDialog"
            >
              添加菜单
            </el-button>
            <el-button type="primary" :icon="Refresh" @click="loadMenuList">
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        border
        stripe
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="菜单名称" min-width="180" />
        <el-table-column label="图标" width="100" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon" :size="18">
              <component :is="row.icon" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" min-width="180" />
        <el-table-column prop="component" label="组件" min-width="200">
          <template #default="{ row }">
            {{ row.component || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeColor(row.type)">
              {{ getMenuTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-perms="['menu:edit']"
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-perms="['menu:delete']"
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑菜单对话框 -->
    <el-dialog
      v-model="menuDialog.visible"
      :title="menuDialog.isEdit ? '编辑菜单' : '添加菜单'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="menuFormRef"
        :model="menuDialog.form"
        :rules="menuDialog.rules"
        label-width="120px"
        :disabled="menuDialog.loading"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="menuDialog.form.parent_id"
            :data="menuTreeOptions"
            placeholder="请选择上级菜单"
            check-strictly
            :render-after-expand="false"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="menuDialog.form.title"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuDialog.form.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="menuDialog.form.type === 'menu'"
          label="路径"
          prop="path"
        >
          <el-input v-model="menuDialog.form.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item
          v-if="menuDialog.form.type === 'menu'"
          label="组件"
          prop="component"
        >
          <el-input
            v-model="menuDialog.form.component"
            placeholder="请输入组件路径"
          />
        </el-form-item>
        <el-form-item v-if="menuDialog.form.type === 'menu'" label="图标">
          <el-input v-model="menuDialog.form.icon" placeholder="请输入图标名称">
            <template #prefix>
              <el-icon v-if="menuDialog.form.icon">
                <component :is="menuDialog.form.icon" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="menuDialog.form.type === 'button'"
          label="权限标识"
          prop="permission"
        >
          <el-input
            v-model="menuDialog.form.permission"
            placeholder="请输入权限标识，如: user:add"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="menuDialog.form.sort"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuDialog.form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="menuDialog.loading"
            @click="handleSaveMenu"
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
import { Plus, Refresh, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { getAdminMenus } from "@/api/admin";
import { unwrap } from "@/utils/api";

defineOptions({
  name: "MenuManagement"
});

// 加载状态
const loading = ref(false);

// 菜单列表
const menuList = ref<any[]>([]);

// 表单引用
const menuFormRef = ref<FormInstance>();

// 菜单对话框
const menuDialog = reactive({
  visible: false,
  isEdit: false,
  loading: false,
  form: {
    id: undefined as number | undefined,
    parent_id: 0,
    title: "",
    type: "menu" as "menu" | "button",
    path: "",
    component: "",
    icon: "",
    permission: "",
    sort: 0,
    status: 1
  },
  rules: {
    title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
    path: [
      {
        required: true,
        message: "请输入路径",
        trigger: "blur"
      }
    ],
    sort: [
      {
        required: true,
        message: "请输入排序",
        trigger: "blur"
      }
    ]
  }
});

// 菜单树选项（用于选择上级菜单）
const menuTreeOptions = computed(() => {
  const buildTree = (menus: any[], parentId = 0): any[] => {
    return menus
      .filter(menu => menu.parent_id === parentId)
      .map(menu => ({
        value: menu.id,
        label: menu.title,
        children: buildTree(menus, menu.id)
      }));
  };

  const flatMenuList = flattenMenus(menuList.value);
  return [{ value: 0, label: "顶级菜单", children: buildTree(flatMenuList) }];
});

// 展平菜单树
const flattenMenus = (menus: any[]): any[] => {
  let result: any[] = [];
  menus.forEach(menu => {
    result.push(menu);
    if (menu.children && menu.children.length > 0) {
      result = result.concat(flattenMenus(menu.children));
    }
  });
  return result;
};

// 获取菜单类型文本
const getMenuTypeText = (type: string) => {
  const map: Record<string, string> = {
    menu: "菜单",
    button: "按钮"
  };
  return map[type] || type;
};

// 获取菜单类型颜色
const getMenuTypeColor = (type: string) => {
  const map: Record<string, string> = {
    menu: "primary",
    button: "success"
  };
  return map[type] || "info";
};

// 加载菜单列表
const loadMenuList = async () => {
  loading.value = true;
  try {
    const response = await unwrap(getAdminMenus());
    if (response?.success && response.data) {
      menuList.value = response.data;
    }
  } catch (error) {
    console.error("加载菜单列表失败:", error);
    ElMessage.error("加载菜单列表失败");
  } finally {
    loading.value = false;
  }
};

// 显示添加菜单对话框
const showAddMenuDialog = () => {
  menuDialog.isEdit = false;
  menuDialog.form = {
    id: undefined,
    parent_id: 0,
    title: "",
    type: "menu",
    path: "",
    component: "",
    icon: "",
    permission: "",
    sort: 0,
    status: 1
  };
  menuFormRef.value?.resetFields();
  menuDialog.visible = true;
};

// 编辑菜单
const handleEdit = (row: any) => {
  menuDialog.isEdit = true;
  menuDialog.form = {
    id: row.id,
    parent_id: row.parent_id || 0,
    title: row.title,
    type: row.type || "menu",
    path: row.path || "",
    component: row.component || "",
    icon: row.icon || "",
    permission: row.permission || "",
    sort: row.sort || 0,
    status: row.status
  };
  menuDialog.visible = true;
};

// 保存菜单
const handleSaveMenu = async () => {
  if (!menuFormRef.value) return;

  await menuFormRef.value.validate(async valid => {
    if (!valid) return;

    menuDialog.loading = true;
    try {
      // TODO: 调用创建/更新菜单API
      // const response = menuDialog.isEdit
      //   ? await unwrap(putAdminMenusId({ id: menuDialog.form.id! }, menuDialog.form))
      //   : await unwrap(postAdminMenus(menuDialog.form));

      // if (response?.success) {
      //   ElMessage.success(menuDialog.isEdit ? "更新成功" : "添加成功");
      //   menuDialog.visible = false;
      //   await loadMenuList();
      // } else {
      //   ElMessage.error(response?.message || "操作失败");
      // }

      // 暂时模拟成功
      ElMessage.warning("菜单管理功能需要后端支持创建/更新接口");
      menuDialog.visible = false;
    } catch (error: any) {
      console.error("保存菜单失败:", error);
      ElMessage.error(error?.message || "保存失败");
    } finally {
      menuDialog.loading = false;
    }
  });
};

// 删除菜单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${row.title}" 吗？如果该菜单下有子菜单，子菜单也将被删除！`,
      "确认删除",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "error"
      }
    );

    // TODO: 调用删除菜单API
    // const response = await unwrap(deleteAdminMenusId({ id: row.id }));
    // if (response?.success) {
    //   ElMessage.success("删除成功");
    //   await loadMenuList();
    // } else {
    //   ElMessage.error(response?.message || "删除失败");
    // }

    // 暂时模拟成功
    ElMessage.warning("菜单管理功能需要后端支持删除接口");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除菜单失败:", error);
      ElMessage.error("删除菜单失败");
    }
  }
};

// 页面初始化
onMounted(() => {
  loadMenuList();
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-actions {
  display: flex;
  gap: 12px;
}

:deep(.el-table th) {
  color: #606266;
  font-weight: 600;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
