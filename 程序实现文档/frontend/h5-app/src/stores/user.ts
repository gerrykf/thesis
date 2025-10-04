import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: '',
    name: '',
    avatar: '',
    phone: ''
  })

  const isLogin = ref(false)

  function setUserInfo(info: any) {
    userInfo.value = info
    isLogin.value = true
  }

  function logout() {
    userInfo.value = {
      id: '',
      name: '',
      avatar: '',
      phone: ''
    }
    isLogin.value = false
  }

  return {
    userInfo,
    isLogin,
    setUserInfo,
    logout
  }
})
