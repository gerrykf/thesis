<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>⚖️ 体重趋势</h3>
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

interface WeightData {
  record_date: string
  weight: number
}

const props = defineProps<{
  data: WeightData[]
}>()

const hasData = computed(() => props.data && props.data.length > 0)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const item = params[0]
      return `${item.axisValue}<br/>${item.marker}体重: ${item.value} kg`
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
    name: '体重(kg)',
    nameTextStyle: {
      fontSize: 12
    },
    axisLabel: {
      fontSize: 10
    }
  },
  series: [
    {
      name: '体重',
      type: 'line',
      smooth: true,
      symbolSize: 6,
      itemStyle: {
        color: '#1989fa'
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
      data: props.data.map(item => item.weight)
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
    height: 250px;
  }
}
</style>
