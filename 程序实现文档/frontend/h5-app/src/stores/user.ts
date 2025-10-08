import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuthProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<API.User | null>(null)
  const token = ref<string | null>(null)

  // 计算属性
  const isLogin = computed(() => !!token.value && !!userInfo.value)
  const username = computed(() => userInfo.value?.username || '用户')
  const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.username || '用户')

  /**
   * 设置用户信息
   */
  function setUserInfo(info: API.User) {
    userInfo.value = info
    // 同步到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  /**
   * 设置 token
   */
  function setToken(newToken: string) {
    token.value = newToken
  }

  /**
   * 初始化用户信息（从 localStorage 恢复）
   */
  function initUserInfo() {
    // 恢复 token
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
    }

    // 恢复用户信息
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  }

  /**
   * 刷新用户信息（从服务器获取最新信息）
   */
  async function refreshUserInfo() {
    try {
      const res = await getAuthProfile()
      // res 已经被 axios 拦截器解包，直接访问
      const data = res as any
      if (data.success && data.data) {
        setUserInfo(data.data)
        return true
      }
      return false
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      return false
    }
  }

  /**
   * 更新用户头像（仅更新头像字段）
   */
  function updateAvatar(avatarUrl: string) {
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        avatar: avatarUrl
      }
      // 同步到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    userInfo.value = null
    token.value = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    isLogin,
    username,
    nickname,
    setUserInfo,
    setToken,
    initUserInfo,
    refreshUserInfo,
    updateAvatar,
    logout
  }
})
