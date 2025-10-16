import { reactive, ref, onMounted, watch, type Ref, h } from "vue";
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
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import RoleForm from "../components/RoleForm.vue";

export function useRole(treeRef: Ref) {
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
  const isLinkage = ref(false); // 是否父子联动
  const treeSearchValue = ref(""); // 树搜索值
  const isExpandAll = ref(false); // 是否展开所有
  const isSelectAll = ref(false); // 是否全选

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
    const { id } = row;
    if (id) {
      curRow.value = row;
      isShow.value = true;

      // 等待DOM更新,确保tree组件已经渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const { data } = await getAdminRolesIdMenus({ id: row.id });
        if (data?.menuIds && treeRef.value && treeData.value.length > 0) {
          // 只设置叶子节点，避免父节点自动选中
          const leafIds = data.menuIds.filter(id => {
            const menu = findMenuById(treeData.value, id);
            return menu && (!menu.children || menu.children.length === 0);
          });

          // 使用nextTick确保tree组件完全渲染后再设置选中状态
          setTimeout(() => {
            if (treeRef.value) {
              treeRef.value.setCheckedKeys(leafIds);
            }
          }, 50);
        }
      } catch (error: any) {
        ElMessage.error(error.message || "获取角色权限失败");
      }
    } else {
      curRow.value = null;
      isShow.value = false;
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

  // 获取所有菜单ID（用于全选）
  // function getAllMenuIds(menus: Menu[]): number[] {
  //   const ids: number[] = [];
  //   function traverse(items: Menu[]) {
  //     items.forEach(item => {
  //       ids.push(item.id);
  //       if (item.children) {
  //         traverse(item.children);
  //       }
  //     });
  //   }
  //   traverse(menus);
  //   return ids;
  // }

  // 保存菜单权限
  async function handleSave() {
    if (!curRow.value || !treeRef.value) return;

    try {
      const { id, name } = curRow.value;
      // 获取选中的节点和半选中的节点（父节点）
      const checkedKeys = treeRef.value.getCheckedKeys();
      const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
      const menuIds = [...checkedKeys, ...halfCheckedKeys];

      await putAdminRolesIdMenus({ id }, { menuIds });
      ElMessage.success(`角色"${name}"的菜单权限修改成功`);
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

  const filterMethod = (query: string, node) => {
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

  onMounted(async () => {
    onSearch();
    // 加载菜单树
    try {
      const { data } = await getAdminMenus();

      if (data && Array.isArray(data)) {
        // API返回的已经是树形结构，直接使用
        treeData.value = data;

        // 使用 getKeyList 获取所有节点ID（包括子节点）
        treeIds.value = getKeyList(data, "id");

        console.log("menu data", data);
        console.log("treeIds", treeIds.value);
      }
    } catch (error: any) {
      ElMessage.error(error.message || "获取菜单列表失败");
    }
  });

  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treeIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
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
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
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
