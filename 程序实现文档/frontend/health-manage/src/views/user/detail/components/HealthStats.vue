<template>
  <el-card class="health-stats-card" shadow="never">
    <template #header>
      <span class="card-title">健康数据统计</span>
    </template>

    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <div class="stat-item clickable" @click="$emit('view-health-records')">
          <div class="stat-icon health">
            <el-icon :size="iconSize"><DataAnalysis /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ healthStats.totalRecords }}</h3>
            <p>健康记录</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <div class="stat-item clickable" @click="$emit('view-diet-records')">
          <div class="stat-icon diet">
            <el-icon :size="iconSize"><Food /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ healthStats.dietRecords }}</h3>
            <p>饮食记录</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <div class="stat-item clickable" @click="$emit('view-active-goals')">
          <div class="stat-icon goals">
            <el-icon :size="iconSize"><Flag /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ healthStats.activeGoals }}</h3>
            <p>活跃目标</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { DataAnalysis, Food, Flag, Calendar } from "@element-plus/icons-vue";
import type { HealthStats as HealthStatsType } from "../utils/types";

defineOptions({
  name: "HealthStats"
});

defineProps<{
  healthStats: HealthStatsType;
}>();

defineEmits<{
  "view-health-records": [];
  "view-diet-records": [];
  "view-active-goals": [];
  "view-active-days": [];
}>();

// 窗口宽度
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200
);

// 响应式图标大小
const iconSize = computed(() => {
  return windowWidth.value < 768 ? 20 : 24;
});

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.health-stats-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  color: var(--el-text-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--el-bg-color-page);
  height: 100%;
  min-height: 80px;
}

.stat-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.health {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.diet {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.goals {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.days {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-info h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color);
}

.stat-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .stat-item {
    padding: 12px;
    gap: 10px;
    min-height: 72px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-info h3 {
    font-size: 18px;
  }

  .stat-info p {
    font-size: 11px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 576px) {
  .el-col {
    margin-bottom: 10px;
  }

  .el-col:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .stat-item {
    padding: 10px;
    gap: 8px;
    min-height: 68px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .stat-info h3 {
    font-size: 16px;
  }

  .stat-info p {
    font-size: 10px;
  }
}
</style>
