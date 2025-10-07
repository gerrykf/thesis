<template>
  <div class="settings">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
    />

    <div class="content">
      <!-- 主题设置 -->
      <van-cell-group inset>
        <van-cell title="深色模式" center>
          <template #right-icon>
            <van-switch
              v-model="isDarkMode"
              size="20px"
              @change="onThemeChange"
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 密码设置 -->
      <van-cell-group inset>
        <van-cell
          title="修改密码"
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
        <van-button plain @click="showPasswordDialog = false">取消</van-button>
        <span class="title">修改密码</span>
        <van-button plain type="primary" @click="onChangePassword"
          >确定</van-button
        >
      </div>
      <div class="dialog-content">
        <van-form ref="passwordFormRef">
          <van-field
            v-model="passwordForm.oldPassword"
            type="password"
            name="oldPassword"
            label="当前密码"
            placeholder="请输入当前密码"
            :rules="[{ required: true, message: '请输入当前密码' }]"
          />
          <van-field
            v-model="passwordForm.newPassword"
            type="password"
            name="newPassword"
            label="新密码"
            placeholder="密码至少6位"
            :min="6"
            :rules="[{ required: true, message: '请输入新密码' }]"
          />
          <van-field
            v-model="passwordForm.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入新密码"
            :rules="[
              { required: true, message: '请再次输入新密码' },
              { validator: validateConfirmPassword, message: '两次密码不一致' },
            ]"
          />
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast, showLoadingToast, closeToast } from "vant";
import type { FormInstance } from "vant";
import { useUserStore } from "@/stores/user";
import { putAuthPassword } from "@/api/auth";

const router = useRouter();
const userStore = useUserStore();

// 主题模式
const isDarkMode = ref(false);

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

  showToast(value ? "已切换到深色模式" : "已切换到浅色模式");
}

// 应用主题
function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
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
      showToast("密码修改成功，请重新登录");
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
      showToast(res.data.message || "密码修改失败");
    }
  } catch (error: any) {
    closeToast();
    console.error("修改密码失败:", error);
    showToast(error.message || "密码修改失败");
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
