<template>
  <div v-if="selectedFoods.length > 0" class="selected-section">
    <div class="selected-header">
      <span class="title">{{
        t("yi-xuan-shi-wu-selectedfoodslength", [selectedFoods.length])
      }}</span>
      <span class="total-calories">{{
        t("zong-ji-totalnutritioncalories-kcal", [totalNutrition.calories])
      }}</span>
    </div>

    <div class="selected-list">
      <div
        v-for="item in selectedFoods"
        :key="item.food.id"
        class="selected-item"
      >
        <div class="item-info">
          <span class="name">{{ item.food.name }}</span>
          <van-icon
            name="cross"
            @click="$emit('remove', item.food.id!)"
            class="remove-btn"
          />
        </div>
        <div class="item-quantity">
          <van-stepper
            :model-value="item.quantity"
            @update:model-value="
              (val) => $emit('update-quantity', item.food.id!, val)
            "
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
        <span class="label">{{ t("re-liang") }}</span>
        <span class="value">{{
          t("totalnutrition-calories-kcal", [totalNutrition.calories])
        }}</span>
      </div>
      <div class="total-item">
        <span class="label">{{ t("dan-bai-zhi") }}</span>
        <span class="value">{{
          t("totalnutrition-protein-g", [totalNutrition.protein])
        }}</span>
      </div>
      <div class="total-item">
        <span class="label">{{ t("zhi-fang") }}</span>
        <span class="value">{{
          t("totalnutrition-fat-g", [totalNutrition.fat])
        }}</span>
      </div>
      <div class="total-item">
        <span class="label">{{ t("tan-shui") }}</span>
        <span class="value">{{
          t("totalnutrition-carbs-g", [totalNutrition.carbs])
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface SelectedFoodItem {
  food: API.Food;
  quantity: string;
}

interface Props {
  selectedFoods: SelectedFoodItem[];
}

const props = defineProps<Props>();

defineEmits<{
  remove: [foodId: number];
  "update-quantity": [foodId: number, quantity: string];
}>();

const totalNutrition = computed(() => {
  let calories = 0;
  let protein = 0;
  let fat = 0;
  let carbs = 0;

  props.selectedFoods.forEach((item) => {
    const q = parseFloat(item.quantity) || 0;
    if (q > 0) {
      const factor = q / 100;
      calories += (item.food.calories_per_100g || 0) * factor;
      protein += (item.food.protein_per_100g || 0) * factor;
      fat += (item.food.fat_per_100g || 0) * factor;
      carbs += (item.food.carbs_per_100g || 0) * factor;
    }
  });

  return {
    calories: calories.toFixed(1),
    protein: protein.toFixed(1),
    fat: fat.toFixed(1),
    carbs: carbs.toFixed(1),
  };
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

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
    background: linear-gradient(
      135deg,
      var(--gradient-header-start) 0%,
      var(--gradient-header-end) 100%
    );

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
    background: linear-gradient(180deg, var(--gradient-primary-start) 10%, var(--gradient-primary-end) 40%);

    .total-item {
      text-align: center;

      .label {
        display: block;
        font-size: $font-size-xs;
        color: $text-color-2;
        margin-bottom: 2px;
      }

      .value {
        display: block;
        font-size: $font-size-sm;
        color: $text-color;
        font-weight: bold;
      }
    }
  }
}
</style>
