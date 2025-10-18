<template>
  <el-dialog
    :model-value="visible"
    title="饮食记录"
    width="90%"
    :style="{ maxWidth: '1400px' }"
    :close-on-click-modal="false"
    :fullscreen="isMobile"
    @update:model-value="$emit('update:visible', $event)"
  >
    <!-- 日期查询区域 -->
    <div class="date-query-container">
      <el-date-picker
        v-model="localDateRange"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :shortcuts="shortcuts"
        size="default"
        clearable
      />
      <el-button type="primary" size="default" @click="handleQuery">
        查询
      </el-button>
      <el-button size="default" @click="handleReset"> 重置 </el-button>
    </div>

    <div v-loading="loading" class="diet-records-container">
      <!-- 无数据提示 -->
      <el-empty
        v-if="!loading && groupedRecords.length === 0"
        description="暂无饮食记录"
      />

      <!-- 按日期分组的卡片 -->
      <div v-else class="records-grid">
        <el-card
          v-for="dayGroup in groupedRecords"
          :key="dayGroup.date"
          class="day-card"
          shadow="hover"
        >
          <!-- 卡片头部 - 日期 -->
          <template #header>
            <div class="card-header">
              <div class="date-info">
                <span class="date-main">{{
                  formatDateDisplay(dayGroup.date)
                }}</span>
                <span class="date-sub">{{ getWeekday(dayGroup.date) }}</span>
              </div>
              <div class="summary-info">
                <el-tag type="primary" size="small">
                  {{ dayGroup.totalMeals }} 餐
                </el-tag>
                <el-tag type="danger" size="small">
                  {{ dayGroup.totalCalories.toFixed(0) }} kcal
                </el-tag>
              </div>
            </div>
          </template>

          <!-- 卡片内容 - 按餐次分组 -->
          <div class="meals-container">
            <!-- 早餐 -->
            <div v-if="dayGroup.breakfast.length > 0" class="meal-section">
              <div class="meal-header">
                <el-icon class="meal-icon"><Sunrise /></el-icon>
                <span class="meal-title">早餐</span>
                <span class="meal-calories"
                  >{{ getMealCalories(dayGroup.breakfast) }} kcal</span
                >
              </div>
              <div class="food-list">
                <div
                  v-for="food in dayGroup.breakfast"
                  :key="food.id"
                  class="food-item"
                >
                  <div class="food-main">
                    <span class="food-name">{{
                      food.food_name || "未知食物"
                    }}</span>
                    <span class="food-quantity">{{ food.quantity }}g</span>
                  </div>
                  <div class="food-nutrition">
                    <span class="nutrition-item">
                      <span class="nutrition-label">热量</span>
                      <span class="nutrition-value">{{ food.calories }}</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">蛋白</span>
                      <span class="nutrition-value">{{ food.protein }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">脂肪</span>
                      <span class="nutrition-value">{{ food.fat }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">碳水</span>
                      <span class="nutrition-value">{{ food.carbs }}g</span>
                    </span>
                  </div>
                  <div v-if="food.notes" class="food-notes">
                    <el-icon><Document /></el-icon>
                    <span>{{ food.notes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 午餐 -->
            <div v-if="dayGroup.lunch.length > 0" class="meal-section">
              <div class="meal-header">
                <el-icon class="meal-icon"><Sunny /></el-icon>
                <span class="meal-title">午餐</span>
                <span class="meal-calories"
                  >{{ getMealCalories(dayGroup.lunch) }} kcal</span
                >
              </div>
              <div class="food-list">
                <div
                  v-for="food in dayGroup.lunch"
                  :key="food.id"
                  class="food-item"
                >
                  <div class="food-main">
                    <span class="food-name">{{
                      food.food_name || "未知食物"
                    }}</span>
                    <span class="food-quantity">{{ food.quantity }}g</span>
                  </div>
                  <div class="food-nutrition">
                    <span class="nutrition-item">
                      <span class="nutrition-label">热量</span>
                      <span class="nutrition-value">{{ food.calories }}</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">蛋白</span>
                      <span class="nutrition-value">{{ food.protein }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">脂肪</span>
                      <span class="nutrition-value">{{ food.fat }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">碳水</span>
                      <span class="nutrition-value">{{ food.carbs }}g</span>
                    </span>
                  </div>
                  <div v-if="food.notes" class="food-notes">
                    <el-icon><Document /></el-icon>
                    <span>{{ food.notes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 晚餐 -->
            <div v-if="dayGroup.dinner.length > 0" class="meal-section">
              <div class="meal-header">
                <el-icon class="meal-icon"><Moon /></el-icon>
                <span class="meal-title">晚餐</span>
                <span class="meal-calories"
                  >{{ getMealCalories(dayGroup.dinner) }} kcal</span
                >
              </div>
              <div class="food-list">
                <div
                  v-for="food in dayGroup.dinner"
                  :key="food.id"
                  class="food-item"
                >
                  <div class="food-main">
                    <span class="food-name">{{
                      food.food_name || "未知食物"
                    }}</span>
                    <span class="food-quantity">{{ food.quantity }}g</span>
                  </div>
                  <div class="food-nutrition">
                    <span class="nutrition-item">
                      <span class="nutrition-label">热量</span>
                      <span class="nutrition-value">{{ food.calories }}</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">蛋白</span>
                      <span class="nutrition-value">{{ food.protein }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">脂肪</span>
                      <span class="nutrition-value">{{ food.fat }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">碳水</span>
                      <span class="nutrition-value">{{ food.carbs }}g</span>
                    </span>
                  </div>
                  <div v-if="food.notes" class="food-notes">
                    <el-icon><Document /></el-icon>
                    <span>{{ food.notes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加餐 -->
            <div v-if="dayGroup.snack.length > 0" class="meal-section">
              <div class="meal-header">
                <el-icon class="meal-icon"><Apple /></el-icon>
                <span class="meal-title">加餐</span>
                <span class="meal-calories"
                  >{{ getMealCalories(dayGroup.snack) }} kcal</span
                >
              </div>
              <div class="food-list">
                <div
                  v-for="food in dayGroup.snack"
                  :key="food.id"
                  class="food-item"
                >
                  <div class="food-main">
                    <span class="food-name">{{
                      food.food_name || "未知食物"
                    }}</span>
                    <span class="food-quantity">{{ food.quantity }}g</span>
                  </div>
                  <div class="food-nutrition">
                    <span class="nutrition-item">
                      <span class="nutrition-label">热量</span>
                      <span class="nutrition-value">{{ food.calories }}</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">蛋白</span>
                      <span class="nutrition-value">{{ food.protein }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">脂肪</span>
                      <span class="nutrition-value">{{ food.fat }}g</span>
                    </span>
                    <span class="nutrition-item">
                      <span class="nutrition-label">碳水</span>
                      <span class="nutrition-value">{{ food.carbs }}g</span>
                    </span>
                  </div>
                  <div v-if="food.notes" class="food-notes">
                    <el-icon><Document /></el-icon>
                    <span>{{ food.notes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 卡片底部 - 当天营养汇总 -->
          <div class="day-summary">
            <div class="summary-item">
              <span class="summary-label">总蛋白</span>
              <span class="summary-value"
                >{{ dayGroup.totalProtein.toFixed(1) }}g</span
              >
            </div>
            <div class="summary-item">
              <span class="summary-label">总脂肪</span>
              <span class="summary-value"
                >{{ dayGroup.totalFat.toFixed(1) }}g</span
              >
            </div>
            <div class="summary-item">
              <span class="summary-label">总碳水</span>
              <span class="summary-value"
                >{{ dayGroup.totalCarbs.toFixed(1) }}g</span
              >
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { computed } from "vue";
import { Sunrise, Sunny, Moon, Apple, Document } from "@element-plus/icons-vue";
import type { DietRecord } from "../utils/types";

defineOptions({
  name: "DietRecordsDialog"
});

const props = defineProps<{
  visible: boolean;
  loading: boolean;
  records: DietRecord[];
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "date-query": [startDate: string | null, endDate: string | null];
}>();

// 获取本周的日期范围
const getThisWeek = () => {
  const end = new Date();
  const start = new Date();
  const day = start.getDay();
  const diff = day === 0 ? 6 : day - 1; // 周一为起始
  start.setTime(start.getTime() - 3600 * 1000 * 24 * diff);

  // 格式化为 YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return [formatDate(start), formatDate(end)] as [string, string];
};

// 日期范围 - 默认为本周
const localDateRange = ref<[string, string] | null>(getThisWeek());

// 监听对话框打开，自动触发查询
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      // 对话框打开时，如果有默认日期范围，自动触发查询
      if (
        localDateRange.value &&
        localDateRange.value[0] &&
        localDateRange.value[1]
      ) {
        emit("date-query", localDateRange.value[0], localDateRange.value[1]);
      }
    }
  }
);

// 快捷选项
const shortcuts = [
  {
    text: "本周",
    value: () => {
      const end = new Date();
      const start = new Date();
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1; // 周一为起始
      start.setTime(start.getTime() - 3600 * 1000 * 24 * diff);
      return [start, end];
    }
  },
  {
    text: "近7天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "本月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(1);
      return [start, end];
    }
  },
  {
    text: "近30天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  }
];

// 查询
const handleQuery = () => {
  if (
    localDateRange.value &&
    localDateRange.value[0] &&
    localDateRange.value[1]
  ) {
    emit("date-query", localDateRange.value[0], localDateRange.value[1]);
  }
};

// 重置
const handleReset = () => {
  localDateRange.value = null;
  emit("date-query", null, null);
};

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 768;
});

// 按日期分组记录
interface DayGroup {
  date: string;
  breakfast: DietRecord[];
  lunch: DietRecord[];
  dinner: DietRecord[];
  snack: DietRecord[];
  totalMeals: number;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

const groupedRecords = computed(() => {
  const groups = new Map<string, DayGroup>();

  props.records.forEach(record => {
    const date = formatDate(record.record_date);

    if (!groups.has(date)) {
      groups.set(date, {
        date,
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        totalMeals: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0
      });
    }

    const group = groups.get(date)!;

    // 按餐次分类
    switch (record.meal_type) {
      case "breakfast":
        group.breakfast.push(record);
        break;
      case "lunch":
        group.lunch.push(record);
        break;
      case "dinner":
        group.dinner.push(record);
        break;
      case "snack":
        group.snack.push(record);
        break;
    }

    // 累计总计
    group.totalMeals++;
    group.totalCalories += Number(record.calories) || 0;
    group.totalProtein += Number(record.protein) || 0;
    group.totalFat += Number(record.fat) || 0;
    group.totalCarbs += Number(record.carbs) || 0;
  });

  return Array.from(groups.values());
});

// 格式化日期 (YYYY-MM-DD)
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 格式化日期显示 (M月D日)
const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 获取星期几
const getWeekday = (dateStr: string): string => {
  const date = new Date(dateStr);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekdays[date.getDay()];
};

// 计算餐次总热量
const getMealCalories = (meals: DietRecord[]): string => {
  const total = meals.reduce(
    (sum, meal) => sum + (Number(meal.calories) || 0),
    0
  );
  return total.toFixed(0);
};
</script>

<style scoped>
.date-query-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto 20px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  max-width: 800px;
}

.date-query-container :deep(.el-date-editor) {
  max-width: 360px;
}

.diet-records-container {
  min-height: 300px;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.day-card {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-main {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.date-sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.summary-info {
  display: flex;
  gap: 8px;
}

.meals-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-section {
  border-left: 3px solid var(--el-color-primary);
  padding-left: 12px;
}

.meal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.meal-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.meal-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.meal-calories {
  margin-left: auto;
  font-size: 13px;
  color: var(--el-color-danger);
  font-weight: 500;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.food-item {
  background: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.food-item:hover {
  background: var(--el-fill-color);
  transform: translateX(4px);
}

.food-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.food-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.food-quantity {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  background: var(--el-color-primary-light-9);
  padding: 2px 8px;
  border-radius: 4px;
}

.food-nutrition {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 6px;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.nutrition-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.nutrition-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.food-notes {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--el-border-color-lighter);
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.food-notes .el-icon {
  font-size: 14px;
}

.day-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

/* 平板适配 (768px - 1024px) */
@media (max-width: 1024px) {
  .date-query-container {
    max-width: 680px;
  }

  .date-query-container :deep(.el-date-editor) {
    max-width: 300px;
  }

  .records-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 移动端适配 (小于768px) */
@media (max-width: 768px) {
  .date-query-container {
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    max-width: 100%;
  }

  .date-query-container :deep(.el-date-editor) {
    width: 100% !important;
    max-width: 100% !important;
  }

  .date-query-container .el-button {
    width: 100%;
  }

  .records-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .date-main {
    font-size: 16px;
  }

  .meal-header {
    gap: 6px;
  }

  .meal-title {
    font-size: 14px;
  }

  .meal-calories {
    font-size: 12px;
  }

  .food-item {
    padding: 10px;
  }

  .food-nutrition {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .day-summary {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .summary-value {
    font-size: 14px;
  }
}

/* 小屏幕移动端 (小于480px) */
@media (max-width: 480px) {
  .date-query-container {
    padding: 10px;
    gap: 8px;
    max-width: 100%;
  }

  .records-grid {
    gap: 10px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .date-main {
    font-size: 15px;
  }

  .summary-info {
    width: 100%;
    justify-content: flex-start;
  }

  .meal-section {
    padding-left: 8px;
  }

  .food-item {
    padding: 8px;
  }

  .food-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .food-nutrition {
    grid-template-columns: repeat(2, 1fr);
  }

  .nutrition-label {
    font-size: 10px;
  }

  .nutrition-value {
    font-size: 12px;
  }

  .day-summary {
    gap: 6px;
  }

  .summary-label {
    font-size: 11px;
  }

  .summary-value {
    font-size: 13px;
  }
}

/* 超小屏幕 (小于375px) */
@media (max-width: 375px) {
  .food-nutrition {
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .day-summary {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .summary-item {
    flex-direction: row;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
  }
}

.el-button + .el-button {
  margin-left: 0;
}
</style>
