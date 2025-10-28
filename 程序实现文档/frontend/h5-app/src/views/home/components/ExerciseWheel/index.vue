<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="exercise-wheel-overlay">
        <div class="exercise-wheel-container" :class="animationClass">
          <div class="wheel-wrapper">
            <!-- 旋转轮盘 -->
            <div
              class="wheel"
              :style="{ transform: `rotate(${currentRotation}deg)` }"
              :class="{ spinning: isSpinning }"
            >
              <div
                v-for="(item, index) in exerciseOptions"
                :key="index"
                class="wheel-sector"
                :style="{
                  transform: `rotate(${(360 / exerciseOptions.length) * index}deg)`,
                  background: item.color,
                }"
              >
                <div class="sector-icon">{{ item.icon }}</div>
              </div>
            </div>

            <!-- 中心按钮 -->
            <div class="wheel-center" @click="spinWheel">
              <div class="center-button" :class="{ disabled: isSpinning }">
                <span v-if="!isSpinning">{{ t("kai-shi") }}</span>
                <span v-else class="loading">⏳</span>
              </div>
            </div>
          </div>

          <!-- 关闭按钮 -->
          <div class="close-button" @click="handleClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { getRandomExerciseTypes } from "@/constants/exerciseTypes";

const { t } = useI18n();

const emit = defineEmits<{
  close: [];
  result: [exercise: ExerciseOption];
}>();

const visible = ref(true);
const isSpinning = ref(false);
const currentRotation = ref(0);
const selectedExercise = ref<ExerciseOption | null>(null);
const animationClass = ref("wheel-enter");

interface ExerciseOption {
  value: string;
  icon: string;
  labelKey: string;
  descKey: string;
  color: string;
}

// 渐变色配置
const gradientColors = [
  "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

// 从共享数据中随机选择6个运动类型
const randomTypes = getRandomExerciseTypes(6);
const exerciseOptions: ExerciseOption[] = randomTypes.map((type, index) => ({
  value: type.value,
  icon: type.icon,
  labelKey: type.labelKey,
  descKey: type.descKey,
  color: gradientColors[index % gradientColors.length] || "#1890ff",
}));

// 旋转轮盘
function spinWheel() {
  if (isSpinning.value) return;

  isSpinning.value = true;
  selectedExercise.value = null;

  // 随机选择一个运动
  const randomIndex = Math.floor(Math.random() * exerciseOptions.length);
  const targetRotation =
    360 * 5 + // 转5圈
    360 -
    (360 / exerciseOptions.length) * randomIndex - // 目标位置
    360 / exerciseOptions.length / 2; // 居中对齐

  currentRotation.value += targetRotation;

  // 3秒后停止，然后执行退场动画
  setTimeout(() => {
    isSpinning.value = false;
    selectedExercise.value = exerciseOptions[randomIndex] || null;

    // 停止后等待0.5秒，然后开始退场动画
    setTimeout(() => {
      animationClass.value = "wheel-exit";

      // 退场动画完成后，发送结果并关闭
      setTimeout(() => {
        if (selectedExercise.value) {
          emit("result", selectedExercise.value);
        }
        visible.value = false;
        setTimeout(() => {
          emit("close");
        }, 100);
      }, 600); // 等待退场动画完成
    }, 500);
  }, 3000);
}

function handleClose() {
  animationClass.value = "wheel-exit";
  setTimeout(() => {
    visible.value = false;
    setTimeout(() => {
      emit("close");
    }, 100);
  }, 600);
}

// 入场动画
onMounted(() => {
  animationClass.value = "wheel-enter";
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

// 全屏遮罩层
.exercise-wheel-overlay {
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

.exercise-wheel-container {
  // 入场动画：从底部缩放进入
  &.wheel-enter {
    animation: wheelEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  // 退场动画：缩小到底部
  &.wheel-exit {
    animation: wheelExit 0.6s cubic-bezier(0.6, 0.04, 0.98, 0.34) forwards;
  }

  .wheel-wrapper {
    position: relative;
    width: 92vw;
    max-width: 450px;
    aspect-ratio: 1;

    // 外圈装饰圆环
    &::before {
      content: "";
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      background: linear-gradient(45deg, #1890ff, #0050b3, #40a9ff, #1890ff);
      background-size: 300% 300%;
      animation: gradientRotate 3s ease infinite;
      z-index: -1;
    }


    .wheel {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
      box-shadow:
        0 0 20px rgba(24, 144, 255, 0.3),
        0 10px 40px rgba(0, 0, 0, 0.25),
        inset 0 0 60px rgba(255, 255, 255, 0.15);
      overflow: hidden;
      box-sizing: border-box;

      &.spinning {
        transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
      }

      // 内圈光晕效果
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30%;
        height: 30%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
      }

      .wheel-sector {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-origin: center center;
        // 精确的60度扇形（360/6=60度）
        clip-path: polygon(
          50% 50%, // 圆心
          50% 0%, // 0度 - 顶部正中
          54.36% 0.19%, // 5度
          58.68% 0.76%, // 10度
          62.94% 1.71%, // 15度
          67.1% 3.02%, // 20度
          71.13% 4.69%, // 25度
          75% 6.7%, // 30度
          78.68% 9.04%, // 35度
          82.14% 11.7%, // 40度
          85.36% 14.65%, // 45度
          88.3% 17.86%, // 50度
          90.96% 21.32%, // 55度
          93.3% 25%, // 60度
          50% 50% // 回到圆心
        );
        transition: all 0.3s ease;

        // 添加内部渐变叠加层，增加立体感
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 35% 35%,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 40%,
            transparent 70%
          );
          clip-path: inherit;
          pointer-events: none;
        }

        // 扇形边框（分隔线）- 更精致的设计
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50%;
          height: 2px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.3) 100%
          );
          transform-origin: left center;
          transform: translateY(-50%);
          box-shadow:
            0 1px 2px rgba(255, 255, 255, 0.8),
            0 -1px 2px rgba(0, 0, 0, 0.2);
        }

        .sector-icon {
          position: absolute;
          top: 22%;
          left: 66%;
          transform: translate(-50%, -50%);
          font-size: clamp(36px, 8vw, 48px);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))
                  drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          z-index: 1;
          animation: iconFloat 2s ease-in-out infinite;
        }
      }
    }

    .wheel-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 28%;
      max-width: 110px;
      aspect-ratio: 1;
      z-index: 101;

      // 指针 - 三角形，指向上方
      &::before {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 20px solid #ff4757;
        filter: drop-shadow(0 2px 8px rgba(255, 71, 87, 0.6));
        z-index: 102;
        margin-bottom: 4px;
      }

      .center-button {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: clamp(16px, 4vw, 20px);
        cursor: pointer;
        box-shadow:
          0 0 15px rgba(24, 144, 255, 0.4),
          0 8px 25px rgba(24, 144, 255, 0.6),
          inset 0 -3px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s;
        position: relative;

        // 按钮光晕
        &::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          border-radius: 50%;
        }

        span {
          position: relative;
          z-index: 1;
        }

        &:not(.disabled):active {
          transform: scale(0.95);
          box-shadow:
            0 0 10px rgba(24, 144, 255, 0.4),
            0 4px 15px rgba(24, 144, 255, 0.6),
            inset 0 -3px 8px rgba(0, 0, 0, 0.2);
        }

        &.disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .loading {
          font-size: 28px;
          animation: spin 1s linear infinite;
        }
      }
    }
  }

  // 关闭按钮
  .close-button {
    position: absolute;
    top: calc(100% + 35px);
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    border: 1.5px solid rgba(255, 255, 255, 0.5);

    svg {
      width: 18px;
      height: 18px;
      color: white;
      transition: transform 0.3s;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      opacity: 1;
      transform: translateX(-50%) scale(1.1);

      svg {
        transform: rotate(90deg);
      }
    }

    &:active {
      transform: translateX(-50%) scale(0.95);
    }
  }

}

// 中心按钮loading动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 轮盘入场动画：从底部缩放进入
@keyframes wheelEnter {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

// 轮盘退场动画：缩小到底部
@keyframes wheelExit {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
}

// 图标轻微浮动动画
@keyframes iconFloat {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-3px);
  }
}

// 外圈渐变旋转动画
@keyframes gradientRotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
