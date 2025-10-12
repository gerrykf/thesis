<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ t("ying-yang-she-ru-fen-xi") }}</h3>
    </div>
    <div class="chart-container">
      <v-chart v-if="hasData" :option="chartOption" :autoresize="true" />
      <van-empty v-else :description="t('common.noData')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 注册必需的组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

interface NutritionData {
  record_date: string;
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;
}

const props = defineProps<{
  data: NutritionData[];
}>();

const hasData = computed(() => props.data && props.data.length > 0);

const chartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    formatter: (params: any) => {
      let result = `${params[0].axisValue}<br/>`;
      params.forEach((item: any) => {
        result += `${item.marker}${item.seriesName}: ${item.value}${
          item.seriesName === "热量" ? " kcal" : "g"
        }<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: [
      t("re-liang-0"),
      t("dan-bai-zhi-0"),
      t("zhi-fang-0"),
      t("tan-shui-0"),
    ],
    bottom: 0,
    textStyle: {
      fontSize: 10,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    top: "10%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: props.data.map((item) => {
      const date = new Date(item.record_date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    axisLabel: {
      fontSize: 10,
    },
  },
  yAxis: [
    {
      type: "value",
      name: t("re-liang-kcal"),
      nameTextStyle: {
        fontSize: 10,
      },
      position: "left",
      axisLabel: {
        fontSize: 10,
      },
    },
    {
      type: "value",
      name: t("ying-yang-su-g"),
      nameTextStyle: {
        fontSize: 10,
      },
      position: "right",
      axisLabel: {
        fontSize: 10,
      },
    },
  ],
  series: [
    {
      name: t("re-liang-1"),
      type: "line",
      yAxisIndex: 0,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: "#ee0a24",
      },
      lineStyle: {
        width: 2,
      },
      data: props.data.map((item) => Math.round(item.total_calories || 0)),
    },
    {
      name: t("dan-bai-zhi-1"),
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: "#07c160",
      },
      lineStyle: {
        width: 2,
      },
      data: props.data.map((item) => Math.round(item.total_protein || 0)),
    },
    {
      name: t("zhi-fang-1"),
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: "#ff976a",
      },
      lineStyle: {
        width: 2,
      },
      data: props.data.map((item) => Math.round(item.total_fat || 0)),
    },
    {
      name: t("tan-shui-1"),
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: "#1989fa",
      },
      lineStyle: {
        width: 2,
      },
      data: props.data.map((item) => Math.round(item.total_carbs || 0)),
    },
  ],
}));
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.chart-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-lg;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .chart-header {
    margin-bottom: $space-md;

    h3 {
      font-size: $font-size-lg;
      color: $text-color;
      margin: 0;
    }
  }

  .chart-container {
    height: 300px;
  }
}
</style>
