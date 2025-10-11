<template>
  <div class="history">
    <van-nav-bar title="历史记录" fixed placeholder />

    <div class="content">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <!-- 健康打卡 Tab -->
        <van-tab title="健康打卡">
          <!-- 日期筛选区域 -->
          <div class="filter-bar">
            <DateFilter
              v-model="healthDateRange"
              @change="onHealthDateChange"
              @clear="onHealthDateClear"
            />
          </div>

          <van-pull-refresh v-model="healthRefreshing" @refresh="onHealthRefresh">
            <van-list
              v-model:loading="healthLoading"
              :finished="healthFinished"
              finished-text="没有更多了"
              @load="loadHealthRecords"
            >
              <div v-for="record in healthRecords" :key="record.id" class="record-card health-record">
                <div class="record-header">
                  <span class="record-date">{{ formatRecordDate(record.record_date || '') }}</span>
                </div>

                <div class="record-content">
                  <div class="record-item">
                    <span class="label">⚖️ 体重</span>
                    <span class="value">{{ record.weight }} kg</span>
                  </div>

                  <div v-if="record.exercise_duration" class="record-item">
                    <span class="label">🏃 运动</span>
                    <span class="value">
                      {{ formatExerciseDuration(record.exercise_duration) }}
                      <span v-if="record.exercise_type" class="sub-value">
                        · {{ getExerciseTypeText(record.exercise_type) }}
                      </span>
                    </span>
                  </div>

                  <div v-if="record.sleep_hours" class="record-item">
                    <span class="label">😴 睡眠</span>
                    <span class="value">
                      {{ record.sleep_hours }} 小时
                      <span v-if="record.sleep_quality" class="sub-value">
                        · {{ getSleepQualityText(record.sleep_quality) }}
                      </span>
                    </span>
                  </div>

                  <div v-if="record.mood" class="record-item">
                    <span class="label">💪 心情</span>
                    <span class="value">{{ getMoodText(record.mood) }} {{ getMoodIcon(record.mood) }}</span>
                  </div>

                  <div v-if="record.notes" class="record-notes">
                    <span class="label">📝 备注</span>
                    <span class="notes-content">{{ record.notes }}</span>
                  </div>
                </div>
              </div>

              <van-empty v-if="!healthLoading && healthRecords.length === 0" description="暂无记录" />
            </van-list>
          </van-pull-refresh>
        </van-tab>

        <!-- 饮食记录 Tab -->
        <van-tab title="饮食记录">
          <!-- 日期筛选区域 -->
          <div class="filter-bar">
            <DateFilter
              v-model="dietDateRange"
              @change="onDietDateChange"
              @clear="onDietDateClear"
            />
          </div>

          <van-pull-refresh v-model="dietRefreshing" @refresh="onDietRefresh">
            <van-list
              v-model:loading="dietLoading"
              :finished="dietFinished"
              finished-text="没有更多了"
              @load="loadDietRecords"
            >
              <!-- 按日期分组显示 -->
              <div v-for="(group, date) in groupedDietRecords" :key="date" class="day-group">
                <div class="day-header">
                  <div class="date-info">
                    <div class="day-date">{{ formatSimpleDate(date) }}</div>
                    <div class="day-weekday">{{ getWeekdayFromDate(date) }}</div>
                  </div>
                  <span class="day-total">{{ getDayTotalCalories(group) }} kcal</span>
                </div>

                <div class="meals-container">
                  <!-- 按餐次分组 -->
                  <div v-for="mealType in ['breakfast', 'lunch', 'dinner', 'snack']" :key="mealType">
                    <div v-if="getMealRecords(group, mealType).length > 0" class="meal-section">
                      <div class="meal-header">
                        <span class="meal-icon">{{ getMealIcon(mealType) }}</span>
                        <span class="meal-name">{{ getMealTypeText(mealType) }}</span>
                        <span class="meal-calories">{{ getMealTotalCalories(group, mealType) }} kcal</span>
                      </div>

                      <div class="meal-items">
                        <div
                          v-for="record in getMealRecords(group, mealType)"
                          :key="record.id"
                          class="food-item"
                        >
                          <div class="food-info">
                            <span class="food-name">{{ record.food_name }}</span>
                            <span class="food-quantity">{{ record.quantity }}g</span>
                          </div>
                          <div class="food-nutrition">
                            <span class="calories">{{ Math.round(Number(record.calories) || 0) }} kcal</span>
                            <span v-if="record.protein" class="nutrition-item">
                              蛋白 {{ Math.round(Number(record.protein) || 0) }}g
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <van-empty v-if="!dietLoading && dietRecords.length === 0" description="暂无记录" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHealthRecords, useDietRecords } from './utils'
import DateFilter from './components/DateFilter.vue'

const activeTab = ref(0)

// 健康记录 Hook
const {
  records: healthRecords,
  loading: healthLoading,
  finished: healthFinished,
  refreshing: healthRefreshing,
  startDate: healthStartDate,
  endDate: healthEndDate,
  loadRecords: loadHealthRecords,
  onRefresh: onHealthRefresh,
  setDateRange: setHealthDateRange,
  clearDateRange: clearHealthDateRange
} = useHealthRecords()

// 饮食记录 Hook
const {
  records: dietRecords,
  loading: dietLoading,
  finished: dietFinished,
  refreshing: dietRefreshing,
  startDate: dietStartDate,
  endDate: dietEndDate,
  loadRecords: loadDietRecords,
  onRefresh: onDietRefresh,
  setDateRange: setDietDateRange,
  clearDateRange: clearDietDateRange
} = useDietRecords()

// 日期范围（用于 DateFilter 组件的 v-model）
const healthDateRange = computed({
  get: () => ({ startDate: healthStartDate.value, endDate: healthEndDate.value }),
  set: (val) => {
    // 通过事件处理，不需要在这里设置
  }
})

const dietDateRange = computed({
  get: () => ({ startDate: dietStartDate.value, endDate: dietEndDate.value }),
  set: (val) => {
    // 通过事件处理，不需要在这里设置
  }
})

/**
 * 健康记录日期筛选变化
 */
function onHealthDateChange(range: { startDate: string; endDate: string }) {
  console.log('健康记录日期筛选:', range)
  setHealthDateRange(range.startDate, range.endDate)
}

/**
 * 清除健康记录日期筛选
 */
function onHealthDateClear() {
  console.log('清除健康记录日期筛选')
  clearHealthDateRange()
}

/**
 * 饮食记录日期筛选变化
 */
function onDietDateChange(range: { startDate: string; endDate: string }) {
  console.log('饮食记录日期筛选:', range)
  setDietDateRange(range.startDate, range.endDate)
}

/**
 * 清除饮食记录日期筛选
 */
function onDietDateClear() {
  console.log('清除饮食记录日期筛选')
  clearDietDateRange()
}

/**
 * 按日期分组的饮食记录
 */
const groupedDietRecords = computed(() => {
  const groups: Record<string, API.DietRecord[]> = {}

  dietRecords.value.forEach(record => {
    const date = record.record_date || ''
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
  })

  // 按日期排序（从新到旧）
  const sortedGroups: Record<string, API.DietRecord[]> = {}
  Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .forEach(date => {
      const records = groups[date]
      if (records) {
        sortedGroups[date] = records
      }
    })

  return sortedGroups
})

/**
 * 获取指定餐次的记录
 */
function getMealRecords(records: API.DietRecord[], mealType: string) {
  return records.filter(r => r.meal_type === mealType)
}

/**
 * 获取一天的总热量
 */
function getDayTotalCalories(records: API.DietRecord[]) {
  const total = records.reduce((sum, r) => sum + (Number(r.calories) || 0), 0)
  return Math.round(total)
}

/**
 * 获取指定餐次的总热量
 */
function getMealTotalCalories(records: API.DietRecord[], mealType: string) {
  const mealRecords = getMealRecords(records, mealType)
  const total = mealRecords.reduce((sum, r) => sum + (Number(r.calories) || 0), 0)
  return Math.round(total)
}

/**
 * 获取餐次图标
 */
function getMealIcon(mealType: string): string {
  const iconMap: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  }
  return iconMap[mealType] || '🍽️'
}

/**
 * Tab 切换事件处理
 */
function onTabChange(index: number) {
  console.log('切换到 Tab:', index)

  if (index === 0) {
    // 切换到健康打卡 Tab - 总是刷新数据
    console.log('切换到健康打卡，刷新数据')
    onHealthRefresh()
  } else if (index === 1) {
    // 切换到饮食记录 Tab - 总是刷新数据
    console.log('切换到饮食记录，刷新数据')
    onDietRefresh()
  }
}

/**
 * 格式化记录日期（完整版，包含星期）
 */
function formatRecordDate(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]

  return `${year}年${month}月${day}日 星期${weekday}`
}

/**
 * 格式化简单日期（不含星期）
 */
function formatSimpleDate(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}年${month}月${day}日`
}

/**
 * 从日期字符串获取星期
 */
function getWeekdayFromDate(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()] || ''
}

/**
 * 格式化运动时长
 */
function formatExerciseDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}小时`
    }
    return `${hours}小时${remainingMinutes}分钟`
  }
  return `${minutes}分钟`
}

/**
 * 获取运动类型文本
 */
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

/**
 * 获取睡眠质量文本
 */
function getSleepQualityText(quality: string): string {
  const qualityMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return qualityMap[quality] || quality
}

/**
 * 获取心情文本
 */
function getMoodText(mood: string): string {
  const moodMap: Record<string, string> = {
    excellent: '心情很好',
    good: '心情不错',
    fair: '心情一般',
    poor: '心情欠佳'
  }
  return moodMap[mood] || mood
}

/**
 * 获取心情图标
 */
function getMoodIcon(mood: string): string {
  const iconMap: Record<string, string> = {
    excellent: '😄',
    good: '😊',
    fair: '😐',
    poor: '😔'
  }
  return iconMap[mood] || '😶'
}

/**
 * 获取餐次类型文本
 */
function getMealTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return typeMap[type] || type
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/mixins.scss' as *;

.history {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: 0 0 60px 0;

  :deep(.van-tabs__wrap) {
    position: sticky;
    top: 46px;
    z-index: 99;
  }

  // 筛选栏样式 - 紧凑设计
  .filter-bar {
    padding: 10px $space-md;
    background: $white;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: flex-start;
  }

  // 确保下拉刷新容器占满剩余空间
  :deep(.van-pull-refresh) {
    min-height: calc(100vh - 46px - 44px - 45px); // 减去导航栏、tabs栏和筛选栏
  }

  // 空状态样式调整
  :deep(.van-empty) {
    padding: $space-lg 0;
    min-height: calc(100vh - 46px - 44px - 45px - $space-lg * 2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.record-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-md;
  margin: $space-sm $space-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .record-header {
    @include flex-between;
    align-items: center;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 1px solid $border-color;

    .record-date {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-color;
    }

    .meal-type-badge {
      font-size: $font-size-xs;
      padding: 4px $space-sm;
      border-radius: $radius-sm;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: $white;
    }
  }

  .record-content {
    .record-item {
      @include flex-between;
      padding: $space-sm 0;

      .label {
        font-size: $font-size-base;
        color: $text-color-2;
      }

      .value {
        font-size: $font-size-base;
        color: $text-color;
        font-weight: 500;

        &.highlight {
          color: $primary-color;
          font-weight: 600;
        }

        .sub-value {
          color: $text-color-3;
          font-weight: 400;
        }
      }
    }

    .record-notes {
      display: flex;
      flex-direction: column;
      gap: $space-xs;
      padding: $space-sm 0;
      margin-top: $space-xs;
      border-top: 1px dashed $border-color;

      .label {
        font-size: $font-size-sm;
        color: $text-color-2;
      }

      .notes-content {
        font-size: $font-size-sm;
        color: $text-color;
        line-height: 1.6;
        word-break: break-all;
      }
    }

    .macros-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-sm;
      margin-top: $space-sm;
      padding-top: $space-sm;
      border-top: 1px dashed $border-color;

      .macro-item {
        text-align: center;
        padding: $space-xs;
        background: $background-color;
        border-radius: $radius-sm;

        .label {
          display: block;
          font-size: $font-size-xs;
          color: $text-color-3;
          margin-bottom: 4px;
        }

        .value {
          display: block;
          font-size: $font-size-sm;
          color: $text-color;
          font-weight: 600;
        }
      }
    }
  }
}

// 饮食记录按日期分组样式
.day-group {
  margin: $space-sm $space-md;
  background: $white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .day-header {
    @include flex-between;
    align-items: center;
    padding: $space-sm $space-md;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: $white;

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .day-date {
        font-size: $font-size-lg;
        font-weight: 600;
      }

      .day-weekday {
        font-size: $font-size-sm;
        opacity: 0.9;
      }
    }

    .day-total {
      font-size: $font-size-base;
      font-weight: 500;
    }
  }

  .meals-container {
    padding: $space-sm;

    .meal-section {
      margin-bottom: $space-sm;
      background: $background-color;
      border-radius: $radius-md;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      .meal-header {
        @include flex-between;
        align-items: center;
        padding: $space-sm $space-md;
        background: rgba(102, 126, 234, 0.08);
        border-bottom: 1px solid $border-color;

        .meal-icon {
          font-size: 18px;
        }

        .meal-name {
          flex: 1;
          margin-left: $space-sm;
          font-size: $font-size-base;
          font-weight: 600;
          color: $text-color;
        }

        .meal-calories {
          font-size: $font-size-sm;
          color: $primary-color;
          font-weight: 600;
        }
      }

      .meal-items {
        .food-item {
          @include flex-between;
          align-items: center;
          padding: $space-sm $space-md;
          border-bottom: 1px solid $border-color;

          &:last-child {
            border-bottom: none;
          }

          .food-info {
            flex: 1;
            min-width: 0;

            .food-name {
              display: block;
              font-size: $font-size-base;
              color: $text-color;
              margin-bottom: 4px;
            }

            .food-quantity {
              font-size: $font-size-xs;
              color: $text-color-3;
            }
          }

          .food-nutrition {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;

            .calories {
              font-size: $font-size-base;
              color: $primary-color;
              font-weight: 600;
            }

            .nutrition-item {
              font-size: $font-size-xs;
              color: $text-color-3;
            }
          }
        }
      }
    }
  }
}
</style>
