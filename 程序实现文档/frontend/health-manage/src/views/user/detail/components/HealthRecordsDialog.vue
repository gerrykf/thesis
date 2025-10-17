<template>
  <el-dialog
    :model-value="visible"
    title="全部健康记录"
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
      <el-table-column prop="weight" label="体重(kg)" min-width="100">
        <template #default="{ row }">
          {{ row.weight || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="exercise_duration"
        label="运动时长(分钟)"
        min-width="130"
      >
        <template #default="{ row }">
          {{ row.exercise_duration || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="exercise_type" label="运动类型" min-width="120">
        <template #default="{ row }">
          {{ row.exercise_type || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sleep_hours"
        label="睡眠时长(小时)"
        min-width="130"
      >
        <template #default="{ row }">
          {{ row.sleep_hours || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="sleep_quality" label="睡眠质量" min-width="120">
        <template #default="{ row }">
          <el-tag
            v-if="row.sleep_quality"
            :type="getSleepQualityType(row.sleep_quality)"
            size="small"
          >
            {{ getSleepQualityText(row.sleep_quality) }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="mood" label="心情" min-width="100">
        <template #default="{ row }">
          <el-tag v-if="row.mood" :type="getMoodType(row.mood)" size="small">
            {{ getMoodText(row.mood) }}
          </el-tag>
          <span v-else>-</span>
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
import type { HealthRecord } from "../utils/types";
import {
  formatDate,
  getSleepQualityType,
  getSleepQualityText,
  getMoodType,
  getMoodText
} from "../utils/helpers";

defineOptions({
  name: "HealthRecordsDialog"
});

defineProps<{
  visible: boolean;
  loading: boolean;
  records: HealthRecord[];
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
