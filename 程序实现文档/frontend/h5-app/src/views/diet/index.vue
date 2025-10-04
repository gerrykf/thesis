<template>
  <div class="diet">
    <van-nav-bar title="饮食记录" left-arrow @click-left="onClickLeft" fixed />

    <div class="content" style="padding-top: 46px;">
      <!-- 日期选择 -->
      <van-cell-group inset>
        <van-cell
          is-link
          :value="selectedDate"
          @click="showDatePicker = true"
        >
          <template #title>
            <span>📅 选择日期</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 早餐 -->
      <div class="meal-section">
        <van-cell-group inset>
          <van-cell :title="`${getMealTypeIcon('breakfast')} ${getMealTypeName('breakfast')}`" :value="`${breakfastCalories}卡`" />
          <van-cell
            v-for="(item, index) in breakfastList"
            :key="index"
            :title="item.name"
            :value="`${item.calories}卡`"
          >
            <template #right-icon>
              <van-icon name="cross" @click="removeFood('breakfast', index)" />
            </template>
          </van-cell>
          <van-cell
            title="+ 添加食物"
            is-link
            @click="showAddFood('breakfast')"
          />
        </van-cell-group>
      </div>

      <!-- 午餐 -->
      <div class="meal-section">
        <van-cell-group inset>
          <van-cell :title="`${getMealTypeIcon('lunch')} ${getMealTypeName('lunch')}`" :value="`${lunchCalories}卡`" />
          <van-cell
            v-for="(item, index) in lunchList"
            :key="index"
            :title="item.name"
            :value="`${item.calories}卡`"
          >
            <template #right-icon>
              <van-icon name="cross" @click="removeFood('lunch', index)" />
            </template>
          </van-cell>
          <van-cell
            title="+ 添加食物"
            is-link
            @click="showAddFood('lunch')"
          />
        </van-cell-group>
      </div>

      <!-- 晚餐 -->
      <div class="meal-section">
        <van-cell-group inset>
          <van-cell :title="`${getMealTypeIcon('dinner')} ${getMealTypeName('dinner')}`" :value="`${dinnerCalories}卡`" />
          <van-cell
            v-for="(item, index) in dinnerList"
            :key="index"
            :title="item.name"
            :value="`${item.calories}卡`"
          >
            <template #right-icon>
              <van-icon name="cross" @click="removeFood('dinner', index)" />
            </template>
          </van-cell>
          <van-cell
            title="+ 添加食物"
            is-link
            @click="showAddFood('dinner')"
          />
        </van-cell-group>
      </div>

      <!-- 总计 -->
      <div class="total-section">
        <van-cell-group inset>
          <van-cell>
            <template #title>
              <div class="total-title">
                <span class="total-label">今日总计</span>
                <span class="total-value">{{ totalCalories }} / 1500 卡</span>
              </div>
            </template>
          </van-cell>
          <van-progress :percentage="caloriesPercentage" stroke-width="8" />
        </van-cell-group>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 添加食物弹窗 -->
    <van-popup v-model:show="showAddFoodDialog" position="bottom" round>
      <div class="add-food-dialog">
        <h3>添加食物</h3>
        <van-form @submit="onAddFood">
          <van-field
            v-model="newFood.name"
            label="食物名称"
            placeholder="请输入食物名称"
            :rules="[{ required: true, message: '请输入食物名称' }]"
          />
          <van-field
            v-model="newFood.calories"
            type="number"
            label="卡路里"
            placeholder="请输入卡路里"
            :rules="[{ required: true, message: '请输入卡路里' }]"
          />
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              确认添加
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import {
  formatDate,
  formatDateArray,
  getMealTypeName,
  getMealTypeIcon,
  calculateCaloriesPercentage,
  type MealType
} from './utils'
import { useMealManagement } from './utils/hooks'

const router = useRouter()

const selectedDate = ref(formatDate())
const showDatePicker = ref(false)
const showAddFoodDialog = ref(false)
const currentMealType = ref<MealType>('breakfast')

const currentDate = ref([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate())
])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

// 使用餐次管理Hook
const {
  breakfastList,
  lunchList,
  dinnerList,
  breakfastCalories,
  lunchCalories,
  dinnerCalories,
  totalCalories,
  addFood,
  removeFood
} = useMealManagement()

// 初始化示例数据
breakfastList.value = [
  { name: '牛奶', calories: 150 },
  { name: '全麦面包', calories: 170 }
]

const newFood = ref({
  name: '',
  calories: 0
})

const caloriesPercentage = computed(() =>
  calculateCaloriesPercentage(totalCalories.value, 1500).toFixed(0)
)

function onDateConfirm(value: any) {
  selectedDate.value = formatDateArray(value)
  showDatePicker.value = false
}

function onClickLeft() {
  router.back()
}

function showAddFood(mealType: MealType) {
  currentMealType.value = mealType
  newFood.value = { name: '', calories: 0 }
  showAddFoodDialog.value = true
}

function onAddFood() {
  const food = { ...newFood.value }
  addFood(currentMealType.value, food)
  showSuccessToast('添加成功')
  showAddFoodDialog.value = false
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.diet {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md;
  padding-bottom: 70px;
}

.meal-section {
  margin-bottom: $space-md;
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}

:deep(.van-icon-cross) {
  color: $danger-color;
  padding: $space-xs;
}

.total-section {
  margin-top: $space-lg;
}

.total-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: $font-size-base;
  font-weight: bold;
}

.total-label {
  color: $text-color;
}

.total-value {
  color: $primary-color;
}

.add-food-dialog {
  padding: $space-lg;

  h3 {
    text-align: center;
    margin-bottom: $space-md;
    font-size: $font-size-lg;
  }
}
</style>
