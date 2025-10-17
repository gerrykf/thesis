<template>
  <el-dialog
    :model-value="visible"
    title="饮食记录"
    width="90%"
    :style="{ maxWidth: '1200px' }"
    :close-on-click-modal="false"
    :fullscreen="isMobile"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-table
      v-loading="loading"
      :data="records"
      stripe
      max-height="500"
      class="responsive-table"
    >
      <el-table-column prop="record_date" label="日期" min-width="120">
        <template #default="{ row }">
          {{ formatDate(row.record_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="meal_type" label="餐次" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getMealTypeTagType(row.meal_type)" size="small">
            {{ getMealTypeText(row.meal_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="food_name" label="食物名称" min-width="150">
        <template #default="{ row }">
          {{ row.food_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="portion" label="份量(g)" min-width="100">
        <template #default="{ row }">
          {{ row.portion || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="calories" label="热量(kcal)" min-width="110">
        <template #default="{ row }">
          {{ row.calories || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="protein" label="蛋白质(g)" min-width="100">
        <template #default="{ row }">
          {{ row.protein || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="fat" label="脂肪(g)" min-width="100">
        <template #default="{ row }">
          {{ row.fat || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="carbs" label="碳水(g)" min-width="100">
        <template #default="{ row }">
          {{ row.carbs || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="备注" min-width="150">
        <template #default="{ row }">
          {{ row.notes || "-" }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="$emit('page-change', $event)"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DietRecord } from "../utils/types";
import {
  formatDate,
  getMealTypeText,
  getMealTypeTagType
} from "../utils/helpers";

defineOptions({
  name: "DietRecordsDialog"
});

defineProps<{
  visible: boolean;
  loading: boolean;
  records: DietRecord[];
  total: number;
  page: number;
  pageSize: number;
}>();

defineEmits<{
  "update:visible": [value: boolean];
  "page-change": [page: number];
}>();

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 768;
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 移动端表格优化 */
@media (max-width: 768px) {
  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 8px 4px;
  }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .pagination-container :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-container :deep(.el-pagination__total) {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
