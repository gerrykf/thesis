/**
 * Diet模块自定义Hooks
 */

import { ref, computed } from 'vue'
import type { Food, MealType } from './types'
import { calculateTotalCalories } from './index'

/**
 * 使用餐次管理Hook
 */
export function useMealManagement() {
  const breakfastList = ref<Food[]>([])
  const lunchList = ref<Food[]>([])
  const dinnerList = ref<Food[]>([])
  const snackList = ref<Food[]>([])

  const breakfastCalories = computed(() => calculateTotalCalories(breakfastList.value))
  const lunchCalories = computed(() => calculateTotalCalories(lunchList.value))
  const dinnerCalories = computed(() => calculateTotalCalories(dinnerList.value))
  const snackCalories = computed(() => calculateTotalCalories(snackList.value))
  const totalCalories = computed(() =>
    breakfastCalories.value + lunchCalories.value + dinnerCalories.value + snackCalories.value
  )

  /**
   * 添加食物
   */
  function addFood(mealType: MealType, food: Food) {
    const listMap = {
      breakfast: breakfastList,
      lunch: lunchList,
      dinner: dinnerList,
      snack: snackList
    }
    listMap[mealType].value.push(food)
  }

  /**
   * 移除食物
   */
  function removeFood(mealType: MealType, index: number) {
    const listMap = {
      breakfast: breakfastList,
      lunch: lunchList,
      dinner: dinnerList,
      snack: snackList
    }
    listMap[mealType].value.splice(index, 1)
  }

  /**
   * 清空指定餐次
   */
  function clearMeal(mealType: MealType) {
    const listMap = {
      breakfast: breakfastList,
      lunch: lunchList,
      dinner: dinnerList,
      snack: snackList
    }
    listMap[mealType].value = []
  }

  /**
   * 清空所有餐次
   */
  function clearAllMeals() {
    breakfastList.value = []
    lunchList.value = []
    dinnerList.value = []
    snackList.value = []
  }

  return {
    breakfastList,
    lunchList,
    dinnerList,
    snackList,
    breakfastCalories,
    lunchCalories,
    dinnerCalories,
    snackCalories,
    totalCalories,
    addFood,
    removeFood,
    clearMeal,
    clearAllMeals
  }
}

/**
 * 使用食物搜索Hook
 */
export function useFoodSearch() {
  const searchKeyword = ref('')
  const searchResults = ref<Food[]>([])
  const isSearching = ref(false)

  /**
   * 搜索食物
   */
  async function searchFoods(keyword: string) {
    searchKeyword.value = keyword
    isSearching.value = true

    // TODO: 实际项目中应该调用API
    // 这里使用模拟数据
    setTimeout(() => {
      // searchResults.value = await api.searchFoods(keyword)
      isSearching.value = false
    }, 300)
  }

  /**
   * 清空搜索
   */
  function clearSearch() {
    searchKeyword.value = ''
    searchResults.value = []
  }

  return {
    searchKeyword,
    searchResults,
    isSearching,
    searchFoods,
    clearSearch
  }
}
