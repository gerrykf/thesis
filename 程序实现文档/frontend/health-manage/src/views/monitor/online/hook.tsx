import dayjs from "dayjs";
import { message } from "@/utils/message";
import { unwrap } from "@/utils/api";
import { getOnlineUsers, forceOfflineUser } from "@/api/monitor";
import { reactive, ref, onMounted, toRaw } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useOnlineUsers() {
  const form = reactive({
    username: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      minWidth: 60
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 120
    },
    {
      label: "登录 IP",
      prop: "ip",
      minWidth: 140
    },
    {
      label: "登录地点",
      prop: "address",
      minWidth: 140
    },
    {
      label: "操作系统",
      prop: "system",
      minWidth: 120
    },
    {
      label: "浏览器类型",
      prop: "browser",
      minWidth: 140
    },
    {
      label: "登录时间",
      prop: "login_time",
      minWidth: 180,
      formatter: ({ login_time }) =>
        login_time ? dayjs(login_time).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 100,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function handleOffline(row) {
    try {
      await forceOfflineUser(row.id);
      message(`${row.username}已被强制下线`, { type: "success" });
      onSearch();
    } catch (error) {
      console.error("强制下线失败:", error);
      message("强制下线失败", { type: "error" });
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...toRaw(form)
      };
      const response = await unwrap(getOnlineUsers(params));
      dataList.value = response.data?.list || [];
      pagination.total = response.data?.total || 0;
    } catch (error) {
      console.error("获取在线用户列表失败:", error);
      message("获取在线用户列表失败", { type: "error" });
      dataList.value = [];
      pagination.total = 0;
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleOffline,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
