import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { initFlexible } from './utils/flexible'
import '@vant/touch-emulator'
import 'vant/lib/index.css'
import './styles/global.scss'
import App from './App.vue'

// 初始化rem适配
initFlexible()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
