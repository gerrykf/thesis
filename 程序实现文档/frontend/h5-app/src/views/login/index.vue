<template>
  <div class="login">
    <van-nav-bar title="登录" fixed />

    <div class="content" style="padding-top: 46px;">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">🏃</div>
        <h1 class="app-name">健康管理</h1>
        <p class="app-desc">记录每一天，健康每一刻</p>
      </div>

      <!-- 登录表单 -->
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
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
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            clearable
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 记住我 & 忘记密码 -->
        <div class="form-options">
          <van-checkbox v-model="formData.remember">记住我</van-checkbox>
          <span class="link-text" @click="handleForgotPassword">忘记密码？</span>
        </div>

        <!-- 登录按钮 -->
        <div class="submit-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>
      </van-form>

      <!-- 注册链接 -->
      <div class="register-link">
        <span>还没有账号？</span>
        <span class="link-text" @click="goToRegister">立即注册</span>
      </div>

      <!-- 第三方登录 -->
      <div class="social-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        <div class="social-icons">
          <div class="social-item" @click="showToast('功能开发中')">
            <van-icon name="wechat" size="30" color="#09bb07" />
          </div>
          <div class="social-item" @click="showToast('功能开发中')">
            <van-icon name="friends-o" size="30" color="#1989fa" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { useLoginForm } from './utils'

const {
  formData,
  loading,
  handleLogin,
  goToRegister,
  handleForgotPassword
} = useLoginForm()
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
</style>
