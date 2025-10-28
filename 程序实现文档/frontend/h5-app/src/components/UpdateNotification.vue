<template>
  <Teleport to="body">
    <Transition name="update-fade">
      <div
        v-if="show"
        class="update-notification-overlay"
        @click="onOverlayClick"
      >
        <Transition name="update-slide">
          <div v-if="show" class="update-notification-card" @click.stop>
            <!-- 顶部装饰 -->
            <div class="card-decoration">
              <div class="decoration-circle circle-1"></div>
              <div class="decoration-circle circle-2"></div>
              <div class="decoration-circle circle-3"></div>
            </div>

            <!-- 图标 -->
            <div class="update-icon">
              <div class="icon-wrapper">
                <svg
                  class="icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <!-- 内容 -->
            <div class="update-content">
              <h3 class="update-title">{{ t("xin-ban-ben-yi-fa-bu") }}</h3>
              <p class="update-description">
                {{
                  t(
                    "fa-xian-xin-ban-ben-qing-shua-xin-ye-mian-yi-huo-qu-zui-xin-ti-yan"
                  )
                }}
              </p>
            </div>

            <!-- 按钮组 -->
            <div class="update-actions">
              <van-button
                type="primary"
                class="action-btn primary"
                @click="onUpdate"
                :loading="loading"
              >
                {{ loading ? t("zheng-zai-geng-xin") : t("li-ji-geng-xin") }}
              </van-button>
            </div>

            <!-- 提示文本 -->
            <p class="update-hint">
              {{ t("geng-xin-ke-neng-xu-yao-ji-miao-zhong") }}
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const show = defineModel<boolean>("show");

const emit = defineEmits<{
  update: [];
}>();

const loading = ref(false);

function onOverlayClick() {
  // 点击遮罩层不关闭，强制用户做出选择
  return;
}

async function onUpdate() {
  loading.value = true;
  // 延迟一下，给用户更好的体验
  await new Promise((resolve) => setTimeout(resolve, 500));
  emit("update");
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.update-notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-lg;
}

.update-notification-card {
  position: relative;
  background: $white;
  border-radius: $radius-xl;
  padding: $space-xl;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  .card-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    overflow: hidden;
    pointer-events: none;

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        rgba(25, 137, 250, 0.15) 0%,
        rgba(187, 222, 251, 0.1) 100%
      );
      animation: float 3s ease-in-out infinite;

      &.circle-1 {
        width: 100px;
        height: 100px;
        top: -30px;
        right: -20px;
        animation-delay: 0s;
      }

      &.circle-2 {
        width: 60px;
        height: 60px;
        top: 20px;
        right: 80px;
        animation-delay: 1s;
      }

      &.circle-3 {
        width: 40px;
        height: 40px;
        top: -10px;
        right: 140px;
        animation-delay: 2s;
      }
    }
  }

  .update-icon {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: $space-lg;

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: linear-gradient(
        135deg,
        var(--gradient-primary-start) 0%,
        var(--gradient-primary-end) 100%
      );
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(25, 137, 250, 0.3);
      animation: pulse 2s ease-in-out infinite;

      .icon-svg {
        width: 40px;
        height: 40px;
        color: $primary-color;
      }
    }
  }

  .update-content {
    text-align: center;
    margin-bottom: $space-xl;

    .update-title {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-color;
      margin: 0 0 $space-sm 0;
    }

    .update-description {
      font-size: $font-size-base;
      color: $text-color-2;
      line-height: 1.6;
      margin: 0;
    }
  }

  .update-actions {
    display: flex;
    gap: $space-md;
    margin-bottom: $space-sm;

    .action-btn {
      flex: 1;
      height: 44px;
      border-radius: $radius-lg;
      font-size: $font-size-base;
      font-weight: 500;
      transition: all 0.3s ease;
      animation: pulse 2s ease-in-out infinite;

      &.secondary {
        background: $background-color;
        color: $text-color-2;
        border: none;

        &:hover {
          background: darken(#f7f8fa, 5%);
        }

        &:active {
          transform: scale(0.98);
        }
      }

      &.primary {
        box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .update-hint {
    text-align: center;
    font-size: $font-size-xs;
    color: $text-color-3;
    margin: 0;
  }
}

// 深色模式适配
[data-theme="dark"] {
  .update-notification-card {
    background: $card-bg;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

    .card-decoration {
      .decoration-circle {
        background: linear-gradient(
          135deg,
          rgba(58, 155, 255, 0.15) 0%,
          rgba(44, 82, 130, 0.1) 100%
        );
      }
    }

    .update-icon {
      .icon-wrapper {
        box-shadow: 0 8px 24px rgba(58, 155, 255, 0.3);

        .icon-svg {
          color: var(--primary-color);
        }
      }
    }

    .update-actions {
      .action-btn.secondary {
        background: #3a3a3a;
        color: $text-color-2;

        &:hover {
          background: lighten(#3a3a3a, 5%);
        }
      }
    }
  }
}

// 动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.1);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8px 24px rgba(25, 137, 250, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(25, 137, 250, 0.4);
  }
}

// 过渡动画
.update-fade-enter-active,
.update-fade-leave-active {
  transition: opacity 0.3s ease;
}

.update-fade-enter-from,
.update-fade-leave-to {
  opacity: 0;
}

.update-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.update-slide-leave-active {
  transition: all 0.3s ease;
}

.update-slide-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.update-slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>
