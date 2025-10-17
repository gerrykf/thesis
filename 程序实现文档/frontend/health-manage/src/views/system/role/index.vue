<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useRole } from "./utils/hooks";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { IconifyIconOffline } from "@/components/ReIcon";

import Search from "~icons/ri/search-line";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import Menu from "~icons/ep/menu";
import Close from "~icons/ep/close";
import Check from "~icons/ep/check";

import {
  delay,
  subBefore,
  deviceDetection,
  useResizeObserver
} from "@pureadmin/utils";

defineOptions({
  name: "RoleManagement"
});

const iconClass = computed(() => {
  return [
    "w-[22px]",
    "h-[22px]",
    "flex",
    "justify-center",
    "items-center",
    "outline-hidden",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-[#0000000f]",
    "dark:hover:bg-[#ffffff1f]",
    "dark:hover:text-[#ffffffd9]"
  ];
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();
const treeHeight = ref();

// 全选按钮的状态
const isSelectAll = ref(false);
const isIndeterminate = ref(false);

// 监听树的选中状态变化，更新全选按钮
const updateSelectAllState = () => {
  if (!treeRef.value || !treeData.value.length) {
    isSelectAll.value = false;
    isIndeterminate.value = false;
    return;
  }

  // 获取选中的节点（完全选中）和半选中的节点
  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();

  // 总的选中数 = 完全选中 + 半选中
  const totalCheckedCount = checkedKeys.length + halfCheckedKeys.length;
  const totalCount = treeIds.value.length;

  console.log("全选状态更新:", {
    checkedKeys: checkedKeys.length,
    halfCheckedKeys: halfCheckedKeys.length,
    totalCheckedCount,
    totalCount
  });

  if (totalCheckedCount === 0) {
    // 没有选中任何节点
    isSelectAll.value = false;
    isIndeterminate.value = false;
  } else if (totalCheckedCount === totalCount) {
    // 全部选中
    isSelectAll.value = true;
    isIndeterminate.value = false;
  } else {
    // 部分选中（半选状态）
    isSelectAll.value = false;
    isIndeterminate.value = true;
  }
};

const {
  form,
  isShow,
  curRow,
  loading,
  columns,
  rowStyle,
  dataList,
  treeData,
  treeProps,
  isEditMode,
  expandedKeys,
  pagination,
  isExpandAll,
  treeSearchValue,
  treeIds,
  onSearch,
  resetForm,
  openDialog,
  handleMenu,
  handleSave,
  handleDelete,
  filterMethod,
  onQueryChanged,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole(treeRef, updateSelectAllState);

// 处理全选按钮的点击
const handleSelectAllChange = (value: boolean) => {
  if (!treeRef.value) return;

  if (value) {
    // 全选
    treeRef.value.setCheckedKeys(treeIds.value);
  } else {
    // 全不选
    treeRef.value.setCheckedKeys([]);
  }

  // 更新半选状态
  isIndeterminate.value = false;
};

onMounted(() => {
  useResizeObserver(contentRef, async () => {
    await nextTick();
    delay(60).then(() => {
      treeHeight.value = parseFloat(
        subBefore(tableRef.value.getTableDoms().tableWrapper.style.height, "px")
      );
    });
  });
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入角色名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="角色标识：" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入角色标识"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已启用" :value="1" />
          <el-option label="已停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['flex', deviceDetection() ? 'flex-wrap' : '']"
    >
      <PureTableBar
        :class="[isShow && !deviceDetection() ? 'w-[60vw]!' : 'w-full']"
        style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
        title="角色管理（仅演示，操作后不生效）"
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增角色
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :row-style="rowStyle"
            :adaptiveConfig="{ offsetBottom: 108 }"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除角色名称为${row.name}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(Menu)"
                @click="handleMenu(row)"
              >
                权限
              </el-button>
              <!-- <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Menu)"
                      @click="handleMenu"
                    >
                      菜单权限
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Database)"
                      @click="handleDatabase"
                    >
                      数据权限
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
            </template>
          </pure-table>
        </template>
      </PureTableBar>

      <div
        v-if="isShow"
        class="min-w-[calc(100vw-60vw-268px)]! w-full mt-2 px-2 pb-2 bg-bg_color ml-2 overflow-auto"
      >
        <div class="flex justify-between w-full px-3 pt-5 pb-4">
          <div class="flex">
            <span :class="iconClass">
              <IconifyIconOffline
                v-tippy="{
                  content: '关闭'
                }"
                class="dark:text-white"
                width="18px"
                height="18px"
                :icon="Close"
                @click="handleMenu"
              />
            </span>
            <span :class="[iconClass, 'ml-2']">
              <IconifyIconOffline
                v-tippy="{
                  content: '保存菜单权限'
                }"
                class="dark:text-white"
                width="18px"
                height="18px"
                :icon="Check"
                @click="handleSave"
              />
            </span>
          </div>
          <p class="font-bold truncate">
            菜单权限
            {{ `${curRow?.name ? `（${curRow.name}）` : ""}` }}
          </p>
        </div>
        <el-input
          v-model="treeSearchValue"
          placeholder="请输入菜单进行搜索"
          class="mb-1"
          clearable
          @input="onQueryChanged"
        />
        <div class="flex flex-wrap mb-2">
          <el-checkbox
            v-model="isSelectAll"
            :indeterminate="isIndeterminate"
            label="全选"
            @change="handleSelectAllChange"
          />
          <el-checkbox v-model="isExpandAll" label="展开/折叠" />
        </div>
        <el-tree-v2
          :key="curRow?.id"
          ref="treeRef"
          show-checkbox
          :data="treeData"
          :props="treeProps"
          :height="treeHeight"
          :check-strictly="!isEditMode"
          :default-expanded-keys="expandedKeys"
          :filter-method="filterMethod"
          @check="updateSelectAllState"
        >
          <template #default="{ node }">
            <span>{{ node.label }}</span>
          </template>
        </el-tree-v2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  margin: 24px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.permission-panel {
  width: 380px;
  margin-left: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-node-label {
    display: flex;
    align-items: center;
  }
}
</style>
