<template>
  <div class="meal-section">
    <div class="meal-card">
      <!-- 卡片标题 -->
      <div class="meal-card-header">
        <span class="meal-title">{{ mealTitle }}</span>
        <span class="meal-calories">{{ mealCaloriesText }}</span>
      </div>

      <!-- 食物卡片网格 -->
      <div class="food-cards-grid" v-if="records.length > 0">
        <div v-for="item in records" :key="item.id" class="food-card">
          <van-icon
            name="cross"
            class="delete-icon"
            @click="$emit('delete', item.id!)"
          />
          <div class="card-header">
            <span class="food-name">{{ item.food_name }}</span>
            <span class="food-quantity">{{ item.quantity }}g</span>
          </div>
          <div class="card-calories">{{ item.calories }} kcal</div>
          <div class="card-nutrition">
            <span>蛋白{{ item.protein }}g</span>
            <span>脂肪{{ item.fat }}g</span>
            <span>碳水{{ item.carbs }}g</span>
          </div>
        </div>
      </div>

      <!-- 添加按钮 -->
      <div class="add-food-btn" @click="$emit('add')">
        <van-icon name="plus" />
        <span>{{ t("tian-jia-shi-wu") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  records: API.DietRecord[];
  mealTitle: string;
}

const props = defineProps<Props>();

defineEmits<{
  add: [];
  delete: [id: number];
}>();

const mealCaloriesText = computed(() => {
  const total = props.records.reduce(
    (sum, r) => sum + (Number(r.calories) || 0),
    0
  );
  return `${total.toFixed(0)} kcal`;
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

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
    background: linear-gradient(
      135deg,
      var(--gradient-header-start) 0%,
      var(--gradient-header-end) 100%
    );
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
</style>
