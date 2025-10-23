<template>
  <div class="nutrition-card" data-v-step="2">
    <div class="card-header">
      <h3>{{ t("jin-ri-she-ru") }}</h3>
      <span class="view-more" @click="emit('go-to-diet')">{{
        t("cha-kan-xiang-qing")
      }}</span>
    </div>

    <div v-if="hasNutritionData" class="nutrition-data">
      <!-- 热量进度条 -->
      <div class="nutrition-item calories">
        <div class="item-header">
          <span class="label">{{ t("re-liang") }}</span>
          <span class="value"
            >{{ todayCalories }} <span class="unit">kcal</span></span
          >
        </div>
        <van-progress
          :percentage="caloriesProgress"
          :pivot-text="caloriesProgress + '%'"
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          track-color="#f5f5f5"
        />
      </div>

      <!-- 三大营养素 -->
      <div class="macros-grid">
        <div class="macro-item protein">
          <div class="macro-icon">💪</div>
          <div class="macro-label">{{ t("dan-bai-zhi") }}</div>
          <div class="macro-value">{{ t("todayprotein-g", [todayProtein]) }}</div>
        </div>
        <div class="macro-item carbs">
          <div class="macro-icon">🍚</div>
          <div class="macro-label">{{ t("tan-shui") }}</div>
          <div class="macro-value">{{ t("todaycarbs-g", [todayCarbs]) }}</div>
        </div>
        <div class="macro-item fat">
          <div class="macro-icon">🥑</div>
          <div class="macro-label">{{ t("zhi-fang") }}</div>
          <div class="macro-value">{{ t("todayfat-g", [todayFat]) }}</div>
        </div>
      </div>
    </div>

    <div v-else class="no-nutrition-data">
      <div class="empty-icon">🍴</div>
      <p class="empty-text">{{ t("jin-tian-huan-mei-you-yin-shi-ji-lu") }}</p>
      <van-button type="primary" size="small" round @click="emit('go-to-diet')">
        {{ t("tian-jia-ji-lu") }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface NutritionData {
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
}

interface Props {
  nutritionData: NutritionData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "go-to-diet": [];
}>();

// 是否有营养数据
const hasNutritionData = computed(() => {
  return (props.nutritionData.total_calories || 0) > 0;
});

// 今日热量
const todayCalories = computed(() => {
  return Math.round(props.nutritionData.total_calories || 0);
});

// 今日蛋白质
const todayProtein = computed(() => {
  return Math.round(props.nutritionData.total_protein || 0);
});

// 今日碳水
const todayCarbs = computed(() => {
  return Math.round(props.nutritionData.total_carbs || 0);
});

// 今日脂肪
const todayFat = computed(() => {
  return Math.round(props.nutritionData.total_fat || 0);
});

// 热量进度百分比（假设目标是2000kcal）
const caloriesProgress = computed(() => {
  const target = 2000;
  const current = props.nutritionData.total_calories || 0;
  return Math.min(Math.round((current / target) * 100), 100);
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.nutrition-card {
  background: $white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .card-header {
    @include flex-between;
    align-items: center;
    margin-bottom: $space-sm;

    h3 {
      font-size: $font-size-base;
      color: $text-color;
    }

    .view-more {
      font-size: $font-size-xs;
      color: $primary-color;
      cursor: pointer;

      &:active {
        opacity: 0.7;
      }
    }
  }

  .nutrition-data {
    .nutrition-item {
      margin-bottom: $space-sm;

      .item-header {
        @include flex-between;
        margin-bottom: 4px;

        .label {
          font-size: $font-size-sm;
          color: $text-color-2;
        }

        .value {
          font-size: $font-size-lg;
          color: $text-color;
          font-weight: 600;

          .unit {
            font-size: $font-size-xs;
            font-weight: 400;
            color: $text-color-2;
            margin-left: 2px;
          }
        }
      }
    }

    .macros-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-xs;

      .macro-item {
        text-align: center;
        padding: $space-sm;
        background: $background-color;
        border-radius: $radius-sm;

        .macro-icon {
          font-size: 24px;
          margin-bottom: 2px;
        }

        .macro-label {
          font-size: $font-size-xs;
          color: $text-color-2;
          margin-bottom: 2px;
        }

        .macro-value {
          font-size: $font-size-base;
          color: $text-color;
          font-weight: 600;
        }
      }
    }
  }

  .no-nutrition-data {
    text-align: center;
    padding: $space-md 0;

    .empty-icon {
      font-size: 32px;
      margin-bottom: $space-xs;
    }

    .empty-text {
      font-size: $font-size-sm;
      color: $text-color-2;
      margin-bottom: $space-md;
    }
  }
}
</style>
