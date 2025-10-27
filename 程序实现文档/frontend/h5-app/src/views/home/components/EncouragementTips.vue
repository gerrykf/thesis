<template>
  <div v-if="encouragementMessages.length > 0" class="encouragement-tips">
    <div
      v-for="(message, index) in encouragementMessages"
      :key="index"
      class="tip-item"
    >
      <span class="tip-text">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface TodayData {
  mood?: string;
  weight?: number;
  exercise?: number;
  exercise_type?: string;
  sleep?: number;
  sleep_quality?: string;
}

interface NutritionData {
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
}

interface Props {
  hasCheckedIn: boolean;
  todayData: TodayData;
  nutritionData: NutritionData;
}

const props = defineProps<Props>();

// 计算鼓励消息
const encouragementMessages = computed(() => {
  const messages: string[] = [];

  // 如果已打卡健康数据
  if (props.hasCheckedIn) {
    messages.push(t("encouragement.health-checked"));

    // 如果运动数据存在且大于0
    if (props.todayData.exercise && props.todayData.exercise > 0) {
      messages.push(t("encouragement.exercise-completed"));
    }

    // 如果睡眠充足（大于等于7小时）
    if (props.todayData.sleep && props.todayData.sleep >= 7) {
      messages.push(t("encouragement.sleep-good"));
    }
  }

  // 如果有饮食记录
  if (props.nutritionData.total_calories && props.nutritionData.total_calories > 0) {
    messages.push(t("encouragement.diet-recorded"));
  }

  // 如果所有数据都完整（健康打卡 + 饮食记录 + 运动 + 睡眠充足）
  if (
    props.hasCheckedIn &&
    props.todayData.exercise &&
    props.todayData.exercise > 0 &&
    props.todayData.sleep &&
    props.todayData.sleep >= 7 &&
    props.nutritionData.total_calories &&
    props.nutritionData.total_calories > 0
  ) {
    // 替换为完美的一天消息
    return [t("encouragement.all-completed")];
  }

  // 随机添加一条额外的鼓励语（如果有消息的话）
  if (messages.length > 0) {
    const extraMessages = [
      "encouragement.keep-going",
      "encouragement.great-start",
      "encouragement.excellent-habit",
      "encouragement.stay-motivated",
      "encouragement.well-done",
    ];
    const randomIndex = Math.floor(Math.random() * extraMessages.length);
    const extraMessage = extraMessages[randomIndex];
    if (extraMessage) {
      messages.push(t(extraMessage));
    }
  }

  return messages;
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.encouragement-tips {
  margin-bottom: $space-sm;
  display: flex;
  flex-direction: column;
  gap: $space-xs;

  .tip-item {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    padding: $space-sm $space-md;
    border-radius: $radius-sm;
    border-left: 4px solid $success-color;
    box-shadow: 0 2px 6px rgba(7, 193, 96, 0.1);
    animation: slideIn 0.3s ease-out;

    .tip-text {
      font-size: $font-size-sm;
      color: #2e7d32;
      font-weight: 500;
      line-height: 1.5;
    }
  }
}

// 深色主题适配
[data-theme="dark"] {
  .encouragement-tips {
    .tip-item {
      background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
      border-left-color: #4caf50;
      box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);

      .tip-text {
        color: #a5d6a7;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
