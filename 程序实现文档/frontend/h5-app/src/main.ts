import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import { initFlexible } from './utils/flexible'
import { useUserStore } from './stores/user'
import VueTour from 'vue3-tour'
import '@vant/touch-emulator'
import 'vant/lib/index.css'
import enUS from "vant/es/locale/lang/en-US";
import "vue3-tour/dist/vue3-tour.css";
import "./styles/global.scss";
import App from "./App.vue";
import { Locale } from "vant";

Locale.use("en-US", enUS);

// 初始化rem适配
initFlexible()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueTour)

// 初始化用户信息
const userStore = useUserStore()
userStore.initUserInfo()

app.mount('#app')
