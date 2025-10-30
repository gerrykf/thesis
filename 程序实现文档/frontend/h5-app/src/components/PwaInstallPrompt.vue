<template>
  <Teleport to="body">
    <Transition name="pwa-fade">
      <div
        v-if="showPrompt"
        class="pwa-install-overlay"
        @click.self="handleDismiss"
      >
        <Transition name="pwa-slide">
          <div v-if="showPrompt" class="pwa-install-card" @click.stop>
            <!-- 关闭按钮 -->
            <button class="close-btn" @click="handleDismiss" aria-label="关闭">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <!-- 应用图标 -->
            <div class="app-icon">
              <div class="icon-wrapper">
                <img :src="logo" alt="App Logo" class="logo" />
              </div>
            </div>

            <!-- 标题和描述 -->
            <div class="content">
              <h3 class="title">{{ t("an-zhuang-dao-zhu-ping-mu") }}</h3>
              <p class="description">
                {{
                  t(
                    "jiang-ying-yong-tian-jia-dao-zhu-ping-mu-sui-shi-fang-wen-ti-yan-geng-liu-chang"
                  )
                }}
              </p>

              <!-- 功能亮点 -->
              <div class="features">
                <div class="feature-item">
                  <svg
                    class="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span>{{ t("kuai-su-qi-dong") }}</span>
                </div>
                <div class="feature-item">
                  <svg
                    class="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                  <span>{{ t("quan-ping-ti-yan") }}</span>
                </div>
                <div class="feature-item">
                  <svg
                    class="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>{{ t("li-xian-ke-yong") }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="actions">
              <button class="action-btn secondary" @click="handleLater">
                {{ t("shao-hou-zai-shuo") }}
              </button>
              <button class="action-btn primary" @click="handleInstall">
                <svg
                  class="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {{ t("li-ji-an-zhuang") }}
              </button>
            </div>

            <!-- 隐私提示 -->
            <p class="privacy-note">
              {{ t("an-zhuang-hou-ke-sui-shi-cong-zhu-ping-mu-shan-chu") }}
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import logo from "@/assets/logo.png";

const { t } = useI18n();

// 本地存储键
const STORAGE_KEY = "pwa_install_prompt_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天

const showPrompt = ref(false);
const deferredPrompt = ref<any>(null);

// 检查是否应该显示提示
function shouldShowPrompt(): boolean {
  // 检查是否已经是PWA模式
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return false;
  }

  // 检查是否在iOS Safari中
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = (window.navigator as any).standalone;
  if (isIOS && isInStandaloneMode) {
    return false;
  }

  // 检查用户是否最近关闭过提示
  const dismissedTime = localStorage.getItem(STORAGE_KEY);
  if (dismissedTime) {
    const timePassed = Date.now() - parseInt(dismissedTime);
    if (timePassed < DISMISS_DURATION) {
      return false;
    }
  }

  return true;
}

// 处理beforeinstallprompt事件
function handleBeforeInstallPrompt(e: Event) {
  // 阻止默认的安装提示
  e.preventDefault();

  // 保存事件以便稍后触发
  deferredPrompt.value = e;

  // 显示自定义提示
  if (shouldShowPrompt()) {
    // 延迟3秒显示，给用户一些时间浏览应用
    setTimeout(() => {
      showPrompt.value = true;
    }, 3000);
  }
}

// 处理安装按钮点击
async function handleInstall() {
  if (!deferredPrompt.value) {
    return;
  }

  // 显示安装提示
  deferredPrompt.value.prompt();

  // 等待用户响应
  const { outcome } = await deferredPrompt.value.userChoice;

  console.log(`PWA安装结果: ${outcome}`);

  // 清除保存的事件
  deferredPrompt.value = null;

  // 隐藏提示
  showPrompt.value = false;
}

// 处理稍后提醒
function handleLater() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
  showPrompt.value = false;
}

// 处理关闭
function handleDismiss() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
  showPrompt.value = false;
}

// 监听安装完成事件
function handleAppInstalled() {
  console.log("PWA已成功安装");
  showPrompt.value = false;
  localStorage.removeItem(STORAGE_KEY);
}

onMounted(() => {
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.removeEventListener("appinstalled", handleAppInstalled);
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "sass:color";

.pwa-install-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: flex-end;
  padding: 0;

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
    padding: $space-md;
  }
}

.pwa-install-card {
  background: $white;
  border-radius: $radius-lg $radius-lg 0 0;
  width: 100%;
  max-width: 100%;
  position: relative;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);

  @media (min-width: 768px) {
    border-radius: $radius-lg;
    max-width: 480px;
  }

  .close-btn {
    position: absolute;
    top: $space-sm;
    right: $space-sm;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 1;

    svg {
      width: 18px;
      height: 18px;
      color: $text-color-2;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .app-icon {
    padding: $space-lg $space-lg $space-md;
    display: flex;
    justify-content: center;

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: $radius-md;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;

      .logo {
        width: 100%;
        height: 100%;
      }
    }
  }

  .content {
    padding: 0 $space-lg $space-md;
    text-align: center;

    .title {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-color;
      margin: 0 0 $space-xs 0;
    }

    .description {
      font-size: $font-size-sm;
      color: $text-color-2;
      line-height: 1.6;
      margin: 0 0 $space-md 0;
    }

    .features {
      display: flex;
      justify-content: space-around;
      gap: $space-sm;
      margin-bottom: $space-sm;

      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;

        .feature-icon {
          width: 24px;
          height: 24px;
          color: $primary-color;
          margin-bottom: 2px;
        }

        span {
          font-size: $font-size-xs;
          color: $text-color-3;
        }
      }
    }
  }

  .actions {
    padding: 0 $space-lg $space-md;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-sm;

    .action-btn {
      height: 44px;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      .btn-icon {
        width: 18px;
        height: 18px;
      }

      &.primary {
        background: #1989fa;
        color: white;

        &:hover {
          background: color.adjust(#1989fa, $lightness: -5%);
        }

        &:active {
          transform: scale(0.98);
        }
      }

      &.secondary {
        background: #f7f8fa;
        color: $text-color-2;

        &:hover {
          background: color.adjust(#f7f8fa, $lightness: -3%);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .privacy-note {
    padding: 0 $space-lg $space-lg;
    text-align: center;
    font-size: $font-size-xs;
    color: $text-color-3;
    margin: 0;
  }
}

// 动画
.pwa-fade-enter-active,
.pwa-fade-leave-active {
  transition: opacity 0.3s ease;
}

.pwa-fade-enter-from,
.pwa-fade-leave-to {
  opacity: 0;
}

.pwa-slide-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pwa-slide-leave-active {
  transition: transform 0.3s ease;
}

.pwa-slide-enter-from {
  transform: translateY(100%);

  @media (min-width: 768px) {
    transform: translateY(20px) scale(0.95);
  }
}

.pwa-slide-leave-to {
  transform: translateY(100%);

  @media (min-width: 768px) {
    transform: translateY(20px) scale(0.95);
  }
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .pwa-install-card {
    background: #1a1a1a;

    .close-btn {
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }

    .content {
      .title {
        color: #ffffff;
      }

      .description {
        color: rgba(255, 255, 255, 0.7);
      }

      .features .feature-item span {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .actions .action-btn.secondary {
      background: #2a2a2a;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background: #333333;
      }
    }

    .privacy-note {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
