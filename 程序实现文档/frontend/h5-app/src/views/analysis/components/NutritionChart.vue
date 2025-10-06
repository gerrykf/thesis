<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>🍽️ 营养摄入分析</h3>
    </div>
    <div class="chart-container">
      <v-chart v-if="hasData" :option="chartOption" :autoresize="true" />
      <van-empty v-else description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

// 注册必需的组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

interface NutritionData {
  record_date: string
  total_calories: number
  total_protein: number
  total_fat: number
  total_carbs: number
}

const props = defineProps<{
  data: NutritionData[]
}>()

const hasData = computed(() => props.data && props.data.length > 0)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      let result = `${params[0].axisValue}<br/>`
      params.forEach((item: any) => {
        result += `${item.marker}${item.seriesName}: ${item.value}${item.seriesName === '热量' ? ' kcal' : 'g'}<br/>`
      })
      return result
    }
  },
  legend: {
    data: ['热量', '蛋白质', '脂肪', '碳水'],
    bottom: 0,
    textStyle: {
      fontSize: 10
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map(item => {
      const date = new Date(item.record_date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    axisLabel: {
      fontSize: 10
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '热量(kcal)',
      nameTextStyle: {
        fontSize: 10
      },
      position: 'left',
      axisLabel: {
        fontSize: 10
      }
    },
    {
      type: 'value',
      name: '营养素(g)',
      nameTextStyle: {
        fontSize: 10
      },
      position: 'right',
      axisLabel: {
        fontSize: 10
      }
    }
  ],
  series: [
    {
      name: '热量',
      type: 'line',
      yAxisIndex: 0,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: '#ee0a24'
      },
      lineStyle: {
        width: 2
      },
      data: props.data.map(item => Math.round(item.total_calories || 0))
    },
    {
      name: '蛋白质',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: '#07c160'
      },
      lineStyle: {
        width: 2
      },
      data: props.data.map(item => Math.round(item.total_protein || 0))
    },
    {
      name: '脂肪',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: '#ff976a'
      },
      lineStyle: {
        width: 2
      },
      data: props.data.map(item => Math.round(item.total_fat || 0))
    },
    {
      name: '碳水',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: '#1989fa'
      },
      lineStyle: {
        width: 2
      },
      data: props.data.map(item => Math.round(item.total_carbs || 0))
    }
  ]
}))
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

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
