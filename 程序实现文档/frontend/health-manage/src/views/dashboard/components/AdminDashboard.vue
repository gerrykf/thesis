<script setup lang="ts">
import { ref, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import {
  getAdminStatsSystem,
  getAdminStatsUserRegistrationTrend,
  getAdminStatsUserActiveTrend,
  getAdminStatsHealthCheckinRate,
  getAdminStatsDietCheckinRate
} from "@/api/admin";
import { unwrap } from "@/utils/api";
import { ElMessage } from "element-plus";
import { User, Avatar, Notebook, Food } from "@element-plus/icons-vue";

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

defineOptions({
  name: "AdminDashboard"
});

// 系统统计数据
const systemStats = ref({
  total_users: 0,
  active_users: 0,
  total_health_records: 0,
  total_diet_records: 0,
  total_foods: 0
});

// 时间范围选择
const timeRange = ref<"day" | "week" | "month" | "quarter" | "year">("day");
const days = ref(30);

// 日期范围选择
const dateRange = ref<[Date, Date] | null>(null);
const useCustomDate = ref(false);

// 图表loading
const loading = ref(false);

// 用户注册趋势数据
const registrationTrendOption = ref({});
const activeTrendOption = ref({});
const healthCheckinOption = ref({});
const dietCheckinOption = ref({});

// 加载系统统计
const loadSystemStats = async () => {
  try {
    const res = await unwrap(getAdminStatsSystem());
    if (res?.data) {
      const data = res.data;
      systemStats.value = {
        total_users: data.total_users || 0,
        active_users: data.active_users || 0,
        total_health_records: data.total_health_records || 0,
        total_diet_records: data.total_diet_records || 0,
        total_foods: data.total_foods || 0
      };
    }
  } catch (error) {
    console.error("加载系统统计失败:", error);
    ElMessage.error("加载系统统计失败");
  }
};

// 加载用户注册趋势
const loadRegistrationTrend = async () => {
  try {
    loading.value = true;
    const res = await unwrap(
      getAdminStatsUserRegistrationTrend({
        days: days.value,
        period: timeRange.value
      })
    );

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => item.period || "");
      const yData = res.data.map(item => item.count || 0);

      registrationTrendOption.value = {
        title: {
          text: "用户注册趋势",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "注册用户数",
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              color: "#409EFF"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(64, 158, 255, 0.5)" },
                  { offset: 1, color: "rgba(64, 158, 255, 0.1)" }
                ]
              }
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载注册趋势失败:", error);
    ElMessage.error("加载注册趋势失败");
  } finally {
    loading.value = false;
  }
};

// 加载用户活跃趋势
const loadActiveTrend = async () => {
  try {
    const res = await unwrap(
      getAdminStatsUserActiveTrend({
        days: days.value,
        period: timeRange.value
      })
    );

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => item.period || "");
      const yData = res.data.map(item => item.count || 0);

      activeTrendOption.value = {
        title: {
          text: "用户活跃趋势",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "活跃用户数",
            type: "bar",
            data: yData,
            itemStyle: {
              color: "#67C23A"
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载活跃趋势失败:", error);
    ElMessage.error("加载活跃趋势失败");
  }
};

// 加载健康打卡率
const loadHealthCheckinRate = async () => {
  try {
    const res = await unwrap(
      getAdminStatsHealthCheckinRate({
        days: days.value,
        period: timeRange.value
      })
    );

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => item.period || "");
      const yData = res.data.map(item => item.checkin_rate || 0);
      const checkinUsers = res.data.map(item => item.checkin_users || 0);
      const totalUsers = res.data.map(item => item.total_users || 0);

      healthCheckinOption.value = {
        title: {
          text: "健康打卡率",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const dataIndex = params[0].dataIndex;
            return `${params[0].axisValue}<br/>打卡率: ${params[0].value}%<br/>打卡用户: ${checkinUsers[dataIndex]}/${totalUsers[dataIndex]}`;
          }
        },
        xAxis: {
          type: "category",
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          }
        },
        series: [
          {
            name: "打卡率",
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              color: "#E6A23C"
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载健康打卡率失败:", error);
    ElMessage.error("加载健康打卡率失败");
  }
};

// 加载饮食打卡率
const loadDietCheckinRate = async () => {
  try {
    const res = await unwrap(
      getAdminStatsDietCheckinRate({
        days: days.value,
        period: timeRange.value
      })
    );

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => item.period || "");
      const yData = res.data.map(item => item.checkin_rate || 0);
      const checkinUsers = res.data.map(item => item.checkin_users || 0);
      const totalUsers = res.data.map(item => item.total_users || 0);

      dietCheckinOption.value = {
        title: {
          text: "饮食打卡率",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const dataIndex = params[0].dataIndex;
            return `${params[0].axisValue}<br/>打卡率: ${params[0].value}%<br/>打卡用户: ${checkinUsers[dataIndex]}/${totalUsers[dataIndex]}`;
          }
        },
        xAxis: {
          type: "category",
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          }
        },
        series: [
          {
            name: "打卡率",
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              color: "#F56C6C"
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载饮食打卡率失败:", error);
    ElMessage.error("加载饮食打卡率失败");
  }
};

// 加载所有趋势数据
const loadAllTrends = async () => {
  await Promise.all([
    loadRegistrationTrend(),
    loadActiveTrend(),
    loadHealthCheckinRate(),
    loadDietCheckinRate()
  ]);
};

// 时间范围变化
const handleTimeRangeChange = () => {
  useCustomDate.value = false;
  dateRange.value = null;
  // 根据时间维度调整天数
  if (timeRange.value === "day") {
    days.value = 30;
  } else if (timeRange.value === "week") {
    days.value = 84; // 12周
  } else if (timeRange.value === "month") {
    days.value = 365; // 12个月
  } else if (timeRange.value === "quarter") {
    days.value = 365 * 2; // 8个季度
  } else if (timeRange.value === "year") {
    days.value = 365 * 5; // 5年
  }
  loadAllTrends();
};

// 查询自定义日期范围
const handleCustomDateQuery = () => {
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    // 计算日期差
    const date1 = new Date(dateRange.value[0]);
    const date2 = new Date(dateRange.value[1]);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    days.value = diffDays;
    loadAllTrends();
  }
};

onMounted(() => {
  loadSystemStats();
  loadAllTrends();
});
</script>

<template>
  <div class="admin-dashboard">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #ecf5ff">
            <el-icon :size="32" color="#409EFF">
              <User />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ systemStats.total_users }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #f0f9ff">
            <el-icon :size="32" color="#67C23A">
              <Avatar />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ systemStats.active_users }}</div>
            <div class="stat-label">活跃用户</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #fef0f0">
            <el-icon :size="32" color="#F56C6C">
              <Notebook />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ systemStats.total_health_records }}</div>
            <div class="stat-label">健康记录</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #fdf6ec">
            <el-icon :size="32" color="#E6A23C">
              <Food />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ systemStats.total_diet_records }}</div>
            <div class="stat-label">饮食记录</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 时间维度选择器 -->
    <div class="time-range-selector">
      <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
        <el-radio-button label="day">按日</el-radio-button>
        <el-radio-button label="week">按周</el-radio-button>
        <el-radio-button label="month">按月</el-radio-button>
        <el-radio-button label="quarter">按季度</el-radio-button>
        <el-radio-button label="year">按年</el-radio-button>
      </el-radio-group>
      <div class="date-query-group">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="default"
        />
        <el-button type="primary" size="default" @click="handleCustomDateQuery">
          查询
        </el-button>
      </div>
    </div>

    <!-- 图表区域 -->
    <div v-loading="loading" class="charts-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="registrationTrendOption" style="height: 350px" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="activeTrendOption" style="height: 350px" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="healthCheckinOption" style="height: 350px" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="dietCheckinOption" style="height: 350px" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-dashboard {
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;

          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .time-range-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
    padding: 0 16px;
    max-width: 100%;
    overflow: hidden;

    .date-query-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
    }

    :deep(.el-date-editor) {
      width: 240px !important;
      flex-shrink: 0;
    }

    :deep(.el-range-separator) {
      padding: 0 2px;
      width: 20px;
    }

    :deep(.el-range-input) {
      font-size: 12px;
      width: 85px;
    }
  }

  .charts-container {
    min-height: 400px;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 0;

    .stats-cards {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 20px;

      .stat-card {
        :deep(.el-card__body) {
          padding: 12px;
        }

        .stat-content {
          gap: 10px;

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;

            .el-icon {
              font-size: 24px !important;
            }
          }

          .stat-info {
            .stat-value {
              font-size: 20px;
              margin-bottom: 2px;
            }

            .stat-label {
              font-size: 12px;
            }
          }
        }
      }
    }

    .time-range-selector {
      margin-bottom: 16px;
      padding: 0 8px;

      :deep(.el-radio-group) {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      :deep(.el-radio-button) {
        flex: 0 0 auto;
      }

      :deep(.el-radio-button__inner) {
        padding: 8px 12px;
        font-size: 13px;
      }

      :deep(.el-date-editor) {
        width: 200px !important;
      }

      :deep(.el-range-input) {
        font-size: 11px;
        width: 75px;
      }
    }

    .charts-container {
      min-height: 300px;

      :deep(.el-row) {
        margin: 0 !important;
      }

      :deep(.el-col) {
        padding: 0 4px !important;
        margin-bottom: 12px;
      }

      :deep(.el-card) {
        margin-bottom: 0;
      }

      :deep(.el-card__body) {
        padding: 12px 8px;
      }

      // 图表容器高度调整
      :deep(.echarts) {
        height: 280px !important;
      }
    }
  }

  // 小屏手机适配（宽度 < 480px）
  @media (max-width: 480px) {
    .stats-cards {
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;

      .stat-card {
        :deep(.el-card__body) {
          padding: 10px 8px;
        }

        .stat-content {
          flex-direction: column;
          text-align: center;
          gap: 8px;

          .stat-icon {
            width: 44px;
            height: 44px;
          }

          .stat-info {
            .stat-value {
              font-size: 18px;
            }

            .stat-label {
              font-size: 11px;
            }
          }
        }
      }
    }

    .time-range-selector {
      :deep(.el-radio-button__inner) {
        padding: 6px 10px;
        font-size: 12px;
      }

      :deep(.el-date-editor) {
        width: 200px !important;
      }

      :deep(.el-range-input) {
        font-size: 10px;
        width: 70px;
      }

      :deep(.el-button) {
        font-size: 12px;
        padding: 8px 12px;
      }
    }

    .charts-container {
      :deep(.el-col) {
        width: 100% !important;
        max-width: 100% !important;
      }

      :deep(.echarts) {
        height: 240px !important;
      }
    }
  }
}
</style>
