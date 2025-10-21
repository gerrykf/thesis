<template>
  <div class="summary-card" v-if="hasSummary">
    <div class="summary-item">
      <span class="label">{{ t("re-liang") }}</span>
      <span class="value">{{
        t("summary-total_calories-or-or-0-kcal", [summary.total_calories || 0])
      }}</span>
    </div>
    <div class="summary-item">
      <span class="label">{{ t("dan-bai-zhi") }}</span>
      <span class="value">{{
        t("summary-total_protein-or-or-0-g", [summary.total_protein || 0])
      }}</span>
    </div>
    <div class="summary-item">
      <span class="label">{{ t("zhi-fang") }}</span>
      <span class="value">{{
        t("summary-total_fat-or-or-0-g", [summary.total_fat || 0])
      }}</span>
    </div>
    <div class="summary-item">
      <span class="label">{{ t("tan-shui") }}</span>
      <span class="value">{{
        t("summary-total_carbs-or-or-0-g", [summary.total_carbs || 0])
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  summary: {
    total_calories?: number;
    total_protein?: number;
    total_fat?: number;
    total_carbs?: number;
    meal_breakdown?: Record<string, any>;
  };
}

const props = defineProps<Props>();

const hasSummary = computed(() => {
  return (props.summary.total_calories || 0) > 0;
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

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
</style>
