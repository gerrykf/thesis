<template>
  <div class="login">
    <van-nav-bar :title="t('login.title')" fixed placeholder>
      <template #right>
        <div class="language-trigger" @click="showLanguageDialog = true">
          <van-icon name="globe-o" />
          <span class="language-text">{{ currentLanguageName }}</span>
        </div>
      </template>
    </van-nav-bar>

    <div class="content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">🏃</div>
        <h1 class="app-name">{{ t('login.appName') }}</h1>
        <p class="app-desc">{{ t('login.appDesc') }}</p>
      </div>

      <!-- 登录表单 -->
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            :label="t('login.username')"
            :placeholder="t('login.pleaseEnterUsername')"
            :rules="[{ required: true, message: t('login.pleaseEnterUsername') }]"
            clearable
          >
            <template #left-icon>
              <van-icon name="manager-o" />
            </template>
          </van-field>

          <van-field
            v-model="formData.password"
            type="password"
            name="password"
            :label="t('login.password')"
            :placeholder="t('login.pleaseEnterPassword')"
            :rules="[{ required: true, message: t('login.pleaseEnterPassword') }]"
            clearable
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 记住我 & 忘记密码 -->
        <div class="form-options">
          <van-checkbox v-model="formData.remember">{{ t('login.rememberMe') }}</van-checkbox>
          <span class="link-text" @click="handleForgotPassword">{{ t('login.forgotPassword') }}</span>
        </div>

        <!-- 登录按钮 -->
        <div class="submit-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            :loading-text="t('common.loggingIn')"
          >
            {{ t('login.loginBtn') }}
          </van-button>
        </div>
      </van-form>

      <!-- 注册链接 -->
      <div class="register-link">
        <span>{{ t('login.noAccount') }}</span>
        <span class="link-text" @click="goToRegister">{{ t('login.registerNow') }}</span>
      </div>

      <!-- 第三方登录 -->
      <!-- <div class="social-login">
        <div class="divider">
          <span>{{ t('login.otherLoginMethods') }}</span>
        </div>
        <div class="social-icons">
          <div class="social-item" @click="showToast(t('common.inDevelopment'))">
            <van-icon name="wechat" size="30" color="#09bb07" />
          </div>
          <div class="social-item" @click="showToast(t('common.inDevelopment'))">
            <van-icon name="friends-o" size="30" color="#1989fa" />
          </div>
        </div>
      </div> -->
    </div>

    <!-- 语言选择弹窗 -->
    <van-action-sheet
      v-model:show="showLanguageDialog"
      :actions="languageActions"
      @select="onSelectLanguage"
      :cancel-text="t('common.cancel')"
      close-on-click-action
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './utils'
import { SUPPORT_LOCALES, LOCALE_NAMES, saveLocale, type SupportLocale } from '@/i18n'
import { setVantLocale } from '@/i18n/vant'

const { t, locale } = useI18n()

const {
  formData,
  loading,
  handleLogin,
  goToRegister,
  handleForgotPassword
} = useLoginForm()

// 语言设置
const showLanguageDialog = ref(false)

// 当前语言显示名称
const currentLanguageName = computed(() => {
  return LOCALE_NAMES[locale.value as SupportLocale] || '简体中文'
})

// 语言选项列表
const languageActions = computed(() => {
  return SUPPORT_LOCALES.map(lang => ({
    name: LOCALE_NAMES[lang],
    value: lang,
    className: locale.value === lang ? 'active-language' : ''
  }))
})

// 选择语言
function onSelectLanguage(action: { value: SupportLocale }) {
  const newLocale = action.value
  if (newLocale !== locale.value) {
    // 更新 vue-i18n 语言
    locale.value = newLocale
    // 更新 Vant 语言
    setVantLocale(newLocale)
    // 保存到本地存储
    saveLocale(newLocale)
    // 提示
    showToast({
      message: t('settings.languageSwitched', { language: LOCALE_NAMES[newLocale] }),
      duration: 1500
    })
  }
  showLanguageDialog.value = false
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  padding: $space-md;
  padding-bottom: 60px;
}

.logo-section {
  text-align: center;
  padding: $space-xl 0;
  margin-bottom: $space-lg;

  .logo-icon {
    font-size: 64px;
    margin-bottom: $space-md;
  }

  .app-name {
    font-size: $font-size-xxl;
    font-weight: bold;
    color: $white;
    margin-bottom: $space-xs;
  }

  .app-desc {
    font-size: $font-size-md;
    color: rgba(255, 255, 255, 0.8);
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md $space-md 0;

  :deep(.van-checkbox__label) {
    color: $white;
  }

  .link-text {
    color: #1989fa;
    font-weight: bold;
    cursor: pointer;
  }
}

.submit-section {
  padding: $space-lg $space-md;
}

.register-link {
  text-align: center;
  padding: $space-md;
  color: $white;

  .link-text {
    color: #1989fa;
    font-weight: bold;
    cursor: pointer;
    margin-left: 4px;
  }
}

.social-login {
  margin-top: $space-xl;

  .divider {
    text-align: center;
    position: relative;
    margin-bottom: $space-lg;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.3);
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      color: rgba(255, 255, 255, 0.8);
      font-size: $font-size-sm;
      padding: 0 $space-md;
      background: transparent;
    }
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: $space-xl;

    .social-item {
      width: 50px;
      height: 50px;
      background: $white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s;

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field__left-icon) {
  margin-right: $space-sm;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  color: #323233;
  transition: opacity 0.3s ease;

  &:active {
    opacity: 0.7;
  }

  .language-text {
    font-size: 14px;
  }

  .van-icon {
    font-size: 16px;
  }
}
</style>
