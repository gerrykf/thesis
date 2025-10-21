<template>
  <van-popup
    :show="show"
    @update:show="emit('update:show', $event)"
    position="bottom"
    :style="{ height: '100%', left: '0', width: '100%' }"
    @opened="handleDialogOpened"
  >
    <div class="add-food-dialog" v-if="show">
      <div class="dialog-header">
        <van-button plain @click="emit('update:show', false)">{{
          t("common.cancel")
        }}</van-button>
        <span class="title">{{ t("tian-jia-shi-wu-3") }}</span>
        <van-button plain type="primary" @click="emit('confirm')">
          {{ t("que-ding")
          }}<span v-if="selectedFoods.length > 0">{{
            t("selectedfoods-length", [selectedFoods.length])
          }}</span>
        </van-button>
      </div>

      <div class="dialog-content">
        <!-- 搜索框 -->
        <van-search
          :model-value="searchKeyword"
          @update:model-value="emit('update:search-keyword', $event)"
          :placeholder="t('sou-suo-shi-wu')"
          @search="emit('search')"
          @clear="emit('search')"
          @click-right-icon="emit('search')"
          :left-icon="''"
        >
          <template #right-icon>
            <van-icon name="search" />
          </template>
        </van-search>

        <!-- 食物分类选择 -->
        <FoodCategorySwiper
          :categories="foodCategories"
          :selected-category="selectedCategory"
          @select="emit('select-category', $event)"
        />

        <!-- 食物列表容器 -->
        <div class="food-list-section" ref="listContainerRef">
          <!-- 空状态 -->
          <van-empty
            v-if="foodList.length === 0 && !foodLoading && foodFinished"
            :description="t('暂无数据')"
          >
            <div class="empty-action">
              <p class="empty-text">{{ t("没有找到相关食物") }}</p>
              <van-button
                type="primary"
                round
                @click="showAddForm = true"
                class="empty-add-btn"
              >
                <van-icon name="plus" />
                {{ t("添加新食物") }}
              </van-button>
            </div>
          </van-empty>

          <van-list
            v-else
            :loading="foodLoading"
            @update:loading="emit('update:food-loading', $event)"
            :finished="foodFinished"
            @load="emit('load-food')"
            :offset="300"
          >
            <template #finished>
              <div class="finished-text">
                <div class="empty-hint">
                  <van-icon name="search" class="search-icon" />
                  <p class="hint-title">{{ t("没有找到你想要的?") }}</p>
                  <p class="hint-desc">{{ t("试试添加新食物吧") }}</p>
                </div>
                <van-button
                  type="primary"
                  round
                  block
                  @click="showAddForm = true"
                  class="add-food-btn"
                >
                  <van-icon name="plus" />
                  {{ t("添加新食物") }}
                </van-button>
              </div>
            </template>
            <van-cell
              v-for="food in foodList"
              :key="food.id"
              @click="emit('toggle-food', food)"
              clickable
            >
              <template #title>
                <div class="food-title">
                  <van-checkbox
                    :model-value="isFoodSelected(food.id!)"
                    @click.stop="emit('toggle-food', food)"
                  />
                  <span class="food-name">{{ food.name }}</span>
                </div>
              </template>
              <template #label>
                <span class="food-info">
                  {{
                    t("foodcategory-mei-100g-foodcaloriesper100g-kcal", [
                      food.category,
                      food.calories_per_100g,
                    ])
                  }}
                </span>
              </template>
            </van-cell>
          </van-list>
        </div>
      </div>

      <!-- 已选食物列表和营养汇总 -->
      <SelectedFoodsSection
        :selected-foods="selectedFoods"
        @remove="(foodId) => emit('remove-selected-food', foodId)"
        @update-quantity="
          (foodId, quantity) => emit('update-quantity', foodId, quantity)
        "
      />
    </div>

    <!-- 添加食物表单 -->
    <AddFoodForm
      v-model:show="showAddForm"
      :categories="foodCategories"
      @success="handleAddSuccess"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import FoodCategorySwiper from "./FoodCategorySwiper.vue";
import SelectedFoodsSection from "./SelectedFoodsSection.vue";
import AddFoodForm from "./AddFoodForm.vue";

const { t } = useI18n();

// 添加食物表单状态
const showAddForm = ref(false);

interface SelectedFoodItem {
  food: API.Food;
  quantity: string;
}

interface Props {
  show: boolean;
  searchKeyword: string;
  foodCategories: { category?: string; count?: number }[];
  selectedCategory: string;
  foodList: API.Food[];
  foodLoading: boolean;
  foodFinished: boolean;
  selectedFoods: SelectedFoodItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  "update:search-keyword": [value: string];
  "update:food-loading": [value: boolean];
  search: [];
  "select-category": [category: string];
  "load-food": [];
  "toggle-food": [food: API.Food];
  "remove-selected-food": [foodId: number];
  "update-quantity": [foodId: number, quantity: string];
  confirm: [];
  "reload-food": [];
}>();

function isFoodSelected(foodId: number) {
  return props.selectedFoods?.some((item) => item.food.id === foodId) || false;
}

function handleDialogOpened() {
  // 弹窗打开后的处理
}

// 添加食物成功后的处理
function handleAddSuccess() {
  showAddForm.value = false;
  // 通知父组件重新加载食物列表
  emit("reload-food");
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

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

    :deep(.van-search) {
      padding: 4px $space-sm;
      flex-shrink: 0;

      .van-search__content {
        padding-left: $space-xs;
      }
    }

    .food-list-section {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      min-height: 0;
      position: relative;

      .empty-action {
        padding: $space-lg;
        text-align: center;

        .empty-text {
          font-size: $font-size-base;
          color: $text-color-2;
          margin: $space-md 0 $space-lg 0;
        }

        .empty-add-btn {
          padding: 0 $space-xl;
          height: 40px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

          :deep(.van-icon) {
            margin-right: $space-xs;
          }
        }
      }
    }

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

    .finished-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-lg;
      padding: $space-xl $space-lg;
      background: linear-gradient(
        180deg,
        rgba(102, 126, 234, 0.03) 0%,
        rgba(118, 75, 162, 0.05) 100%
      );

      .empty-hint {
        text-align: center;

        .search-icon {
          font-size: 48px;
          color: $text-color-3;
          margin-bottom: $space-sm;
          opacity: 0.5;
        }

        .hint-title {
          font-size: $font-size-lg;
          color: $text-color;
          font-weight: 500;
          margin: 0 0 $space-xs 0;
        }

        .hint-desc {
          font-size: $font-size-sm;
          color: $text-color-3;
          margin: 0;
        }
      }

      .add-food-btn {
        width: 100%;
        max-width: 280px;
        height: 44px;
        font-size: $font-size-base;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        :deep(.van-icon) {
          margin-right: $space-xs;
        }
      }
    }
  }
}
</style>
