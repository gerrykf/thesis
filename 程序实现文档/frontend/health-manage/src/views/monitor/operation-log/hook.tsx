import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getKeyList } from "@pureadmin/utils";
import {
  getOperationLogs,
  batchDeleteOperationLogs,
  clearAllOperationLogs
} from "@/api/monitor";
import { usePublicHooks } from "@/views/system/hooks";
import type { PaginationProps } from "@pureadmin/table";
import { type Ref, reactive, ref, onMounted, toRaw } from "vue";

export function useOperationLogs(tableRef: Ref) {
  const form = reactive({
    username: "",
    module: "",
    status: "",
    operatingTime: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const { tagStyle } = usePublicHooks();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "序号",
      type: "index",
      minWidth: 60
    },
    {
      label: "操作人员",
      prop: "username",
      minWidth: 120
    },
    {
      label: "所属模块",
      prop: "module",
      minWidth: 120
    },
    {
      label: "操作概要",
      prop: "summary",
      minWidth: 200
    },
    {
      label: "操作 IP",
      prop: "ip_address",
      minWidth: 140
    },
    {
      label: "操作地点",
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
      label: "操作状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === 1 ? "成功" : "失败"}
        </el-tag>
      )
    },
    {
      label: "操作时间",
      prop: "operating_time",
      minWidth: 180,
      formatter: ({ operating_time }) =>
        operating_time
          ? dayjs(operating_time).format("YYYY-MM-DD HH:mm:ss")
          : "-"
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
    selectedNum.value = val.length;
    tableRef.value.setAdaptive();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  async function onbatchDel() {
    try {
      const curSelected = tableRef.value.getTableRef().getSelectionRows();
      const ids = getKeyList(curSelected, "id");

      if (ids.length === 0) {
        message("请先选择要删除的数据", { type: "warning" });
        return;
      }

      await batchDeleteOperationLogs({ ids });
      message(`成功删除 ${ids.length} 条记录`, { type: "success" });
      tableRef.value.getTableRef().clearSelection();
      selectedNum.value = 0;
      onSearch();
    } catch (error) {
      console.error("批量删除操作日志失败:", error);
      message("批量删除失败", { type: "error" });
    }
  }

  async function clearAll() {
    try {
      await clearAllOperationLogs();
      message("已清空所有操作日志", { type: "success" });
      onSearch();
    } catch (error) {
      console.error("清空操作日志失败:", error);
      message("清空日志失败", { type: "error" });
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        username: form.username || undefined,
        module: form.module || undefined,
        status: form.status || undefined
      };

      // 处理日期范围
      if (
        form.operatingTime &&
        Array.isArray(form.operatingTime) &&
        form.operatingTime.length === 2
      ) {
        params.startTime = dayjs(form.operatingTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        params.endTime = dayjs(form.operatingTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      const { data } = await getOperationLogs(params);
      dataList.value = data.list || [];
      pagination.total = data.total || 0;
    } catch (error) {
      console.error("获取操作日志列表失败:", error);
      message("获取操作日志列表失败", { type: "error" });
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
    selectedNum,
    onSearch,
    clearAll,
    resetForm,
    onbatchDel,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
