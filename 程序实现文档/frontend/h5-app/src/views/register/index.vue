<template>
  <div class="register">
    <van-nav-bar
      :title="t('login.registerBtn')"
      fixed
      left-arrow
      @click-left="goToLogin"
      placeholder
    />

    <div class="content">
      <!-- 顶部说明 -->
      <div class="header-section">
        <h2>{{ t("chuang-jian-zhang-hao") }}</h2>
        <p>{{ t("kai-qi-ni-de-jian-kang-guan-li-zhi-lv") }}</p>
      </div>

      <!-- 注册表单 -->
      <van-form @submit="handleRegister">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            :label="t('login.username')"
            :placeholder="t('320-wei-zi-mu-shu-zi-huo-xia-hua-xian')"
            :rules="[{ required: true, message: '请输入用户名' }]"
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
            :placeholder="t('620-wei')"
            :rules="[{ required: true, message: '请输入密码' }]"
            clearable
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>

          <van-field
            v-model="formData.confirmPassword"
            type="password"
            name="confirmPassword"
            :label="t('settings.confirmPassword')"
            :placeholder="t('qing-zai-ci-shu-ru-mi-ma')"
            :rules="[{ required: true, message: '请再次输入密码' }]"
            clearable
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 用户协议 -->
        <div class="agreement-section">
          <van-checkbox v-model="formData.agree">
            {{ t("wo-yi-yue-du-bing-tong-yi") }}
            <span class="link" @click.stop="showToast('功能开发中')">{{
              t("yong-hu-xie-yi")
            }}</span>
            {{ t("he") }}
            <span class="link" @click.stop="showToast('功能开发中')">{{
              t("yin-si-zheng-ce")
            }}</span>
          </van-checkbox>
        </div>

        <!-- 注册按钮 -->
        <div class="submit-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="注册中..."
          >
            {{ t("login.registerBtn") }}
          </van-button>
        </div>
      </van-form>

      <!-- 登录链接 -->
      <div class="login-link">
        <span>{{ t("yi-you-zhang-hao") }}</span>
        <span class="link-text" @click="goToLogin">{{
          t("li-ji-deng-lu")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from "vant";
import { useRegisterForm } from "./utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { formData, loading, handleRegister, goToLogin } = useRegisterForm();
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.register {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  padding: $space-md;
  padding-bottom: 60px;
}

.header-section {
  text-align: center;
  padding: $space-xl 0;
  margin-bottom: $space-lg;

  h2 {
    font-size: $font-size-xxl;
    font-weight: bold;
    color: $white;
    margin-bottom: $space-sm;
  }

  p {
    font-size: $font-size-md;
    color: rgba(255, 255, 255, 0.8);
  }
}

.agreement-section {
  padding: $space-md;
  font-size: $font-size-sm;

  :deep(.van-checkbox__label) {
    color: $white;
  }

  .link {
    color: $white;
    text-decoration: underline;
    font-weight: bold;
  }
}

.submit-section {
  padding: $space-md;
}

.login-link {
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

:deep(.van-cell-group--inset) {
  margin: 0 0 $space-md 0;
}

:deep(.van-field__left-icon) {
  margin-right: $space-base;
}

:deep(.van-field__label) {
  margin-right: $space-base;
}
</style>
