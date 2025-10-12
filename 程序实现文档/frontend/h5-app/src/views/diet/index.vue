<template>
  <div class="diet">
    <van-nav-bar :title="t('utils.quickActions.dietRecord')" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="content">
      <!-- 日期选择 -->
      <van-cell-group>
        <van-cell
          is-link
          :value="selectedDate"
          @click="showDatePicker = true"
        >
          <template #title>
            <span>{{ t('xuan-ze-ri-qi-0') }}</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 营养摘要 -->
      <div class="summary-card" v-if="hasSummary">
        <div class="summary-item">
          <span class="label">{{ t('re-liang') }}</span>
          <span class="value">{{ t('summary-total_calories-or-or-0-kcal', [summary.total_calories || 0]) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">{{ t('dan-bai-zhi') }}</span>
          <span class="value">{{ t('summary-total_protein-or-or-0-g', [summary.total_protein || 0]) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">{{ t('zhi-fang') }}</span>
          <span class="value">{{ t('summary-total_fat-or-or-0-g', [summary.total_fat || 0]) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">{{ t('tan-shui') }}</span>
          <span class="value">{{ t('summary-total_carbs-or-or-0-g', [summary.total_carbs || 0]) }}</span>
        </div>
      </div>

      <!-- 早餐 -->
      <div class="meal-section">
        <div class="meal-card">
          <!-- 卡片标题 -->
          <div class="meal-card-header">
            <span class="meal-title">{{ t('zao-can') }}</span>
            <span class="meal-calories">{{ t('getmealcalories-breakfast-kcal', [getMealCalories('breakfast')]) }}</span>
          </div>

          <!-- 食物卡片网格 -->
          <div class="food-cards-grid" v-if="breakfastRecords.length > 0">
            <div
              v-for="item in breakfastRecords"
              :key="item.id"
              class="food-card"
            >
              <van-icon
                name="cross"
                class="delete-icon"
                @click="onDeleteRecord(item.id!)"
              />
              <div class="card-header">
                <span class="food-name">{{ item.food_name }}</span>
                <span class="food-quantity">{{ t('item-quantity-g', [item.quantity]) }}</span>
              </div>
              <div class="card-calories">{{ t('item-calories-kcal', [item.calories]) }}</div>
              <div class="card-nutrition">
                <span>{{ t('dan-bai-itemprotein-g', [item.protein]) }}</span>
                <span>{{ t('zhi-fang-itemfat-g', [item.fat]) }}</span>
                <span>{{ t('tan-shui-itemcarbs-g', [item.carbs]) }}</span>
              </div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <div class="add-food-btn" @click="showAddFood('breakfast')">
            <van-icon name="plus" />
            <span>{{ t('tian-jia-shi-wu') }}</span>
          </div>
        </div>
      </div>

      <!-- 午餐 -->
      <div class="meal-section">
        <div class="meal-card">
          <!-- 卡片标题 -->
          <div class="meal-card-header">
            <span class="meal-title">{{ t('wu-can') }}</span>
            <span class="meal-calories">{{ t('getmealcalories-lunch-kcal', [getMealCalories('lunch')]) }}</span>
          </div>

          <!-- 食物卡片网格 -->
          <div class="food-cards-grid" v-if="lunchRecords.length > 0">
            <div
              v-for="item in lunchRecords"
              :key="item.id"
              class="food-card"
            >
              <van-icon
                name="cross"
                class="delete-icon"
                @click="onDeleteRecord(item.id!)"
              />
              <div class="card-header">
                <span class="food-name">{{ item.food_name }}</span>
                <span class="food-quantity">{{ t('item-quantity-g-0', [item.quantity]) }}</span>
              </div>
              <div class="card-calories">{{ t('item-calories-kcal-0', [item.calories]) }}</div>
              <div class="card-nutrition">
                <span>{{ t('dan-bai-itemprotein-g-0', [item.protein]) }}</span>
                <span>{{ t('zhi-fang-itemfat-g-0', [item.fat]) }}</span>
                <span>{{ t('tan-shui-itemcarbs-g-0', [item.carbs]) }}</span>
              </div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <div class="add-food-btn" @click="showAddFood('lunch')">
            <van-icon name="plus" />
            <span>{{ t('tian-jia-shi-wu-0') }}</span>
          </div>
        </div>
      </div>

      <!-- 晚餐 -->
      <div class="meal-section">
        <div class="meal-card">
          <!-- 卡片标题 -->
          <div class="meal-card-header">
            <span class="meal-title">{{ t('wan-can') }}</span>
            <span class="meal-calories">{{ t('getmealcalories-dinner-kcal', [getMealCalories('dinner')]) }}</span>
          </div>

          <!-- 食物卡片网格 -->
          <div class="food-cards-grid" v-if="dinnerRecords.length > 0">
            <div
              v-for="item in dinnerRecords"
              :key="item.id"
              class="food-card"
            >
              <van-icon
                name="cross"
                class="delete-icon"
                @click="onDeleteRecord(item.id!)"
              />
              <div class="card-header">
                <span class="food-name">{{ item.food_name }}</span>
                <span class="food-quantity">{{ t('item-quantity-g-1', [item.quantity]) }}</span>
              </div>
              <div class="card-calories">{{ t('item-calories-kcal-1', [item.calories]) }}</div>
              <div class="card-nutrition">
                <span>{{ t('dan-bai-itemprotein-g-1', [item.protein]) }}</span>
                <span>{{ t('zhi-fang-itemfat-g-1', [item.fat]) }}</span>
                <span>{{ t('tan-shui-itemcarbs-g-1', [item.carbs]) }}</span>
              </div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <div class="add-food-btn" @click="showAddFood('dinner')">
            <van-icon name="plus" />
            <span>{{ t('tian-jia-shi-wu-1') }}</span>
          </div>
        </div>
      </div>

      <!-- 加餐 -->
      <div class="meal-section">
        <div class="meal-card">
          <!-- 卡片标题 -->
          <div class="meal-card-header">
            <span class="meal-title">{{ t('jia-can') }}</span>
            <span class="meal-calories">{{ t('getmealcalories-snack-kcal', [getMealCalories('snack')]) }}</span>
          </div>

          <!-- 食物卡片网格 -->
          <div class="food-cards-grid" v-if="snackRecords.length > 0">
            <div
              v-for="item in snackRecords"
              :key="item.id"
              class="food-card"
            >
              <van-icon
                name="cross"
                class="delete-icon"
                @click="onDeleteRecord(item.id!)"
              />
              <div class="card-header">
                <span class="food-name">{{ item.food_name }}</span>
                <span class="food-quantity">{{ t('item-quantity-g-2', [item.quantity]) }}</span>
              </div>
              <div class="card-calories">{{ t('item-calories-kcal-2', [item.calories]) }}</div>
              <div class="card-nutrition">
                <span>{{ t('dan-bai-itemprotein-g-2', [item.protein]) }}</span>
                <span>{{ t('zhi-fang-itemfat-g-2', [item.fat]) }}</span>
                <span>{{ t('tan-shui-itemcarbs-g-2', [item.carbs]) }}</span>
              </div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <div class="add-food-btn" @click="showAddFood('snack')">
            <van-icon name="plus" />
            <span>{{ t('tian-jia-shi-wu-2') }}</span>
          </div>
        </div>
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
      :style="{ height: '100%', left: '0', width: '100%' }"
      @opened="onDialogOpened"
    >
      <div class="add-food-dialog" v-if="showAddFoodDialog">
        <div class="dialog-header">
          <van-button plain @click="showAddFoodDialog = false">{{ t('common.cancel') }}</van-button>
          <span class="title">{{ t('tian-jia-shi-wu-3') }}</span>
          <van-button plain type="primary" @click="onConfirmAdd">
            {{ t('que-ding') }}<span v-if="selectedFoods.length > 0">{{ t('selectedfoods-length', [selectedFoods.length]) }}</span>
          </van-button>
        </div>

        <div class="dialog-content">
          <!-- 搜索框 -->
          <van-search
            v-model="searchKeyword"
            :placeholder="t('sou-suo-shi-wu')"
            @search="onSearchFood"
            @clear="onSearchFood"
          />

          <!-- 食物列表容器 -->
          <div class="food-list-section" ref="listContainerRef">
            <van-list
              v-model:loading="foodLoading"
              :finished="foodFinished"
              :finished-text="t('mei-you-geng-duo-le')"
              @load="onLoadFood"
              :offset="300"
            >
              <van-cell
                v-for="food in foodList"
                :key="food.id"
                @click="onToggleFood(food)"
                clickable
              >
                <template #title>
                  <div class="food-title">
                    <van-checkbox
                      :model-value="isFoodSelected(food.id!)"
                      @click.stop="onToggleFood(food)"
                    />
                    <span class="food-name">{{ food.name }}</span>
                  </div>
                </template>
                <template #label>
                  <span class="food-info">
                    {{ t('foodcategory-mei-100g-foodcaloriesper100g-kcal', [food.category, food.calories_per_100g]) }} </span>
                </template>
              </van-cell>
            </van-list>
          </div>
        </div>

        <!-- 已选食物列表和营养汇总 -->
        <div v-if="selectedFoods.length > 0" class="selected-section">
          <div class="selected-header">
            <span class="title">{{ t('yi-xuan-shi-wu-selectedfoodslength', [selectedFoods.length]) }}</span>
            <span class="total-calories">{{ t('zong-ji-totalnutritioncalories-kcal', [totalNutrition.calories]) }}</span>
          </div>

          <div class="selected-list">
            <div v-for="item in selectedFoods" :key="item.food.id" class="selected-item">
              <div class="item-info">
                <span class="name">{{ item.food.name }}</span>
                <van-icon name="cross" @click="removeSelectedFood(item.food.id!)" class="remove-btn" />
              </div>
              <div class="item-quantity">
                <van-stepper
                  v-model="item.quantity"
                  @change="() => updateQuantity(item.food.id!, item.quantity)"
                  min="1"
                  step="10"
                  integer
                  input-width="50px"
                />
                <span class="unit">g</span>
              </div>
            </div>
          </div>

          <!-- 营养汇总 -->
          <div class="nutrition-total">
            <div class="total-item">
              <span class="label">{{ t('re-liang') }}</span>
              <span class="value">{{ t('totalnutrition-calories-kcal', [totalNutrition.calories]) }}</span>
            </div>
            <div class="total-item">
              <span class="label">{{ t('dan-bai-zhi') }}</span>
              <span class="value">{{ t('totalnutrition-protein-g', [totalNutrition.protein]) }}</span>
            </div>
            <div class="total-item">
              <span class="label">{{ t('zhi-fang') }}</span>
              <span class="value">{{ t('totalnutrition-fat-g', [totalNutrition.fat]) }}</span>
            </div>
            <div class="total-item">
              <span class="label">{{ t('tan-shui') }}</span>
              <span class="value">{{ t('totalnutrition-carbs-g', [totalNutrition.carbs]) }}</span>
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
import { useI18n } from 'vue-i18n'

const {t} = useI18n()

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
const currentMealType = ref<MealType>('breakfast')
const searchKeyword = ref('')
const foodList = ref<API.Food[]>([])
const foodLoading = ref(false)
const foodFinished = ref(false)
const foodPage = ref(1)

// 多选食物相关
interface SelectedFoodItem {
  food: API.Food
  quantity: string
}
const selectedFoods = ref<SelectedFoodItem[]>([])

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

// 计算已选食物的总营养
const totalNutrition = computed(() => {
  let calories = 0
  let protein = 0
  let fat = 0
  let carbs = 0

  selectedFoods.value.forEach(item => {
    const q = parseFloat(item.quantity) || 0
    if (q > 0) {
      const factor = q / 100
      calories += (item.food.calories_per_100g || 0) * factor
      protein += (item.food.protein_per_100g || 0) * factor
      fat += (item.food.fat_per_100g || 0) * factor
      carbs += (item.food.carbs_per_100g || 0) * factor
    }
  })

  return {
    calories: calories.toFixed(1),
    protein: protein.toFixed(1),
    fat: fat.toFixed(1),
    carbs: carbs.toFixed(1)
  }
})

// 检查食物是否已选中
function isFoodSelected(foodId: number) {
  return selectedFoods.value.some(item => item.food.id === foodId)
}

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
  console.log('onLoadFood 被调用', { loading: foodLoading.value, page: foodPage.value, finished: foodFinished.value })

  // 只检查 finished 状态,List 组件会管理 loading
  if (foodFinished.value) {
    console.log('已完成,跳过加载')
    return
  }

  try {
    console.log('开始请求食物列表:', { page: foodPage.value, search: searchKeyword.value })

    const response = await getFoods({
      page: foodPage.value,
      limit: 20,
      search: searchKeyword.value
    })

    console.log('食物列表响应:', response)
    const foods = (response as any).data?.foods || []
    const pagination = (response as any).data?.pagination || {}
    console.log('解析到的食物数量:', foods.length, '分页信息:', pagination)

    if (foods.length > 0) {
      foodList.value.push(...foods)
      foodPage.value++
      console.log('食物列表更新完成:', {
        total: foodList.value.length,
        nextPage: foodPage.value,
        currentPage: pagination.page,
        totalPages: pagination.totalPages
      })
    }

    // 根据分页信息判断是否还有更多数据
    if (foods.length === 0 || (pagination.page >= pagination.totalPages)) {
      foodFinished.value = true
      console.log('没有更多数据了')
    }
  } catch (error) {
    console.error('加载食物列表失败:', error)
    showToast(t('jia-zai-shu-ju-shi-bai'))
  } finally {
    // 使用 finally 确保 loading 总是被重置
    // 等待 DOM 更新完成
    await nextTick()
    foodLoading.value = false
    console.log('加载完成，重置 loading 状态')
  }
}

// 搜索食物
function onSearchFood() {
  foodList.value = []
  foodPage.value = 1
  foodFinished.value = false
  onLoadFood()
}

// 切换食物选择状态
function onToggleFood(food: API.Food) {
  const index = selectedFoods.value.findIndex(item => item.food.id === food.id)

  if (index >= 0) {
    // 已选中，移除
    selectedFoods.value.splice(index, 1)
  } else {
    // 未选中，添加
    selectedFoods.value.push({
      food,
      quantity: '100' // 默认100g
    })
  }
}

// 更新食物数量
function updateQuantity(foodId: number, quantity: string) {
  const item = selectedFoods.value.find(item => item.food.id === foodId)
  if (item) {
    item.quantity = quantity
  }
}

// 移除已选食物
function removeSelectedFood(foodId: number) {
  const index = selectedFoods.value.findIndex(item => item.food.id === foodId)
  if (index >= 0) {
    selectedFoods.value.splice(index, 1)
  }
}

// 显示添加食物对话框
function showAddFood(mealType: MealType) {
  console.log('showAddFood 被调用', mealType)
  currentMealType.value = mealType
  selectedFoods.value = []
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
  console.log('弹窗已打开，List 组件会自动检测滚动')
  // List 组件移除了 immediate-check=false,会自动检测并触发 load 事件
}

// 确认添加
async function onConfirmAdd() {
  if (selectedFoods.value.length === 0) {
    showToast(t('qing-xuan-ze-zhi-shao-yi-ge-shi-wu'))
    return
  }

  // 验证所有食物都有数量
  const invalidItems = selectedFoods.value.filter(item => !item.quantity || parseFloat(item.quantity) <= 0)
  if (invalidItems.length > 0) {
    showToast(t('qing-wei-suo-you-shi-wu-shu-ru-shi-yong-liang'))
    return
  }

  showLoadingToast({
    message: t('tian-jia-zhong'),
    forbidClick: true,
    duration: 0
  })

  try {
    // 批量添加所有选中的食物
    await Promise.all(
      selectedFoods.value.map(item =>
        postDietRecords({
          food_id: item.food.id!,
          record_date: selectedDate.value,
          meal_type: currentMealType.value,
          quantity: parseFloat(item.quantity)
        })
      )
    )

    closeToast()
    showSuccessToast( t('cheng-gong-tian-jia-selectedfoodsvaluelength-ge-shi-wu', [selectedFoods.value.length]) )
    showAddFoodDialog.value = false

    // 重新加载数据
    await Promise.all([loadDietRecords(), loadSummary()])
  } catch (error: any) {
    closeToast()
    showToast(error.message || t('tian-jia-shi-bai'))
  }
}

// 删除记录
async function onDeleteRecord(id: number) {
  try {
    await showConfirmDialog({
      title: t('ti-shi'),
      message: t('que-ding-yao-shan-chu-zhe-tiao-ji-lu-ma')
    })

    showLoadingToast({
      message: t('shan-chu-zhong'),
      forbidClick: true,
      duration: 0
    })

    await deleteDietRecordsId({ id })

    closeToast()
    showSuccessToast(t('shan-chu-cheng-gong'))

    // 重新加载数据
    await Promise.all([loadDietRecords(), loadSummary()])
  } catch (error: any) {
    if (error !== 'cancel') {
      closeToast()
      showToast(error.message || t('shan-chu-shi-bai'))
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
  padding: $space-sm;
  padding-bottom: 70px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-xs;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  .summary-item {
    text-align: center;
    color: $white;

    .label {
      font-size: $font-size-xs;
      opacity: 0.9;
      display: block;
      margin-bottom: 2px;
    }

    .value {
      font-size: $font-size-base;
      font-weight: bold;
      display: block;
    }
  }
}

.meal-section {
  margin-bottom: $space-sm;

  .nutrition-info {
    font-size: $font-size-xs;
    color: $text-color-3;
    margin-top: 2px;
  }

  // 餐次卡片容器
  .meal-card {
    background: $white;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  // 卡片标题
  .meal-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px $space-sm;
    background: linear-gradient(135deg, var(--gradient-header-start) 0%, var(--gradient-header-end) 100%);
    border-bottom: 1px solid $border-color;

    .meal-title {
      font-size: $font-size-base;
      font-weight: bold;
      color: $text-color;
    }

    .meal-calories {
      font-size: $font-size-sm;
      font-weight: bold;
      color: $primary-color;
    }
  }

  // 添加食物按钮
  .add-food-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    color: $primary-color;
    font-size: $font-size-sm;
    cursor: pointer;
    border-top: 1px dashed $border-color;
    transition: background-color 0.3s;

    &:active {
      background-color: $background-color;
    }

    .van-icon {
      font-size: 16px;
    }
  }

  // 食物卡片网格布局
  .food-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    padding: 6px;
  }

  .food-card {
    position: relative;
    background: $white;
    border-radius: $radius-sm;
    padding: 6px 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid $border-color;

    .delete-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      color: $danger-color;
      font-size: 14px;
      padding: 2px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      z-index: 1;

      &:active {
        background: rgba(255, 255, 255, 1);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
      padding-right: 16px;

      .food-name {
        font-size: $font-size-sm;
        font-weight: 500;
        color: $text-color;
        line-height: 1.2;
        flex: 1;
      }

      .food-quantity {
        font-size: $font-size-xs;
        color: $text-color-3;
        white-space: nowrap;
        margin-left: 4px;
      }
    }

    .card-calories {
      font-size: $font-size-base;
      font-weight: bold;
      color: $primary-color;
      margin-bottom: 4px;
    }

    .card-nutrition {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      font-size: 10px;
      color: $text-color-3;

      span {
        background: $background-color;
        padding: 1px 4px;
        border-radius: 2px;
      }
    }
  }
}

:deep(.van-cell-group) {
  margin-bottom: $space-sm;
}

:deep(.van-cell) {
  padding: 8px $space-sm;

  .van-cell__title {
    font-size: $font-size-sm;
  }

  .van-cell__value {
    font-size: $font-size-sm;
  }
}

:deep(.van-icon-cross) {
  color: $danger-color;
  padding: 2px;
  font-size: 16px;
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
    padding: 6px $space-sm;
    border-bottom: 1px solid $border-color;
    background: $white;

    .title {
      font-size: $font-size-base;
      font-weight: bold;
    }

    // 压缩按钮大小
    :deep(.van-button) {
      height: 28px;
      padding: 0 $space-sm;
      font-size: $font-size-sm;
    }
  }

  .dialog-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    background: $background-color;

    // 压缩搜索框高度
    :deep(.van-search) {
      padding: 4px $space-sm;
      flex-shrink: 0;

      .van-search__content {
        padding-left: $space-xs;
      }
    }

    // 食物列表容器 - 关键修复
    .food-list-section {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      min-height: 0; // 关键:让 flex 子元素正确计算高度
      position: relative;
    }

    // 压缩食物列表项高度
    :deep(.van-cell) {
      padding: 6px $space-sm;

      .van-cell__title {
        margin-bottom: 2px;
      }
    }

    .food-title {
      display: flex;
      align-items: center;
      gap: $space-xs;

      .food-name {
        font-size: $font-size-sm;
        color: $text-color;
      }
    }

    .food-info {
      font-size: $font-size-xs;
      color: $text-color-3;
      margin-top: 2px;
      margin-left: 28px;
    }
  }

  .selected-section {
    background: $white;
    border-top: 2px solid $primary-color;
    max-height: 45%;
    display: flex;
    flex-direction: column;

    .selected-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px $space-sm;
      border-bottom: 1px solid $border-color;
      background: linear-gradient(135deg, var(--gradient-header-start) 0%, var(--gradient-header-end) 100%);

      .title {
        font-size: $font-size-xs;
        font-weight: bold;
        color: $text-color;
      }

      .total-calories {
        font-size: $font-size-xs;
        color: $primary-color;
        font-weight: bold;
      }
    }

    .selected-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px $space-md;

      .selected-item {
        padding: 4px 0;
        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .name {
            font-size: $font-size-sm;
            color: $text-color;
            font-weight: 500;
          }

          .remove-btn {
            color: $danger-color;
            font-size: 14px;
            padding: 2px;
          }
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 6px;

          .unit {
            font-size: $font-size-sm;
            color: $text-color-2;
          }
        }
      }
    }

    .nutrition-total {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      padding: 8px $space-xs;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .total-item {
        text-align: center;

        .label {
          display: block;
          font-size: $font-size-xs;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2px;
        }

        .value {
          display: block;
          font-size: $font-size-sm;
          color: $white;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
