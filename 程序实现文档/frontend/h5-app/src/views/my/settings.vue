<template>
  <div class="settings">
    <van-nav-bar
      :title="t('settings.title')"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
    />

    <div class="content">
      <!-- 主题设置 -->
      <van-cell-group inset>
        <van-cell :title="t('settings.darkMode')" center>
          <template #right-icon>
            <van-switch
              v-model="isDarkMode"
              size="20px"
              @change="onThemeChange"
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 语言设置 -->
      <van-cell-group inset>
        <van-cell
          :title="t('settings.languageLabel')"
          is-link
          :value="currentLanguageName"
          @click="showLanguageDialog = true"
          icon="globe-o"
        />
      </van-cell-group>

      <!-- 密码设置 -->
      <van-cell-group inset>
        <van-cell
          :title="t('settings.changePassword')"
          is-link
          @click="showPasswordDialog = true"
          icon="lock"
        />
      </van-cell-group>
    </div>

    <!-- 修改密码弹窗 -->
    <van-popup
      v-model:show="showPasswordDialog"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="dialog-header">
        <van-button plain @click="showPasswordDialog = false">{{ t('common.cancel') }}</van-button>
        <span class="title">{{ t('settings.changePassword') }}</span>
        <van-button plain type="primary" @click="onChangePassword"
          >{{ t('common.confirm') }}</van-button
        >
      </div>
      <div class="dialog-content">
        <van-form ref="passwordFormRef">
          <van-field
            v-model="passwordForm.oldPassword"
            type="password"
            name="oldPassword"
            :label="t('settings.currentPassword')"
            :placeholder="t('settings.pleaseEnterCurrentPassword')"
            :rules="[{ required: true, message: t('settings.pleaseEnterCurrentPassword') }]"
          />
          <van-field
            v-model="passwordForm.newPassword"
            type="password"
            name="newPassword"
            :label="t('settings.newPassword')"
            :placeholder="t('settings.passwordMinLength')"
            :min="6"
            :rules="[{ required: true, message: t('settings.pleaseEnterNewPassword') }]"
          />
          <van-field
            v-model="passwordForm.confirmPassword"
            type="password"
            name="confirmPassword"
            :label="t('settings.confirmPassword')"
            :placeholder="t('settings.pleaseConfirmPassword')"
            :rules="[
              { required: true, message: t('settings.pleaseConfirmPassword') },
              { validator: validateConfirmPassword, message: t('settings.passwordNotMatch') },
            ]"
          />
        </van-form>
      </div>
    </van-popup>

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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast, showLoadingToast, closeToast } from "vant";
import type { FormInstance } from "vant";
import { useUserStore } from "@/stores/user";
import { putAuthPassword } from "@/api/auth";
import { SUPPORT_LOCALES, LOCALE_NAMES, saveLocale, type SupportLocale } from "@/i18n";
import { setVantLocale } from "@/i18n/vant";

const router = useRouter();
const userStore = useUserStore();
const { t, locale } = useI18n();

// 主题模式
const isDarkMode = ref(false);

// 语言设置
const showLanguageDialog = ref(false);

// 当前语言显示名称
const currentLanguageName = computed(() => {
  return LOCALE_NAMES[locale.value as SupportLocale] || '简体中文';
});

// 语言选项列表
const languageActions = computed(() => {
  return SUPPORT_LOCALES.map(lang => ({
    name: LOCALE_NAMES[lang],
    value: lang,
    className: locale.value === lang ? 'active-language' : ''
  }));
});

// 密码表单
const showPasswordDialog = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 页面加载时读取主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDarkMode.value = savedTheme === "dark";
  applyTheme(isDarkMode.value);
});

// 主题切换
function onThemeChange(value: boolean) {
  const theme = value ? "dark" : "light";
  applyTheme(value);
  localStorage.setItem("theme", theme);

  // 通知 App.vue 更新主题
  if ((window as any).__updateTheme__) {
    (window as any).__updateTheme__(theme);
  }

  showToast(value ? t('settings.switchedToDarkMode') : t('settings.switchedToLightMode'));
}

// 应用主题
function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// 选择语言
function onSelectLanguage(action: { value: SupportLocale }) {
  const newLocale = action.value;
  if (newLocale !== locale.value) {
    // 更新 vue-i18n 语言
    locale.value = newLocale;
    // 更新 Vant 语言
    setVantLocale(newLocale);
    // 保存到本地存储
    saveLocale(newLocale);
    // 提示
    showToast({
      message: t('settings.languageSwitched', { language: LOCALE_NAMES[newLocale] }),
      duration: 1500
    });
  }
  showLanguageDialog.value = false;
}

// 验证确认密码
function validateConfirmPassword(value: string) {
  return value === passwordForm.value.newPassword;
}

// 修改密码
async function onChangePassword() {
  try {
    await passwordFormRef.value?.validate();

    showLoadingToast({
      message: "修改中...",
      forbidClick: true,
      duration: 0,
    });

    // 调用修改密码接口
    const res = await putAuthPassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    });

    closeToast();

    if (res.data.success) {
      showToast(t('settings.changePasswordSuccess'));
      showPasswordDialog.value = false;

      // 重置表单
      passwordForm.value = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      // 延迟1.5秒后自动退出登录
      setTimeout(() => {
        // 清除登录信息
        userStore.logout();
        // 跳转到登录页
        router.replace("/login");
      }, 1500);
    } else {
      showToast(res.data.message || t('settings.changePasswordFailed'));
    }
  } catch (error: any) {
    closeToast();
    console.error("修改密码失败:", error);
    showToast(error.message || t('settings.changePasswordFailed'));
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.settings {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md 0;
  padding-bottom: 70px;
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md $space-lg;
  border-bottom: 1px solid $border-color;

  .title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }
}

.dialog-content {
  padding: $space-md 0;
}
</style>
