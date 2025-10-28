<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="result-overlay" @click.self="handleConfirm">
        <div class="result-card">
          <!-- 动画图标 -->
          <div class="result-icon-wrapper">
            <div class="result-icon">{{ exercise.icon }}</div>
            <div class="icon-ring"></div>
          </div>

          <!-- 标题 -->
          <h3 class="result-title">{{ t("jian-yi-ni-jin-tian-zuo") }}</h3>

          <!-- 运动名称 -->
          <div class="exercise-name">{{ t(exercise.labelKey) }}</div>

          <!-- 运动描述 -->
          <div class="exercise-desc">{{ t(exercise.descKey) }}</div>

          <!-- 按钮组 -->
          <div class="action-buttons">
            <van-button block plain @click="handleReSelect">
              {{ t("zai-chou-yi-ci") }}
            </van-button>
            <van-button block type="primary" @click="handleConfirm">
              {{ t("que-ding") }}
            </van-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { saveLotteryResult } from "@/constants/exerciseTypes";

const { t } = useI18n();

interface ExerciseOption {
  value: string;
  icon: string;
  labelKey: string;
  descKey: string;
  color: string;
}

interface Props {
  exercise: ExerciseOption;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  reSelect: [];
}>();

const visible = ref(true);

function handleConfirm() {
  // 保存抽奖结果到localStorage
  saveLotteryResult({
    value: props.exercise.value,
    labelKey: props.exercise.labelKey,
    descKey: props.exercise.descKey,
    icon: props.exercise.icon,
    color: props.exercise.color,
  });

  visible.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
}

function handleReSelect() {
  visible.value = false;
  setTimeout(() => {
    emit("reSelect");
    emit("close");
  }, 300);
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

// 全屏遮罩层
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 遮罩淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.result-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  text-align: center;
  width: 90vw;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: resultEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  .result-icon-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: $space-md;

    .result-icon {
      font-size: 80px;
      position: relative;
      z-index: 1;
      animation: iconPulse 1.5s ease-in-out infinite;
    }

    .icon-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        rgba(24, 144, 255, 0.1) 0%,
        rgba(0, 80, 179, 0.1) 100%
      );
      animation: ringPulse 2s ease-in-out infinite;
    }
  }

  .result-title {
    font-size: $font-size-base;
    color: $text-color-2;
    margin: 0 0 $space-sm 0;
    font-weight: 400;
  }

  .exercise-name {
    font-size: $font-size-xl;
    color: $primary-color;
    font-weight: 600;
    margin-bottom: $space-md;
    letter-spacing: 1px;
  }

  .exercise-desc {
    font-size: $font-size-sm;
    color: $text-color-2;
    line-height: 1.8;
    padding: $space-md;
    background: $background-color;
    border-radius: $radius-md;
    margin-bottom: $space-lg;
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-sm;

    .van-button {
      height: 42px;
      font-size: $font-size-xs;
      font-weight: 500;
    }
  }
}

// 结果卡片入场动画
@keyframes resultEnter {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 图标脉冲动画
@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// 光环脉冲动画
@keyframes ringPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}
</style>
