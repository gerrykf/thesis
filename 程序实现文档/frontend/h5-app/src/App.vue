<template>
  <van-config-provider :theme="theme">
    <div class="app">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <van-tabbar v-if="!hideFooter" v-model="active" route>
        <van-tabbar-item to="/home" icon="home-o">{{
          t("nav.home")
        }}</van-tabbar-item>
        <van-tabbar-item to="/health" icon="add-o">{{
          t("da-ka")
        }}</van-tabbar-item>
        <van-tabbar-item to="/diet" icon="goods-collect-o">{{
          t("yin-shi")
        }}</van-tabbar-item>
        <van-tabbar-item to="/history" icon="clock-o">{{
          t("nav.history")
        }}</van-tabbar-item>
        <van-tabbar-item to="/my" icon="user-o">{{
          t("nav.profile")
        }}</van-tabbar-item>
      </van-tabbar>
    </div>
  </van-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n();

const active = ref(0);
const route = useRoute();
const theme = ref<"light" | "dark">("light");

// 根据路由 meta 判断是否隐藏 Footer
const hideFooter = computed(() => route.meta.hideFooter as boolean);

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    theme.value = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

// 监听主题变化
watch(theme, (newTheme) => {
  if (newTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
});

// 监听 localStorage 变化（跨标签页同步）
window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    theme.value = e.newValue === "dark" ? "dark" : "light";
  }
});

// 提供给全局使用的主题切换方法
(window as any).__updateTheme__ = (newTheme: "light" | "dark") => {
  theme.value = newTheme;
};
</script>

<style scoped>
.app {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--white);
  position: relative;
}

/* PC端居中效果 */
@media (min-width: 769px) {
  .app {
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    min-height: calc(100vh - 20px);
  }

  body {
    background: #f5f5f5;
  }
}
</style>
