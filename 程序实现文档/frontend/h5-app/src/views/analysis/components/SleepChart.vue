<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>😴 睡眠质量分析</h3>
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
import { LineChart, BarChart } from 'echarts/charts'
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
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

interface SleepData {
  record_date: string
  sleep_hours: number
  sleep_quality?: string
}

const props = defineProps<{
  data: SleepData[]
}>()

const hasData = computed(() => props.data && props.data.length > 0)

const chartOption = computed(() => {
  // 睡眠质量映射到数值
  const qualityMap: Record<string, number> = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1
  }

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = props.data[params[0].dataIndex]
        let result = `${params[0].axisValue}<br/>`
        result += `${params[0].marker}睡眠时长: ${data?.sleep_hours} 小时<br/>`
        if (data?.sleep_quality) {
          result += `睡眠质量: ${getSleepQualityText(data.sleep_quality)}`
        }
        return result
      }
    },
    legend: {
      data: ['睡眠时长'],
      bottom: 0,
      textStyle: {
        fontSize: 10
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
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
    yAxis: {
      type: 'value',
      name: '睡眠时长(小时)',
      nameTextStyle: {
        fontSize: 12
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [
      {
        name: '睡眠时长',
        type: 'line',
        smooth: true,
        symbolSize: 6,
        itemStyle: {
          color: (params: any) => {
            const data = props.data[params.dataIndex]
            const quality = data?.sleep_quality || 'fair'
            const qualityValue = qualityMap[quality] || 2
            // 根据睡眠质量改变颜色
            const colors = ['#ee0a24', '#ff976a', '#ffd21e', '#07c160']
            return colors[qualityValue - 1]
          }
        },
        lineStyle: {
          color: '#1989fa',
          width: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(25, 137, 250, 0.3)' },
              { offset: 1, color: 'rgba(25, 137, 250, 0.05)' }
            ]
          }
        },
        data: props.data.map(item => item.sleep_hours || 0)
      }
    ]
  }
})

function getSleepQualityText(quality: string): string {
  const qualityMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return qualityMap[quality] || quality
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
