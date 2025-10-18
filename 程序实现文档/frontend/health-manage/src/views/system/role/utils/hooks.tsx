import { reactive, ref, onMounted, watch, nextTick, type Ref, h } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import type { Role, RoleFormData, Menu, FormItemProps } from "./types";
import {
  getAdminRoles,
  getAdminMenus,
  putAdminRolesIdMenus,
  postAdminRoles,
  putAdminRolesId,
  deleteAdminRolesId,
  patchAdminRolesIdStatus,
  getAdminRolesIdMenus
} from "@/api/admin";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import RoleForm from "../components/RoleForm.vue";

export function useRole(treeRef: Ref, updateSelectAllState?: () => void) {
  // 搜索表单
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });

  // 表单引用
  const formRef = ref();

  // 当前选中的角色
  const curRow = ref<Role | null>(null);

  // 表格数据
  const dataList = ref<Role[]>([]);

  // 权限树相关
  const treeIds = ref<number[]>([]);
  const treeData = ref<Menu[]>([]);
  const isShow = ref(false); // 是否显示权限树
  const isEditMode = ref(false); // 是否处于编辑模式（控制父子联动）
  const treeSearchValue = ref(""); // 树搜索值
  const isExpandAll = ref(true); // 是否展开所有
  const isSelectAll = ref(false); // 是否全选
  const expandedKeys = ref<number[]>([]); // 展开的节点

  // 加载状态
  const loading = ref(true);
  const switchLoadMap = ref<Record<number, { loading: boolean }>>({});

  // 树组件配置
  const treeProps = {
    value: "id",
    label: "title",
    children: "children"
  };

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "id",
      minWidth: 90
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "code",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, index }) => (
        <el-switch
          v-model={row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          loading={switchLoadMap.value[index]?.loading}
          onChange={() => handleStatusChange(row, index)}
        />
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 160
    },
    {
      label: "创建时间",
      prop: "created_at",
      minWidth: 180,
      formatter: ({ created_at }) => {
        if (!created_at) return "";
        return new Date(created_at).toLocaleString("zh-CN");
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  // 打开新增/编辑角色对话框
  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          code: row?.code ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(RoleForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as RoleFormData;

        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            const success = await handleSaveRole(title, curData, row?.id);
            if (success) {
              done();
            }
          }
        });
      }
    });
  }

  // 切换角色状态
  async function handleStatusChange(row: Role, index: number) {
    try {
      await ElMessageBox.confirm(
        `确认要${row.status === 0 ? "停用" : "启用"}"${row.name}"吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      switchLoadMap.value[index] = { loading: true };

      await patchAdminRolesIdStatus({ id: row.id });

      setTimeout(() => {
        switchLoadMap.value[index] = { loading: false };
        ElMessage.success(`已${row.status === 0 ? "停用" : "启用"}${row.name}`);
      }, 300);
    } catch (error: any) {
      // 取消或失败时恢复状态
      row.status = row.status === 0 ? 1 : 0;
      if (error !== "cancel") {
        ElMessage.error(error.message || "操作失败");
      }
    }
  }

  // 删除角色
  async function handleDelete(row: Role) {
    try {
      await ElMessageBox.confirm(
        `确认要删除角色"${row.name}"吗? 此操作不可撤销。`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      await deleteAdminRolesId({ id: row.id });
      ElMessage.success(`删除角色"${row.name}"成功`);
      onSearch();
    } catch (error: any) {
      if (error !== "cancel") {
        ElMessage.error(error.message || "删除失败");
      }
    }
  }

  // 编辑/新增角色
  async function handleSaveRole(
    title: string,
    data: RoleFormData,
    roleId?: number
  ) {
    try {
      if (title === "新增") {
        await postAdminRoles(data);
        ElMessage.success(`创建角色"${data.name}"成功`);
      } else {
        await putAdminRolesId({ id: roleId! }, data);
        ElMessage.success(`更新角色"${data.name}"成功`);
      }
      onSearch();
      return true;
    } catch (error: any) {
      ElMessage.error(error.message || `${title}失败`);
      return false;
    }
  }

  /** 菜单权限 */
  async function handleMenu(row?: any) {
    if (row && row.id) {
      // 设置展开的节点
      expandedKeys.value = getExpandedKeys(treeData.value);

      curRow.value = row;
      isShow.value = true;

      try {
        // 获取角色权限
        const { data } = await getAdminRolesIdMenus({ id: row.id });
        console.log("获取到的角色权限menuIds:", data?.menuIds);

        if (!data?.menuIds || !treeRef.value || treeData.value.length === 0) {
          console.warn("权限设置失败:", {
            hasMenuIds: !!data?.menuIds,
            hasTreeRef: !!treeRef.value,
            hasTreeData: treeData.value.length > 0
          });
          return;
        }

        // 步骤1: 先禁用父子联动（check-strictly=true）
        isEditMode.value = false;

        // 步骤2: 等待DOM更新后设置选中的节点
        await nextTick(() => {
          if (treeRef.value) {
            console.log("设置权限树选中状态:", data.menuIds);
            treeRef.value.setCheckedKeys(data.menuIds);
          }
        });

        // 步骤3: 启用父子联动（check-strictly=false）
        await nextTick(() => {
          isEditMode.value = true;
          console.log("已启用父子联动模式");
        });

        // 步骤4: 修复el-tree-v2的联动bug（动态勾选一个节点触发联动刷新）
        fixTreeBug(data.menuIds);

        // 等待fixTreeBug执行完成后再更新状态
        setTimeout(() => {
          if (treeRef.value) {
            const checkedKeys = treeRef.value.getCheckedKeys();
            const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
            console.log("实际选中的节点:", checkedKeys);
            console.log("半选中的节点:", halfCheckedKeys);

            // 更新全选按钮状态
            if (updateSelectAllState) {
              updateSelectAllState();
            }
          }
        }, 150);
      } catch (error: any) {
        console.error("获取角色权限失败:", error);
        ElMessage.error(error.message || "获取角色权限失败");
      }
    } else {
      curRow.value = null;
      isShow.value = false;
      isEditMode.value = false;
    }
  }

  // 查找菜单节点
  function findMenuById(menus: Menu[], id: number): Menu | null {
    for (const menu of menus) {
      if (menu.id === id) return menu;
      if (menu.children) {
        const found = findMenuById(menu.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // 勾选指定的子节点
  function checkNodeById(nodeId: number, isChecked = true) {
    if (treeRef.value && nodeId) {
      treeRef.value.setChecked(nodeId, isChecked);
    }
  }

  // 修复 el-tree-v2 的联动bug：动态勾选一个子节点来触发联动刷新
  function fixTreeBug(menuIds: number[]) {
    // 找到第一个有子节点的菜单ID作为测试节点
    let testNodeId: number | null = null;
    for (const id of menuIds) {
      const menu = findMenuById(treeData.value, id);
      if (menu?.children && menu.children.length > 0) {
        testNodeId = id;
        break;
      }
    }

    if (!testNodeId) return;

    // 如果当前数据包含测试节点，先取消再勾选
    if (menuIds.includes(testNodeId)) {
      checkNodeById(testNodeId, false);
      setTimeout(() => {
        checkNodeById(testNodeId!);
      }, 100);
    } else {
      // 如果不包含，先勾选再取消
      checkNodeById(testNodeId, true);
      setTimeout(() => {
        checkNodeById(testNodeId!, false);
      }, 100);
    }
  }

  /**
   * 获取所有展开的节点ID
   */
  function getExpandedKeys(data: Menu[]): number[] {
    const keys: number[] = [];
    function traverse(nodes: Menu[]) {
      nodes.forEach(node => {
        keys.push(node.id);
        if (node.children) {
          traverse(node.children);
        }
      });
    }
    traverse(data);
    return keys;
  }

  // 保存菜单权限
  async function handleSave() {
    if (!curRow.value || !treeRef.value) return;

    try {
      const { id, name } = curRow.value;
      // 只获取完全选中的节点（不包括半选中的节点）
      const checkedKeys = treeRef.value.getCheckedKeys();

      console.log("保存权限 - 选中的节点:", checkedKeys);

      await putAdminRolesIdMenus({ id }, { menuIds: checkedKeys });
      ElMessage.success(`角色"${name}"的菜单权限修改成功`);
      isShow.value = false;
    } catch (error: any) {
      ElMessage.error(error.message || "保存权限失败");
    }
  }

  // 高亮当前选中行
  function rowStyle({ row }: { row: Role }) {
    return {
      cursor: "pointer",
      background:
        row.id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node: Menu) => {
    return node.title!.includes(query);
  };

  // 搜索
  async function onSearch() {
    loading.value = true;

    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        name: form.name || undefined,
        code: form.code || undefined,
        status: form.status ? (Number(form.status) as 0 | 1) : undefined
      };

      const response = await getAdminRoles(params);

      if (response.data) {
        dataList.value = response.data.roles || [];
        pagination.total = response.data.pagination?.total || 0;
      }
    } catch (error: any) {
      ElMessage.error(error.message || "获取角色列表失败");
      dataList.value = [];
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    }
  }

  // 重置搜索表单
  const resetForm = (formEl: any) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 分页变化
  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: Role[]) {
    console.log("handleSelectionChange", val);
  }

  /**
   * 获取树中所有节点的ID（递归）
   */
  function getAllMenuIds(data: Menu[]): number[] {
    const ids: number[] = [];
    function traverse(nodes: Menu[]) {
      nodes.forEach(node => {
        ids.push(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    }
    traverse(data);
    return ids;
  }

  onMounted(async () => {
    onSearch();
    // 加载菜单树（包括静态路由和动态菜单，用于权限分配）
    try {
      // 添加参数：
      // - include_static=true: 包含静态路由
      // - for_permission_tree=true: 返回所有菜单（不受角色限制，用于权限分配）
      const { data } = await getAdminMenus({
        include_static: "true",
        for_permission_tree: "true"
      } as any);

      if (data && Array.isArray(data)) {
        // API返回的已经是树形结构，直接使用
        treeData.value = data;

        // 获取所有节点ID（包括所有子节点）
        treeIds.value = getAllMenuIds(data);

        console.log("权限树菜单数据（所有菜单，包含静态路由）:", data);
        console.log("treeIds (所有节点):", treeIds.value);
        console.log("treeIds 总数:", treeIds.value.length);
      }
    } catch (error: any) {
      ElMessage.error(error.message || "获取菜单列表失败");
    }
  });

  watch(isExpandAll, val => {
    if (!treeRef.value) return;
    val
      ? treeRef.value.setExpandedKeys(expandedKeys.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    if (!treeRef.value) return;
    val
      ? treeRef.value.setCheckedKeys(treeIds.value)
      : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    treeData,
    treeProps,
    treeIds,
    isEditMode,
    expandedKeys,
    pagination,
    isExpandAll,
    treeSearchValue,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleSave,
    handleDelete,
    handleSaveRole,
    filterMethod,
    onQueryChanged,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
