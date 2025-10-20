<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { startHeartbeat, stopHeartbeat } from "@/utils/heartbeat";
import { getToken } from "@/utils/auth";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  setup() {
    onMounted(() => {
      // 如果用户已登录，启动心跳检测
      const tokenData = getToken();
      if (tokenData?.accessToken) {
        console.log("[App] 用户已登录，启动心跳检测");
        startHeartbeat(30000); // 每30秒检测一次
      }
    });

    onUnmounted(() => {
      // 组件卸载时停止心跳
      stopHeartbeat();
    });
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
