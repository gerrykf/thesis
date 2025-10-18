<template>
  <el-dialog
    :model-value="visible"
    title="活跃目标"
    width="90%"
    :style="{ maxWidth: '1200px' }"
    :close-on-click-modal="false"
    :fullscreen="isMobile"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div v-loading="loading" class="goals-container">
      <!-- 无数据提示 -->
      <el-empty v-if="!loading && goals.length === 0" description="暂无活跃目标" />

      <!-- 目标卡片网格 -->
      <div v-else class="goals-grid">
        <el-card
          v-for="goal in goals"
          :key="goal.id"
          class="goal-card"
          :class="`goal-${goal.goal_type}`"
          shadow="hover"
        >
          <!-- 卡片头部 -->
          <template #header>
            <div class="card-header">
              <div class="goal-title">
                <el-icon class="goal-icon" :size="24">
                  <component :is="getGoalIcon(goal.goal_type)" />
                </el-icon>
                <div class="title-info">
                  <span class="goal-name">{{ goal.goal_name }}</span>
                  <el-tag :type="getStatusType(goal.status)" size="small">
                    {{ getStatusText(goal.status) }}
                  </el-tag>
                </div>
              </div>
              <el-tag :type="getTypeColor(goal.goal_type)" size="small">
                {{ getTypeText(goal.goal_type) }}
              </el-tag>
            </div>
          </template>

          <!-- 卡片内容 -->
          <div class="goal-content">
            <!-- 进度显示 -->
            <div class="progress-section">
              <div class="progress-info">
                <span class="current-value">
                  {{ formatValue(goal.current_value) }}
                  <span class="unit">{{ goal.unit || '' }}</span>
                </span>
                <span class="separator">/</span>
                <span class="target-value">
                  {{ formatValue(goal.target_value) }}
                  <span class="unit">{{ goal.unit || '' }}</span>
                </span>
              </div>
              <el-progress
                :percentage="calculateProgress(goal.current_value, goal.target_value)"
                :color="getProgressColor(goal.goal_type)"
                :stroke-width="12"
              />
            </div>

            <!-- 日期信息 -->
            <div class="date-info">
              <div class="date-item">
                <el-icon><Calendar /></el-icon>
                <span class="date-label">开始日期：</span>
                <span class="date-value">{{ formatDate(goal.start_date) }}</span>
              </div>
              <div v-if="goal.target_date" class="date-item">
                <el-icon><Calendar /></el-icon>
                <span class="date-label">目标日期：</span>
                <span class="date-value">{{ formatDate(goal.target_date) }}</span>
              </div>
            </div>

            <!-- 描述 -->
            <div v-if="goal.description" class="description">
              <el-icon><Document /></el-icon>
              <span>{{ goal.description }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  TrophyBase,
  Odometer,
  Food,
  Star,
  Calendar,
  Document
} from "@element-plus/icons-vue";

defineOptions({
  name: "ActiveGoalsDialog"
});

const props = defineProps<{
  visible: boolean;
  loading: boolean;
  goals: API.UserGoal[];
}>();

defineEmits<{
  "update:visible": [value: boolean];
}>();

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 768;
});

// 获取目标类型图标
const getGoalIcon = (type?: string) => {
  const icons: Record<string, any> = {
    weight: Odometer,
    exercise: TrophyBase,
    calories: Food,
    custom: Star
  };
  return icons[type || 'custom'] || Star;
};

// 获取目标类型文本
const getTypeText = (type?: string) => {
  const types: Record<string, string> = {
    weight: "体重目标",
    exercise: "运动目标",
    calories: "热量目标",
    custom: "自定义目标"
  };
  return types[type || 'custom'] || "自定义目标";
};

// 获取目标类型颜色
const getTypeColor = (type?: string) => {
  const colors: Record<string, any> = {
    weight: "primary",
    exercise: "success",
    calories: "warning",
    custom: "info"
  };
  return colors[type || 'custom'] || "info";
};

// 获取状态文本
const getStatusText = (status?: string) => {
  const statuses: Record<string, string> = {
    active: "进行中",
    completed: "已完成",
    paused: "已暂停",
    cancelled: "已取消"
  };
  return statuses[status || 'active'] || "进行中";
};

// 获取状态类型
const getStatusType = (status?: string) => {
  const types: Record<string, any> = {
    active: "success",
    completed: "info",
    paused: "warning",
    cancelled: "danger"
  };
  return types[status || 'active'] || "success";
};

// 获取进度条颜色
const getProgressColor = (type?: string) => {
  const colors: Record<string, string> = {
    weight: "#409EFF",
    exercise: "#67C23A",
    calories: "#E6A23C",
    custom: "#909399"
  };
  return colors[type || 'custom'] || "#909399";
};

// 计算进度百分比
const calculateProgress = (current?: number, target?: number): number => {
  if (!current || !target || target === 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.round(percentage), 100);
};

// 格式化数值
const formatValue = (value?: number): string => {
  if (value === undefined || value === null) return "0";
  return Number(value).toFixed(1);
};

// 格式化日期
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.goals-container {
  min-height: 300px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.goal-card {
  height: fit-content;
  transition: all 0.3s;
}

.goal-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.goal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.goal-icon {
  flex-shrink: 0;
}

.title-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.goal-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.current-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.separator {
  font-size: 24px;
  color: var(--el-text-color-secondary);
}

.target-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.unit {
  font-size: 14px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.date-item .el-icon {
  color: var(--el-color-primary);
}

.date-label {
  color: var(--el-text-color-secondary);
}

.date-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.description {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.description .el-icon {
  margin-top: 2px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

/* 目标类型特定样式 */
.goal-weight .goal-icon {
  color: #409EFF;
}

.goal-exercise .goal-icon {
  color: #67C23A;
}

.goal-calories .goal-icon {
  color: #E6A23C;
}

.goal-custom .goal-icon {
  color: #909399;
}

/* 平板适配 */
@media (max-width: 1024px) {
  .goals-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .goal-name {
    font-size: 15px;
  }

  .current-value {
    font-size: 28px;
  }

  .target-value {
    font-size: 20px;
  }

  .separator {
    font-size: 20px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 480px) {
  .goals-grid {
    gap: 10px;
  }

  .goal-content {
    gap: 12px;
  }

  .current-value {
    font-size: 24px;
  }

  .target-value {
    font-size: 18px;
  }

  .date-info,
  .description {
    padding: 10px;
  }
}
</style>
