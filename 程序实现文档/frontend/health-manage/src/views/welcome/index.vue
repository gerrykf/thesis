<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "Welcome"
});

const userStore = useUserStoreHook();
const currentTime = ref(new Date());
const greeting = ref("");

// 更新时间和问候语
const updateTime = () => {
  currentTime.value = new Date();
  const hour = currentTime.value.getHours();
  if (hour < 6) {
    greeting.value = "夜深了，注意休息";
  } else if (hour < 12) {
    greeting.value = "早上好";
  } else if (hour < 14) {
    greeting.value = "中午好";
  } else if (hour < 18) {
    greeting.value = "下午好";
  } else {
    greeting.value = "晚上好";
  }
};

onMounted(() => {
  updateTime();
  // 每分钟更新一次时间
  setInterval(updateTime, 60000);
});

// 格式化时间显示
const formatTime = (date: Date) => {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long"
  });
};
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <div class="greeting-section">
        <h1 class="welcome-title">健康管理系统</h1>
        <p class="greeting-text">
          {{ greeting }}，{{ userStore.nickname || userStore.username }}！
        </p>
        <p class="current-time">{{ formatTime(currentTime) }}</p>
      </div>
    </div>

    <div class="welcome-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="40" color="#409EFF">
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                />
                <path
                  d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165 120.7c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.5 1.8-8.5-1.5-11.3z"
                />
              </svg>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>健康记录</h3>
            <p>记录您的日常健康数据</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="40" color="#67C23A">
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130.1 155c1.2 1.4 1.9 3.2 1.9 5.2-.1 4.4-3.6 8-8.1 8z"
                />
              </svg>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>饮食管理</h3>
            <p>科学搭配您的每日饮食</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="40" color="#E6A23C">
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792zm0-129.8L664.2 396.8c-3.2-3.8-9.1-3.8-12.3 0L424.6 666.4l-144-170.7c-3.2-3.8-9.1-3.8-12.3 0L136 652.7V232h752v430.2z"
                />
                <path
                  d="M304 456a88 88 0 1 0 0-176 88 88 0 0 0 0 176zm0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"
                />
              </svg>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>目标管理</h3>
            <p>设定并追踪健康目标</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="40" color="#F56C6C">
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
                />
                <path
                  d="M492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM340 368a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
                />
              </svg>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>数据分析</h3>
            <p>全面分析您的健康趋势</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>快速操作</h2>
        <div class="action-buttons">
          <el-button
            type="primary"
            size="large"
            @click="$router.push('/health/records')"
          >
            <el-icon><Plus /></el-icon>
            添加健康记录
          </el-button>
          <el-button
            type="success"
            size="large"
            @click="$router.push('/diet/records')"
          >
            <el-icon><Plus /></el-icon>
            记录饮食
          </el-button>
          <el-button
            type="warning"
            size="large"
            @click="$router.push('/goals')"
          >
            <el-icon><Flag /></el-icon>
            设置目标
          </el-button>
          <el-button type="info" size="large" @click="$router.push('/stats')">
            <el-icon><DataAnalysis /></el-icon>
            查看统计
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 120px);
  border-radius: 8px;
}

.welcome-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.welcome-title {
  font-size: 48px;
  font-weight: 300;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.greeting-text {
  font-size: 24px;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.current-time {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
}

.welcome-content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: #f5f7fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.quick-actions {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
  margin: 0 0 24px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 32px;
  }

  .greeting-text {
    font-size: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons .el-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
