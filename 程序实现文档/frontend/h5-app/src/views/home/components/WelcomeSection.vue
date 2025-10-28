<template>
  <div class="welcome-section">
    <div class="welcome-card">
      <div class="welcome-header">
        <div class="greeting-icon">
          {{ greetingIcon }}
        </div>
        <div class="welcome-info">
          <h2 class="greeting-text">
            {{ greeting }}，<span class="user-name">{{ userName }}</span>
          </h2>
          <div class="date-info">
            <van-icon name="clock-o" class="date-icon" />
            <span class="date">{{ currentDate }} {{ weekday }}</span>
          </div>
        </div>
      </div>
      <div class="welcome-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { formatChineseDate, getWeekday, getGreeting } from "../utils";

const userStore = useUserStore();

const greeting = computed(() => getGreeting());
const currentDate = computed(() => formatChineseDate());
const weekday = computed(() => getWeekday());
const userName = computed(() => userStore.nickname);

// 根据时间显示不同的问候图标
const greetingIcon = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) return "🌅"; // 早晨
  if (hour >= 9 && hour < 12) return "☀"; // 上午
  if (hour >= 12 && hour < 14) return "🌤"; // 中午
  if (hour >= 14 && hour < 18) return "🌞"; // 下午
  if (hour >= 18 && hour < 22) return "🌘"; // 傍晚
  return "🌙"; // 夜晚
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.welcome-section {
  margin-bottom: $space-sm;

  .welcome-card {
    position: relative;
    background: linear-gradient(135deg, var(--gradient-primary-start) 0%, var(--gradient-primary-end) 100%);
    border-radius: $radius-lg;
    padding: $space-lg;
    box-shadow: 0 4px 16px rgba(25, 137, 250, 0.15);
    overflow: hidden;
    animation: slideDown 0.5s ease-out;

    .welcome-header {
      display: flex;
      align-items: center;
      gap: $space-md;
      position: relative;
      z-index: 1;

      .greeting-icon {
        font-size: 52px;
        animation: float 3s ease-in-out infinite;
        flex-shrink: 0;
      }

      .welcome-info {
        flex: 1;
        min-width: 0;

        .greeting-text {
          font-size: $font-size-xl;
          margin: 0 0 $space-xs 0;
          color: $text-color;
          font-weight: 600;
          line-height: 1.3;
          word-break: break-word;

          .user-name {
            color: $primary-color;
            font-weight: 700;
          }
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 6px;

          .date-icon {
            font-size: 14px;
            color: $text-color-2;
          }

          .date {
            color: $text-color-2;
            font-size: $font-size-sm;
            margin: 0;
          }
        }
      }
    }

    .welcome-decoration {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;

      .decoration-circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(25, 137, 250, 0.08);
        animation: pulse 4s ease-in-out infinite;
      }

      .circle-1 {
        width: 100px;
        height: 100px;
        top: -30px;
        right: 20px;
        animation-delay: 0s;
      }

      .circle-2 {
        width: 60px;
        height: 60px;
        bottom: 10px;
        right: 60px;
        animation-delay: 1s;
      }

      .circle-3 {
        width: 40px;
        height: 40px;
        top: 50%;
        right: 10px;
        animation-delay: 2s;
      }
    }
  }
}

// 深色主题适配
[data-theme="dark"] {
  .welcome-card {
    box-shadow: 0 4px 16px rgba(30, 58, 95, 0.3);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>
