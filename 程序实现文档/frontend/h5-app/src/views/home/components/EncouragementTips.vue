<template>
  <!-- 只在数据准备好且有消息时才显示 -->
  <Transition name="fade-slide">
    <div v-if="showTips && finalMessage" class="encouragement-tips">
      <div class="tip-item">
        <span class="tip-text">{{ finalMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
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
  loading?: boolean; // 添加 loading 状态
}

const props = defineProps<Props>();

// 控制显示时机，避免闪烁
const showTips = ref(false);

// 计算最终显示的消息（只显示一条）
const finalMessage = computed(() => {
  // 如果正在加载，不显示
  if (props.loading) {
    return "";
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
    return t("encouragement.all-completed");
  }

  // 收集所有符合条件的消息
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
  if (
    props.nutritionData.total_calories &&
    props.nutritionData.total_calories > 0
  ) {
    messages.push(t("encouragement.diet-recorded"));
  }

  // 如果有消息，随机选择一条显示
  if (messages.length > 0) {
    // 优先显示最重要的消息（第一条）
    // 或者添加一条额外的鼓励语
    const extraMessages = [
      "encouragement.keep-going",
      "encouragement.great-start",
      "encouragement.excellent-habit",
      "encouragement.stay-motivated",
      "encouragement.well-done",
    ];

    // 50% 概率显示主消息，50% 显示额外鼓励
    if (Math.random() > 0.5) {
      return messages[0];
    } else {
      const randomIndex = Math.floor(Math.random() * extraMessages.length);
      const extraMessage = extraMessages[randomIndex];
      return extraMessage ? t(extraMessage) : messages[0];
    }
  }

  return "";
});

// 监听消息变化，延迟显示避免闪烁
watch(
  finalMessage,
  (newMessage) => {
    if (newMessage) {
      // 延迟一点显示，确保数据稳定
      showTips.value = false;
      nextTick(() => {
        setTimeout(() => {
          showTips.value = true;
        }, 100);
      });
    } else {
      showTips.value = false;
    }
  },
  { immediate: true }
);
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

// 淡入滑动动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
