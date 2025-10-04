<template>
  <div class="history">
    <van-nav-bar title="历史记录" fixed />

    <div class="content" style="padding-top: 46px;">
      <van-tabs v-model:active="activeTab">
        <van-tab title="健康打卡">
          <van-list>
            <van-cell
              v-for="item in healthRecords"
              :key="item.id"
              :title="item.date"
              :value="`体重: ${item.weight}kg`"
            >
              <template #label>
                <div>运动: {{ item.exercise }}分钟 | 睡眠: {{ item.sleep }}小时</div>
              </template>
            </van-cell>
            <van-empty v-if="healthRecords.length === 0" description="暂无记录" />
          </van-list>
        </van-tab>

        <van-tab title="饮食记录">
          <van-list>
            <van-cell
              v-for="item in dietRecords"
              :key="item.id"
              :title="item.date"
              :value="`${item.calories}卡`"
            />
            <van-empty v-if="dietRecords.length === 0" description="暂无记录" />
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HealthRecordItem, DietRecordItem } from './utils/types'

const activeTab = ref(0)

const healthRecords = ref<HealthRecordItem[]>([
  { id: '1', date: '2024-01-15', weight: 65.5, exercise: 30, sleep: 8 },
  { id: '2', date: '2024-01-14', weight: 65.8, exercise: 25, sleep: 7 },
  { id: '3', date: '2024-01-13', weight: 66.0, exercise: 20, sleep: 7.5 }
])

const dietRecords = ref<DietRecordItem[]>([
  {
    id: '1',
    date: '2024-01-15',
    calories: 1200,
    meals: { breakfast: 320, lunch: 500, dinner: 380 }
  },
  {
    id: '2',
    date: '2024-01-14',
    calories: 1500,
    meals: { breakfast: 400, lunch: 600, dinner: 500 }
  },
  {
    id: '3',
    date: '2024-01-13',
    calories: 1350,
    meals: { breakfast: 350, lunch: 550, dinner: 450 }
  }
])
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.history {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding-bottom: 60px;
}
</style>
