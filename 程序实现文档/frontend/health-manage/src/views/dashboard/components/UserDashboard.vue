<script setup lang="ts">
import { ref, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart, GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import {
  getStatsOverview,
  getStatsWeightTrend,
  getStatsExerciseTrend,
  getStatsSleepQuality,
  getStatsNutritionAnalysis
} from "@/api/stats";
import { unwrap } from "@/utils/api";
import { ElMessage } from "element-plus";

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

defineOptions({
  name: "UserDashboard"
});

// 概览数据
const overview = ref({
  health_records_count: 0,
  diet_records_count: 0,
  avg_weight: 0,
  avg_exercise_duration: 0,
  avg_sleep_hours: 0,
  avg_daily_calories: 0
});

// 时间范围
const days = ref(30);

// 日期范围选择
const dateRange = ref<[Date, Date] | null>(null);
const useCustomDate = ref(false);

// 图表loading
const loading = ref(false);

// 图表配置
const weightTrendOption = ref({});
const exerciseTrendOption = ref({});
const sleepQualityOption = ref({});
const nutritionOption = ref({});

// 加载概览数据
const loadOverview = async () => {
  try {
    const res = await unwrap(getStatsOverview({ days: 7 }));
    if (res?.data) {
      const data = res.data;
      overview.value = {
        health_records_count: data.health_records_count || 0,
        diet_records_count: data.diet_records_count || 0,
        avg_weight: data.avg_weight || 0,
        avg_exercise_duration: data.avg_exercise_duration || 0,
        avg_sleep_hours: data.avg_sleep_hours || 0,
        avg_daily_calories: data.avg_daily_calories || 0
      };
    }
  } catch (error) {
    console.error("加载概览失败:", error);
    ElMessage.error("加载概览失败");
  }
};

// 格式化日期为 yyyy-mm-dd
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 加载体重趋势
const loadWeightTrend = async () => {
  try {
    loading.value = true;
    const res = await unwrap(getStatsWeightTrend({ days: days.value }));

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => formatDate(item.record_date || ""));
      const yData = res.data.map(item => item.weight || 0);

      weightTrendOption.value = {
        title: {
          text: "体重趋势",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}: {c} kg"
        },
        xAxis: {
          type: "category",
          data: xData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} kg"
          }
        },
        series: [
          {
            name: "体重",
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              color: "#409EFF"
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载体重趋势失败:", error);
    ElMessage.error("加载体重趋势失败");
  } finally {
    loading.value = false;
  }
};

// 加载运动趋势
const loadExerciseTrend = async () => {
  try {
    const res = await unwrap(getStatsExerciseTrend({ days: days.value }));

    if (res?.data && Array.isArray(res.data)) {
      const xData = res.data.map(item => formatDate(item.record_date || ""));
      const yData = res.data.map(item => item.exercise_duration || 0);

      exerciseTrendOption.value = {
        title: {
          text: "运动时长趋势",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}: {c} 分钟"
        },
        xAxis: {
          type: "category",
          data: xData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 分钟"
          }
        },
        series: [
          {
            name: "运动时长",
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              color: "#67C23A"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(103, 194, 58, 0.5)" },
                  { offset: 1, color: "rgba(103, 194, 58, 0.1)" }
                ]
              }
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载运动趋势失败:", error);
    ElMessage.error("加载运动趋势失败");
  }
};

// 加载睡眠质量
const loadSleepQuality = async () => {
  try {
    const res = await unwrap(getStatsSleepQuality({ days: days.value }));

    if (res?.data) {
      const data = res.data;
      if (data.sleep_trend && Array.isArray(data.sleep_trend)) {
        const xData = data.sleep_trend.map(item =>
          formatDate(item.record_date || "")
        );
        const yData = data.sleep_trend.map(item => item.sleep_hours || 0);

        sleepQualityOption.value = {
          title: {
            text: "睡眠时长趋势",
            left: "center"
          },
          tooltip: {
            trigger: "axis",
            formatter: "{b}: {c} 小时"
          },
          xAxis: {
            type: "category",
            data: xData
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value} 小时"
            },
            min: 0,
            max: 12
          },
          series: [
            {
              name: "睡眠时长",
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
    }
  } catch (error) {
    console.error("加载睡眠质量失败:", error);
    ElMessage.error("加载睡眠质量失败");
  }
};

// 加载营养分析
const loadNutritionAnalysis = async () => {
  try {
    const res = await unwrap(getStatsNutritionAnalysis({ days: days.value }));

    if (res?.data) {
      const data = res.data;
      nutritionOption.value = {
        title: {
          text: "营养摄入比例",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}g ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "营养素",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: data.total_protein || 0,
                name: "蛋白质",
                itemStyle: { color: "#409EFF" }
              },
              {
                value: data.total_fat || 0,
                name: "脂肪",
                itemStyle: { color: "#E6A23C" }
              },
              {
                value: data.total_carbs || 0,
                name: "碳水化合物",
                itemStyle: { color: "#67C23A" }
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error("加载营养分析失败:", error);
    ElMessage.error("加载营养分析失败");
  }
};

// 加载所有数据
const loadAllData = async () => {
  await Promise.all([
    loadWeightTrend(),
    loadExerciseTrend(),
    loadSleepQuality(),
    loadNutritionAnalysis()
  ]);
};

// 时间范围变化
const handleTimeRangeChange = () => {
  useCustomDate.value = false;
  dateRange.value = null;
  loadAllData();
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
    loadAllData();
  }
};

onMounted(() => {
  loadOverview();
  loadAllData();
});
</script>

<template>
  <div class="user-dashboard">
    <!-- 概览卡片 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background: #ecf5ff">
            <el-icon :size="28" color="#409EFF">
              <Notebook />
            </el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-value">
              {{ overview.health_records_count }}
            </div>
            <div class="overview-label">健康打卡</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background: #f0f9ff">
            <el-icon :size="28" color="#67C23A">
              <Food />
            </el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-value">{{ overview.diet_records_count }}</div>
            <div class="overview-label">饮食记录</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background: #fef0f0">
            <el-icon :size="28" color="#F56C6C">
              <TrophyBase />
            </el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-value">
              {{
                overview.avg_exercise_duration
                  ? overview.avg_exercise_duration.toFixed(0)
                  : 0
              }}
              <span style="font-size: 14px">分钟</span>
            </div>
            <div class="overview-label">平均运动</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background: #fdf6ec">
            <el-icon :size="28" color="#E6A23C">
              <MoonNight />
            </el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-value">
              {{
                overview.avg_sleep_hours
                  ? overview.avg_sleep_hours.toFixed(1)
                  : 0
              }}
              <span style="font-size: 14px">小时</span>
            </div>
            <div class="overview-label">平均睡眠</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 时间范围选择器 -->
    <div class="time-range-selector">
      <el-radio-group v-model="days" @change="handleTimeRangeChange">
        <el-radio-button :label="7">最近7天</el-radio-button>
        <el-radio-button :label="30">最近30天</el-radio-button>
        <el-radio-button :label="90">最近90天</el-radio-button>
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
            <v-chart :option="weightTrendOption" style="height: 350px" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="exerciseTrendOption" style="height: 350px" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="sleepQualityOption" style="height: 350px" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <v-chart :option="nutritionOption" style="height: 350px" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-dashboard {
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .overview-card {
      .overview-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .overview-icon {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .overview-info {
          flex: 1;
          min-width: 0;

          .overview-value {
            font-size: 24px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 2px;
          }

          .overview-label {
            font-size: 13px;
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

    .overview-cards {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;

      .overview-card {
        :deep(.el-card__body) {
          padding: 12px;
        }

        .overview-content {
          gap: 10px;

          .overview-icon {
            width: 44px;
            height: 44px;
            border-radius: 8px;

            .el-icon {
              font-size: 22px !important;
            }
          }

          .overview-info {
            .overview-value {
              font-size: 18px;
              margin-bottom: 1px;
            }

            .overview-label {
              font-size: 11px;
            }
          }
        }
      }
    }

    .time-range-selector {
      margin-bottom: 16px;
      padding: 0 8px;

      span {
        font-size: 13px;
      }

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
    .overview-cards {
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;

      .overview-card {
        :deep(.el-card__body) {
          padding: 10px 8px;
        }

        .overview-content {
          flex-direction: column;
          text-align: center;
          gap: 6px;

          .overview-icon {
            width: 40px;
            height: 40px;

            .el-icon {
              font-size: 20px !important;
            }
          }

          .overview-info {
            .overview-value {
              font-size: 16px;
            }

            .overview-label {
              font-size: 10px;
            }
          }
        }
      }
    }

    .time-range-selector {
      flex-direction: column;
      gap: 6px;

      span {
        font-size: 12px;
        margin-right: 0 !important;
      }

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
