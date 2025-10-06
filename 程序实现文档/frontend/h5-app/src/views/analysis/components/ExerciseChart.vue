<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>🏃 运动时长统计</h3>
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
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

// 注册必需的组件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

interface ExerciseData {
  record_date: string
  exercise_duration: number
  exercise_type?: string
}

const props = defineProps<{
  data: ExerciseData[]
}>()

const hasData = computed(() => props.data && props.data.length > 0)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const item = params[0]
      const data = props.data[item.dataIndex]
      let result = `${item.axisValue}<br/>${item.marker}运动时长: ${item.value} 分钟`
      if (data?.exercise_type) {
        result += `<br/>类型: ${getExerciseTypeText(data.exercise_type)}`
      }
      return result
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => {
      const date = new Date(item.record_date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    axisLabel: {
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    name: '时长(分钟)',
    nameTextStyle: {
      fontSize: 12
    },
    axisLabel: {
      fontSize: 10
    }
  },
  series: [
    {
      name: '运动时长',
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#07c160' },
            { offset: 1, color: '#06ae56' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      data: props.data.map(item => item.exercise_duration || 0)
    }
  ]
}))

function getExerciseTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    running: '跑步',
    walking: '步行',
    cycling: '骑行',
    swimming: '游泳',
    yoga: '瑜伽',
    fitness: '健身',
    other: '其他'
  }
  return typeMap[type] || type
}
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
    height: 250px;
  }
}
</style>
