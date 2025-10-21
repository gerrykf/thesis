<template>
  <div class="diet">
    <van-nav-bar
      :title="t('utils.quickActions.dietRecord')"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="content">
      <!-- 日期选择 -->
      <van-cell-group>
        <van-cell is-link :value="selectedDate" @click="showDatePicker = true">
          <template #title>
            <span>{{ t("xuan-ze-ri-qi-0") }}</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 营养摘要 -->
      <NutritionSummary :summary="summary" />

      <!-- 早餐 -->
      <MealCard
        meal-type="breakfast"
        :meal-title="t('zao-can')"
        :records="breakfastRecords"
        @add="showAddFood('breakfast')"
        @delete="onDeleteRecord"
      />

      <!-- 午餐 -->
      <MealCard
        meal-type="lunch"
        :meal-title="t('wu-can')"
        :records="lunchRecords"
        @add="showAddFood('lunch')"
        @delete="onDeleteRecord"
      />

      <!-- 晚餐 -->
      <MealCard
        meal-type="dinner"
        :meal-title="t('wan-can')"
        :records="dinnerRecords"
        @add="showAddFood('dinner')"
        @delete="onDeleteRecord"
      />

      <!-- 加餐 -->
      <MealCard
        meal-type="snack"
        :meal-title="t('jia-can')"
        :records="snackRecords"
        @add="showAddFood('snack')"
        @delete="onDeleteRecord"
      />
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
    <AddFoodDialog
      v-model:show="showAddFoodDialog"
      v-model:search-keyword="searchKeyword"
      v-model:food-loading="foodLoading"
      :food-categories="foodCategories"
      :selected-category="selectedCategory"
      :food-list="foodList"
      :food-finished="foodFinished"
      :selected-foods="selectedFoods"
      @search="onSearchFood"
      @select-category="onSelectCategory"
      @load-food="onLoadFood"
      @toggle-food="onToggleFood"
      @remove-selected-food="removeSelectedFood"
      @update-quantity="updateQuantity"
      @confirm="onConfirmAdd"
      @reload-food="onReloadFood"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  showSuccessToast,
  showLoadingToast,
  closeToast,
  showToast,
  showConfirmDialog,
} from "vant";
import {
  getDietRecords,
  postDietRecords,
  deleteDietRecordsId,
  getDietSummary,
} from "@/api/diet";
import { getFoods, getFoodsCategories } from "@/api/food";
import { useI18n } from "vue-i18n";
import NutritionSummary from "./components/NutritionSummary.vue";
import MealCard from "./components/MealCard.vue";
import AddFoodDialog from "./components/AddFoodDialog.vue";

const { t } = useI18n();
const router = useRouter();

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// 日期相关
const selectedDate = ref(formatDate());
const showDatePicker = ref(false);
const currentDate = ref([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate()),
]);
const minDate = new Date(2020, 0, 1);
const maxDate = new Date();

// 饮食记录
const dietRecords = ref<API.DietRecord[]>([]);
const summary = ref<{
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
  meal_breakdown?: Record<string, any>;
}>({});

// 添加食物相关
const showAddFoodDialog = ref(false);
const currentMealType = ref<MealType>("breakfast");
const searchKeyword = ref("");
const foodList = ref<API.Food[]>([]);
const foodLoading = ref(false);
const foodFinished = ref(false);
const foodPage = ref(1);

// 食物分类相关
const foodCategories = ref<{ category?: string; count?: number }[]>([]);
const selectedCategory = ref<string>("");

// 多选食物相关
interface SelectedFoodItem {
  food: API.Food;
  quantity: string;
}
const selectedFoods = ref<SelectedFoodItem[]>([]);

// 格式化日期
function formatDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 格式化日期数组
function formatDateArray(value: any) {
  const selectedValues = value.selectedValues || value;
  return `${selectedValues[0]}-${String(selectedValues[1]).padStart(
    2,
    "0"
  )}-${String(selectedValues[2]).padStart(2, "0")}`;
}

// 按餐次分组的记录
const breakfastRecords = computed(() =>
  dietRecords.value.filter((r) => r.meal_type === "breakfast")
);
const lunchRecords = computed(() =>
  dietRecords.value.filter((r) => r.meal_type === "lunch")
);
const dinnerRecords = computed(() =>
  dietRecords.value.filter((r) => r.meal_type === "dinner")
);
const snackRecords = computed(() =>
  dietRecords.value.filter((r) => r.meal_type === "snack")
);

// 加载饮食记录
async function loadDietRecords() {
  try {
    const response = await getDietRecords({
      date: selectedDate.value,
      limit: 100,
    });

    const records = (response as any).data?.records || [];
    dietRecords.value = records;
  } catch (error) {
    console.error("加载饮食记录失败:", error);
  }
}

// 加载营养摘要
async function loadSummary() {
  try {
    const response = await getDietSummary({
      date: selectedDate.value,
    });

    summary.value = (response as any).data || {};
  } catch (error) {
    console.error("加载营养摘要失败:", error);
  }
}

// 加载食物列表
async function onLoadFood() {
  if (foodFinished.value) {
    return;
  }

  try {
    const response = await getFoods({
      page: foodPage.value,
      limit: 20,
      search: searchKeyword.value,
      category: selectedCategory.value || undefined,
    });

    const foods = (response as any).data?.foods || [];
    const pagination = (response as any).data?.pagination || {};

    if (foods.length > 0) {
      foodList.value.push(...foods);
      foodPage.value++;
    }

    if (foods.length === 0 || pagination.page >= pagination.totalPages) {
      foodFinished.value = true;
    }
  } catch (error) {
    console.error("加载食物列表失败:", error);
    showToast(t("jia-zai-shu-ju-shi-bai"));
  } finally {
    await nextTick();
    foodLoading.value = false;
  }
}

// 搜索食物
function onSearchFood() {
  foodList.value = [];
  foodPage.value = 1;
  foodFinished.value = false;
  onLoadFood();
}

// 获取食物分类列表
async function loadFoodCategories() {
  try {
    const response = await getFoodsCategories();
    const categories = (response as any).data || [];
    foodCategories.value = categories;
  } catch (error) {
    console.error("获取分类失败:", error);
  }
}

// 选择分类
function onSelectCategory(category: string) {
  selectedCategory.value = category;
  foodList.value = [];
  foodPage.value = 1;
  foodFinished.value = false;
  onLoadFood();
}

// 重新加载食物列表
function onReloadFood() {
  foodList.value = [];
  foodPage.value = 1;
  foodFinished.value = false;
  // 重新加载分类列表
  loadFoodCategories();
  // 重新加载食物列表
  onLoadFood();
}

// 切换食物选择状态
function onToggleFood(food: API.Food) {
  const index = selectedFoods.value.findIndex(
    (item) => item.food.id === food.id
  );

  if (index >= 0) {
    selectedFoods.value.splice(index, 1);
  } else {
    selectedFoods.value.push({
      food,
      quantity: "100",
    });
  }
}

// 更新食物数量
function updateQuantity(foodId: number, quantity: string) {
  const item = selectedFoods.value.find((item) => item.food.id === foodId);
  if (item) {
    item.quantity = quantity;
  }
}

// 移除已选食物
function removeSelectedFood(foodId: number) {
  const index = selectedFoods.value.findIndex(
    (item) => item.food.id === foodId
  );
  if (index >= 0) {
    selectedFoods.value.splice(index, 1);
  }
}

// 显示添加食物对话框
function showAddFood(mealType: MealType) {
  currentMealType.value = mealType;
  selectedFoods.value = [];
  searchKeyword.value = "";
  selectedCategory.value = "";

  foodList.value = [];
  foodPage.value = 1;
  foodFinished.value = false;
  foodLoading.value = false;

  loadFoodCategories();
  showAddFoodDialog.value = true;
}

// 确认添加
async function onConfirmAdd() {
  if (selectedFoods.value.length === 0) {
    showToast(t("qing-xuan-ze-zhi-shao-yi-ge-shi-wu"));
    return;
  }

  const invalidItems = selectedFoods.value.filter(
    (item) => !item.quantity || parseFloat(item.quantity) <= 0
  );
  if (invalidItems.length > 0) {
    showToast(t("qing-wei-suo-you-shi-wu-shu-ru-shi-yong-liang"));
    return;
  }

  showLoadingToast({
    message: t("tian-jia-zhong"),
    forbidClick: true,
    duration: 0,
  });

  try {
    await Promise.all(
      selectedFoods.value.map((item) =>
        postDietRecords({
          food_id: item.food.id!,
          record_date: selectedDate.value,
          meal_type: currentMealType.value,
          quantity: parseFloat(item.quantity),
        })
      )
    );

    closeToast();
    showSuccessToast(
      t("cheng-gong-tian-jia-selectedfoodsvaluelength-ge-shi-wu", [
        selectedFoods.value.length,
      ])
    );
    showAddFoodDialog.value = false;

    await Promise.all([loadDietRecords(), loadSummary()]);
  } catch (error: any) {
    closeToast();
    showToast(error.message || t("tian-jia-shi-bai"));
  }
}

// 删除记录
async function onDeleteRecord(id: number) {
  try {
    await showConfirmDialog({
      title: t("ti-shi"),
      message: t("que-ding-yao-shan-chu-zhe-tiao-ji-lu-ma"),
    });

    showLoadingToast({
      message: t("shan-chu-zhong"),
      forbidClick: true,
      duration: 0,
    });

    await deleteDietRecordsId({ id });

    closeToast();
    showSuccessToast(t("shan-chu-cheng-gong"));

    await Promise.all([loadDietRecords(), loadSummary()]);
  } catch (error: any) {
    if (error !== "cancel") {
      closeToast();
      showToast(error.message || t("shan-chu-shi-bai"));
    }
  }
}

// 日期确认
function onDateConfirm(value: any) {
  selectedDate.value = formatDateArray(value);
  showDatePicker.value = false;
}

// 返回
function onClickLeft() {
  router.back();
}

// 监听日期变化
watch(selectedDate, () => {
  loadDietRecords();
  loadSummary();
});

// 初始化
onMounted(() => {
  loadDietRecords();
  loadSummary();
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.diet {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-sm;
  padding-bottom: 70px;
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
</style>
