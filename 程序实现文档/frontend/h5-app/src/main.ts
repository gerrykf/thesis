import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "./i18n";
import { initFlexible } from "./utils/flexible";
import { useUserStore } from "./stores/user";
import VueTour from "vue3-tour";
import "@vant/touch-emulator";
import "vant/lib/index.css";
import "vue3-tour/dist/vue3-tour.css";
import "./styles/global.scss";
import App from "./App.vue";
import { registerServiceWorker } from "./utils/registerServiceWorker";
import { showSuccessToast, showToast } from "vant";

// 初始化rem适配
initFlexible();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(VueTour);

// 初始化用户信息
const userStore = useUserStore();
userStore.initUserInfo();

app.mount("#app");

// 注册 Service Worker (仅在生产环境)
// 注意: Service Worker 与 useVersionCheck 是互补的
// - useVersionCheck: 检测代码更新（定期轮询 index.html）
// - Service Worker: 管理缓存和离线功能
if (import.meta.env.PROD) {
  registerServiceWorker("/sw.js", {
    onRegistered: (_registration) => {
      console.log("[SW] Service Worker 已注册");
      console.log("[SW] 缓存策略已生效，支持离线访问");
      showSuccessToast("离线功能已启用");
    },
    onUpdated: (_registration) => {
      console.log("[SW] Service Worker 有新版本");
      // 注意: 这里不自动刷新，让 useVersionCheck 统一处理更新提示
      // 用户通过 useVersionCheck 的更新提示刷新页面时，新 SW 会自动激活
    },
    onOffline: () => {
      console.log("[SW] 离线模式 - 使用缓存数据");
      showToast("已进入离线模式");
    },
    onOnline: () => {
      console.log("[SW] 网络已恢复 - 同步数据");
      showSuccessToast("网络已恢复");
    },
    onError: (error) => {
      console.error("[SW] Service Worker 注册失败:", error);
    },
  });

  // 监听网络状态
  setupNetworkListeners({
    onOffline: () => {
      console.log("[Network] 网络已断开 - 进入离线模式");
      // Toast already shown by setupNetworkListeners
    },
    onOnline: () => {
      console.log("[Network] 网络已连接 - 准备同步数据");
      // Toast already shown by setupNetworkListeners
    },
  });
}
