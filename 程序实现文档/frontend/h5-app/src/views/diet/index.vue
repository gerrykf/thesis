<template>
  <div class="diet">
    <van-nav-bar title="饮食记录" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="content">
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

      <!-- 营养摘要 -->
      <div class="summary-card" v-if="hasSummary">
        <div class="summary-item">
          <span class="label">热量</span>
          <span class="value">{{ summary.total_calories || 0 }} kcal</span>
        </div>
        <div class="summary-item">
          <span class="label">蛋白质</span>
          <span class="value">{{ summary.total_protein || 0 }} g</span>
        </div>
        <div class="summary-item">
          <span class="label">脂肪</span>
          <span class="value">{{ summary.total_fat || 0 }} g</span>
        </div>
        <div class="summary-item">
          <span class="label">碳水</span>
          <span class="value">{{ summary.total_carbs || 0 }} g</span>
        </div>
      </div>

      <!-- 早餐 -->
      <div class="meal-section">
        <van-cell-group inset>
          <van-cell
            :title="`🍞 早餐`"
            :value="`${getMealCalories('breakfast')} kcal`"
          />
          <van-cell
            v-for="item in breakfastRecords"
            :key="item.id"
            :title="`${item.food_name} (${item.quantity}g)`"
            :value="`${item.calories} kcal`"
          >
            <template #label>
              <span class="nutrition-info">
                蛋白质 {{item.protein}}g · 脂肪 {{item.fat}}g · 碳水 {{item.carbs}}g
              </span>
            </template>
            <template #right-icon>
              <van-icon name="cross" @click="onDeleteRecord(item.id!)" />
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
          <van-cell
            :title="`🍱 午餐`"
            :value="`${getMealCalories('lunch')} kcal`"
          />
          <van-cell
            v-for="item in lunchRecords"
            :key="item.id"
            :title="`${item.food_name} (${item.quantity}g)`"
            :value="`${item.calories} kcal`"
          >
            <template #label>
              <span class="nutrition-info">
                蛋白质 {{item.protein}}g · 脂肪 {{item.fat}}g · 碳水 {{item.carbs}}g
              </span>
            </template>
            <template #right-icon>
              <van-icon name="cross" @click="onDeleteRecord(item.id!)" />
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
          <van-cell
            :title="`🍜 晚餐`"
            :value="`${getMealCalories('dinner')} kcal`"
          />
          <van-cell
            v-for="item in dinnerRecords"
            :key="item.id"
            :title="`${item.food_name} (${item.quantity}g)`"
            :value="`${item.calories} kcal`"
          >
            <template #label>
              <span class="nutrition-info">
                蛋白质 {{item.protein}}g · 脂肪 {{item.fat}}g · 碳水 {{item.carbs}}g
              </span>
            </template>
            <template #right-icon>
              <van-icon name="cross" @click="onDeleteRecord(item.id!)" />
            </template>
          </van-cell>
          <van-cell
            title="+ 添加食物"
            is-link
            @click="showAddFood('dinner')"
          />
        </van-cell-group>
      </div>

      <!-- 加餐 -->
      <div class="meal-section">
        <van-cell-group inset>
          <van-cell
            :title="`🍎 加餐`"
            :value="`${getMealCalories('snack')} kcal`"
          />
          <van-cell
            v-for="item in snackRecords"
            :key="item.id"
            :title="`${item.food_name} (${item.quantity}g)`"
            :value="`${item.calories} kcal`"
          >
            <template #label>
              <span class="nutrition-info">
                蛋白质 {{item.protein}}g · 脂肪 {{item.fat}}g · 碳水 {{item.carbs}}g
              </span>
            </template>
            <template #right-icon>
              <van-icon name="cross" @click="onDeleteRecord(item.id!)" />
            </template>
          </van-cell>
          <van-cell
            title="+ 添加食物"
            is-link
            @click="showAddFood('snack')"
          />
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
    <van-popup
      v-model:show="showAddFoodDialog"
      position="bottom"
      :style="{ height: '80%', left: '0', width: '100%' }"
      @opened="onDialogOpened"
    >
      <div class="add-food-dialog" v-if="showAddFoodDialog">
        <div class="dialog-header">
          <van-button plain @click="showAddFoodDialog = false">取消</van-button>
          <span class="title">添加食物</span>
          <van-button plain type="primary" @click="onConfirmAdd">确定</van-button>
        </div>
        <div class="dialog-content">
          <!-- 搜索框 -->
          <van-search
            v-model="searchKeyword"
            placeholder="搜索食物"
            @search="onSearchFood"
            @clear="onSearchFood"
          />

          <!-- 食物列表 -->
          <van-list
            v-model:loading="foodLoading"
            :finished="foodFinished"
            finished-text="没有更多了"
            @load="onLoadFood"
            :immediate-check="false"
          >
            <van-cell
              v-for="food in foodList"
              :key="food.id"
              :title="food.name"
              @click="onSelectFood(food)"
            >
              <template #label>
                <span class="food-info">
                  {{food.category}} · 每100g: {{food.calories_per_100g}}kcal
                </span>
              </template>
              <template #right-icon>
                <van-icon v-if="selectedFood?.id === food.id" name="success" color="#07c160" />
              </template>
            </van-cell>
          </van-list>

          <!-- 食用量输入 -->
          <div v-if="selectedFood" class="quantity-section">
            <van-field
              v-model="quantity"
              type="number"
              label="食用量(g)"
              placeholder="请输入食用量"
              :rules="[{ required: true, message: '请输入食用量' }]"
            />
            <div class="nutrition-preview">
              <div class="preview-item">
                <span class="label">热量:</span>
                <span class="value">{{ previewNutrition.calories }} kcal</span>
              </div>
              <div class="preview-item">
                <span class="label">蛋白质:</span>
                <span class="value">{{ previewNutrition.protein }} g</span>
              </div>
              <div class="preview-item">
                <span class="label">脂肪:</span>
                <span class="value">{{ previewNutrition.fat }} g</span>
              </div>
              <div class="preview-item">
                <span class="label">碳水:</span>
                <span class="value">{{ previewNutrition.carbs }} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showLoadingToast, closeToast, showToast, showConfirmDialog } from 'vant'
import { getDietRecords, postDietRecords, deleteDietRecordsId, getDietSummary } from '@/api/diet'
import { getFoods } from '@/api/food'

const router = useRouter()

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// 日期相关
const selectedDate = ref(formatDate())
const showDatePicker = ref(false)
const currentDate = ref([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate())
])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

// 饮食记录
const dietRecords = ref<API.DietRecord[]>([])
const summary = ref<{
  total_calories?: number
  total_protein?: number
  total_fat?: number
  total_carbs?: number
  meal_breakdown?: Record<string, any>
}>({})

// 添加食物相关
const showAddFoodDialog = ref(false)
const foodDialogKey = ref(0) // 用于强制重新渲染van-list
const currentMealType = ref<MealType>('breakfast')
const searchKeyword = ref('')
const foodList = ref<API.Food[]>([])
const foodLoading = ref(false)
const foodFinished = ref(false)
const foodPage = ref(1)
const selectedFood = ref<API.Food | null>(null)
const quantity = ref('')

// 格式化日期
function formatDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化日期数组
function formatDateArray(value: any) {
  const selectedValues = value.selectedValues || value
  return `${selectedValues[0]}-${String(selectedValues[1]).padStart(2, '0')}-${String(selectedValues[2]).padStart(2, '0')}`
}

// 按餐次分组的记录
const breakfastRecords = computed(() => dietRecords.value.filter(r => r.meal_type === 'breakfast'))
const lunchRecords = computed(() => dietRecords.value.filter(r => r.meal_type === 'lunch'))
const dinnerRecords = computed(() => dietRecords.value.filter(r => r.meal_type === 'dinner'))
const snackRecords = computed(() => dietRecords.value.filter(r => r.meal_type === 'snack'))

// 是否有摘要数据
const hasSummary = computed(() => {
  return (summary.value.total_calories || 0) > 0
})

// 获取某餐次的热量
function getMealCalories(mealType: MealType) {
  const records = dietRecords.value.filter(r => r.meal_type === mealType)
  const total = records.reduce((sum, r) => sum + (Number(r.calories) || 0), 0)
  return total.toFixed(0)
}

// 预览营养成分
const previewNutrition = computed(() => {
  if (!selectedFood.value || !quantity.value) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 }
  }
  const q = parseFloat(quantity.value)
  const factor = q / 100
  return {
    calories: ((selectedFood.value.calories_per_100g || 0) * factor).toFixed(1),
    protein: ((selectedFood.value.protein_per_100g || 0) * factor).toFixed(1),
    fat: ((selectedFood.value.fat_per_100g || 0) * factor).toFixed(1),
    carbs: ((selectedFood.value.carbs_per_100g || 0) * factor).toFixed(1)
  }
})

// 加载饮食记录
async function loadDietRecords() {
  try {
    const response = await getDietRecords({
      date: selectedDate.value,
      limit: 100
    })

    const records = (response as any).data?.records || []
    dietRecords.value = records
  } catch (error) {
    console.error('加载饮食记录失败:', error)
  }
}

// 加载营养摘要
async function loadSummary() {
  try {
    const response = await getDietSummary({
      date: selectedDate.value
    })

    summary.value = (response as any).data || {}
  } catch (error) {
    console.error('加载营养摘要失败:', error)
  }
}

// 加载食物列表
async function onLoadFood() {
  console.log('onLoadFood 被调用', { loading: foodLoading.value, page: foodPage.value })
  if (foodLoading.value) {
    console.log('已在加载中，跳过')
    return
  }

  foodLoading.value = true
  try {
    console.log('开始请求食物列表:', { page: foodPage.value, search: searchKeyword.value })
    const response = await getFoods({
      page: foodPage.value,
      limit: 20,
      search: searchKeyword.value
    })

    console.log('食物列表响应:', response)
    const foods = (response as any).data?.foods || []
    console.log('解析到的食物数量:', foods.length)

    // 如果返回的食物数量少于请求的数量，说明没有更多了
    if (foods.length < 20) {
      foodFinished.value = true
      console.log('设置 finished = true')
    }

    if (foods.length > 0) {
      foodList.value.push(...foods)
      foodPage.value++
      console.log('食物列表更新完成:', { total: foodList.value.length, nextPage: foodPage.value })
    }
  } catch (error) {
    console.error('加载食物列表失败:', error)
  } finally {
    foodLoading.value = false
  }
}

// 搜索食物
function onSearchFood() {
  foodList.value = []
  foodPage.value = 1
  foodFinished.value = false
  onLoadFood()
}

// 选择食物
function onSelectFood(food: API.Food) {
  selectedFood.value = food
  quantity.value = '100'
}

// 显示添加食物对话框
function showAddFood(mealType: MealType) {
  console.log('showAddFood 被调用', mealType)
  currentMealType.value = mealType
  selectedFood.value = null
  quantity.value = ''
  searchKeyword.value = ''

  // 重置状态
  foodList.value = []
  foodPage.value = 1
  foodFinished.value = false
  foodLoading.value = false
  console.log('重置状态完成:', {
    listLength: foodList.value.length,
    page: foodPage.value,
    finished: foodFinished.value,
    loading: foodLoading.value
  })

  showAddFoodDialog.value = true
}

// 弹窗完全打开后触发加载
function onDialogOpened() {
  console.log('弹窗已打开，手动触发加载')
  console.log('当前状态:', {
    listLength: foodList.value.length,
    finished: foodFinished.value,
    loading: foodLoading.value
  })
  // 由于设置了immediate-check=false，需要手动触发第一次加载
  if (foodList.value.length === 0 && !foodFinished.value) {
    console.log('条件满足，调用onLoadFood')
    onLoadFood()
  } else {
    console.log('条件不满足，不加载', {
      listEmpty: foodList.value.length === 0,
      notFinished: !foodFinished.value
    })
  }
}

// 确认添加
async function onConfirmAdd() {
  if (!selectedFood.value) {
    showToast('请选择食物')
    return
  }

  if (!quantity.value || parseFloat(quantity.value) <= 0) {
    showToast('请输入食用量')
    return
  }

  showLoadingToast({
    message: '添加中...',
    forbidClick: true,
    duration: 0
  })

  try {
    await postDietRecords({
      food_id: selectedFood.value.id!,
      record_date: selectedDate.value,
      meal_type: currentMealType.value,
      quantity: parseFloat(quantity.value)
    })

    closeToast()
    showSuccessToast('添加成功')
    showAddFoodDialog.value = false

    // 重新加载数据
    await Promise.all([loadDietRecords(), loadSummary()])
  } catch (error: any) {
    closeToast()
    showToast(error.message || '添加失败')
  }
}

// 删除记录
async function onDeleteRecord(id: number) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要删除这条记录吗？'
    })

    showLoadingToast({
      message: '删除中...',
      forbidClick: true,
      duration: 0
    })

    await deleteDietRecordsId({ id })

    closeToast()
    showSuccessToast('删除成功')

    // 重新加载数据
    await Promise.all([loadDietRecords(), loadSummary()])
  } catch (error: any) {
    if (error !== 'cancel') {
      closeToast()
      showToast(error.message || '删除失败')
    }
  }
}

// 日期确认
function onDateConfirm(value: any) {
  selectedDate.value = formatDateArray(value)
  showDatePicker.value = false
}

// 返回
function onClickLeft() {
  router.back()
}

// 监听日期变化
watch(selectedDate, () => {
  loadDietRecords()
  loadSummary()
})

// 初始化
onMounted(() => {
  loadDietRecords()
  loadSummary()
})
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

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-lg;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-md;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  .summary-item {
    text-align: center;
    color: $white;

    .label {
      font-size: $font-size-sm;
      opacity: 0.9;
      display: block;
      margin-bottom: $space-xs;
    }

    .value {
      font-size: $font-size-lg;
      font-weight: bold;
      display: block;
    }
  }
}

.meal-section {
  margin-bottom: $space-md;

  .nutrition-info {
    font-size: $font-size-sm;
    color: $text-color-3;
    margin-top: $space-xs;
  }
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}

:deep(.van-icon-cross) {
  color: $danger-color;
  padding: $space-xs;
}

.add-food-dialog {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1px solid $border-color;

    .title {
      font-size: $font-size-lg;
      font-weight: bold;
    }
  }

  .dialog-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;

    .food-info {
      font-size: $font-size-sm;
      color: $text-color-3;
      margin-top: $space-xs;
    }

    .quantity-section {
      position: sticky;
      bottom: 0;
      background: $white;
      border-top: 1px solid $border-color;
      padding: $space-md;

      .nutrition-preview {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $space-sm;
        margin-top: $space-md;
        padding: $space-md;
        background: $background-color;
        border-radius: $radius-md;

        .preview-item {
          display: flex;
          justify-content: space-between;
          font-size: $font-size-sm;

          .label {
            color: $text-color-2;
          }

          .value {
            color: $text-color;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
