import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<API.User | null>(null)

  const isLogin = ref(false)

  function setUserInfo(info: API.User) {
    userInfo.value = info
    isLogin.value = true
  }

  function logout() {
    userInfo.value = null
    isLogin.value = false
  }

  return {
    userInfo,
    isLogin,
    setUserInfo,
    logout
  }
})
