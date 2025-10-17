import { ref, reactive, computed, h, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { deviceDetection, isAllEmpty } from "@pureadmin/utils";
import { addDialog } from "@/components/ReDialog";
import {
  getAdminMenus,
  postAdminMenus,
  putAdminMenusId,
  deleteAdminMenusId
} from "@/api/admin";
import type { Menu, MenuTreeOption } from "./types";
import MenuForm from "../components/MenuForm.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

export function useMenu() {
  // 搜索表单
  const form = reactive({
    title: ""
  });

  // 加载状态
  const loading = ref(false);

  // 菜单列表
  const dataList = ref<Menu[]>([]);

  // 表单引用
  const formRef = ref();

  // 当前选中的菜单
  const curRow = ref<Menu | null>(null);

  const getMenuType = (type, text = false) => {
    switch (type) {
      case 0:
        return text ? "菜单" : "primary";
      case 1:
        return text ? "iframe" : "warning";
      case 2:
        return text ? "外链" : "danger";
      case 3:
        return text ? "按钮" : "info";
    }
  };

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.title}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.menu_type)}
          effect="plain"
        >
          {getMenuType(row.menu_type, true)}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "权限标识",
      prop: "auths",
      minWidth: 150
    },
    {
      label: "排序",
      prop: "rank",
      width: 80
    },
    {
      label: "隐藏",
      prop: "showLink",
      formatter: ({ show_link }) => (show_link ? "否" : "是"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  // 菜单树选项（用于选择上级菜单）
  const menuTreeOptions = computed(() => {
    const buildTree = (menus: Menu[], parentId = 0): MenuTreeOption[] => {
      return menus
        .filter(menu => menu.parent_id === parentId)
        .map(menu => ({
          value: menu.id!,
          label: menu.title,
          children: buildTree(menus, menu.id)
        }));
    };

    const flatMenuList = flattenMenus(dataList.value);
    return [{ value: 0, label: "顶级菜单", children: buildTree(flatMenuList) }];
  });

  // 展平菜单树
  function flattenMenus(menus: Menu[]): Menu[] {
    let result: Menu[] = [];
    menus.forEach(menu => {
      result.push(menu);
      if (menu.children && menu.children.length > 0) {
        result = result.concat(flattenMenus(menu.children));
      }
    });
    return result;
  }

  // 获取菜单类型文本 0:菜单 1:iframe 2:外链 3:按钮
  function getMenuTypeText(type: number) {
    const map: Record<number, string> = {
      0: "菜单",
      1: "iframe",
      2: "外链",
      3: "按钮"
    };
    return map[type] || "未知";
  }

  // 获取菜单类型颜色
  function getMenuTypeColor(type: number) {
    const map: Record<number, any> = {
      0: "primary",
      1: "warning",
      2: "info",
      3: "success"
    };
    return map[type] || "info";
  }

  // 加载菜单列表
  async function loadMenuList() {
    loading.value = true;
    try {
      const response = await getAdminMenus();
      if (response?.data) {
        dataList.value = response.data;
      }
    } catch (error) {
      console.error("加载菜单列表失败:", error);
      ElMessage.error("加载菜单列表失败");
    } finally {
      loading.value = false;
    }
  }

  // 搜索
  async function onSearch() {
    await loadMenuList();
  }

  // 重置
  function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 打开菜单对话框
  function openDialog(title = "新增", row?: Menu | { parent_id: number }) {
    // 判断是否是编辑模式
    const isEdit = title === "修改";
    const menuRow = isEdit ? (row as Menu) : null;
    const parentId = isEdit
      ? menuRow?.parent_id || 0
      : (row as any)?.parent_id || 0;

    // 构建上级菜单选项（转换为vue-pure-admin需要的格式）
    const buildMenuTree = (menus: Menu[]): any[] => {
      return menus.map(menu => ({
        id: menu.id,
        title: menu.title,
        children:
          menu.children && menu.children.length > 0
            ? buildMenuTree(menu.children)
            : undefined
      }));
    };

    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          menuType: menuRow?.menu_type ?? 0,
          higherMenuOptions: buildMenuTree(dataList.value),
          parentId: parentId,
          title: menuRow?.title || "",
          name: menuRow?.name || "",
          path: menuRow?.path || "",
          component: menuRow?.component || "",
          rank: menuRow?.rank ?? 99,
          redirect: menuRow?.redirect || "",
          icon: menuRow?.icon || "",
          extraIcon: menuRow?.extra_icon || "",
          enterTransition: menuRow?.enter_transition || "",
          leaveTransition: menuRow?.leave_transition || "",
          activePath: menuRow?.active_path || "",
          auths: menuRow?.auths || "",
          frameSrc: menuRow?.frame_src || "",
          frameLoading: menuRow?.frame_loading === 1,
          keepAlive: menuRow?.keep_alive === 1,
          hiddenTag: menuRow?.hidden_tag === 1,
          fixedTag: menuRow?.fixed_tag === 1,
          showLink: menuRow?.show_link === 1,
          showParent: menuRow?.show_parent === 1
        }
      },
      width: "800px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(MenuForm, { ref: formRef, formInline: {} as any }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value?.getRef();
        const curData = options.props.formInline;

        FormRef?.validate(async (valid: boolean) => {
          if (valid) {
            const success = await handleSaveMenu(title, curData, menuRow?.id);
            if (success) {
              done();
              await loadMenuList();
            }
          }
        });
      }
    });
  }

  // 保存菜单（转换驼峰命名到snake_case并转换boolean到0/1）
  async function handleSaveMenu(title: string, data: any, id?: number) {
    try {
      const menuData: any = {
        parent_id: data.parentId,
        menu_type: data.menuType,
        title: data.title,
        name: data.name,
        path: data.path,
        component: data.component,
        rank: data.rank,
        redirect: data.redirect,
        icon: data.icon,
        extra_icon: data.extraIcon,
        enter_transition: data.enterTransition,
        leave_transition: data.leaveTransition,
        active_path: data.activePath,
        auths: data.auths,
        frame_src: data.frameSrc,
        frame_loading: data.frameLoading ? 1 : 0,
        keep_alive: data.keepAlive ? 1 : 0,
        hidden_tag: data.hiddenTag ? 1 : 0,
        fixed_tag: data.fixedTag ? 1 : 0,
        show_link: data.showLink ? 1 : 0,
        show_parent: data.showParent ? 1 : 0,
        status: 1
      };

      if (title === "新增") {
        await postAdminMenus(menuData as any);
        ElMessage.success(`新增菜单"${data.title}"成功`);
      } else {
        await putAdminMenusId({ id: id! }, menuData as any);
        ElMessage.success(`修改菜单"${data.title}"成功`);
      }
      return true;
    } catch (error: any) {
      ElMessage.error(error.message || `${title}失败`);
      return false;
    }
  }

  // 删除菜单
  async function handleDelete(row: Menu) {
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

      await deleteAdminMenusId({ id: row.id! });
      ElMessage.success(`删除菜单"${row.title}"成功`);
      await loadMenuList();
    } catch (error: any) {
      if (error !== "cancel") {
        console.error("删除菜单失败:", error);
        ElMessage.error(error.message || "删除菜单失败");
      }
    }
  }

  // 表格选择变化
  function handleSelectionChange(val: Menu[]) {
    console.log("handleSelectionChange", val);
  }

  // 页面加载时获取菜单列表
  onMounted(() => {
    loadMenuList();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    curRow,
    menuTreeOptions,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange,
    getMenuTypeText,
    getMenuTypeColor
  };
}
