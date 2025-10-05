/**
 * Login模块自定义Hooks
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import type { LoginFormData } from './types'
import { validateLoginForm, saveLoginInfo, getRememberedLoginInfo } from './tools'
import { loginMessages } from './options'
import { postAuthLogin } from '@/api/auth'
import type { ErrorResponse } from '@/types/request'
import { useUserStore } from '@/stores/user'

/**
 * 登录表单管理Hook
 */
export function useLoginForm() {
  const router = useRouter()
  const userStore = useUserStore()
  const loading = ref(false)
  const formData = ref<LoginFormData>({
    username: '',
    password: '',
    remember: false
  })

  /**
   * 初始化时加载记住的登录信息
   */
  onMounted(() => {
    const rememberedInfo = getRememberedLoginInfo()
    if (rememberedInfo) {
      formData.value.username = rememberedInfo.username
      formData.value.password = rememberedInfo.password
      formData.value.remember = rememberedInfo.remember
    }
  })

  /**
   * 提交登录
   */
  async function handleLogin() {
    // 验证表单
    const validation = validateLoginForm(formData.value)
    if (!validation.valid) {
      showToast(validation.message)
      return
    }

    loading.value = true

    try {
      // 调用登录API
      const response = await postAuthLogin({
        username: formData.value.username,
        password: formData.value.password
      })

      // 响应拦截器已解包，直接使用 response
      const result = response as API.LoginResponse

      if (result.success && result.data?.token) {
        // 保存登录信息（包括记住的用户名和密码）
        saveLoginInfo(
          result.data.token,
          formData.value.remember ?? false,
          formData.value.username,
          formData.value.password
        )

        // 保存到 Pinia Store
        userStore.setToken(result.data.token)
        if (result.data.user) {
          userStore.setUserInfo(result.data.user)
        }

        showSuccessToast(result.message || loginMessages.success)

        // 判断是否首次登录，跳转到对应页面
        setTimeout(() => {
          // 检查是否已设置目标
          const hasSetGoals = localStorage.getItem('hasSetGoals')

          if (!hasSetGoals) {
            // 首次登录，跳转到目标设置页
            router.push('/goals?firstTime=true')
          } else {
            // 非首次登录，跳转到首页
            router.push('/home')
          }
        }, 1000)
      } else {
        showToast(result.message || loginMessages.failed)
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse
      showToast(err.response?.data?.message || loginMessages.failed)
    } finally {
      loading.value = false
    }
  }

  /**
   * 跳转到注册页
   */
  function goToRegister() {
    router.push('/register')
  }

  /**
   * 忘记密码
   */
  function handleForgotPassword() {
    showToast('该功能暂未开放')
  }

  return {
    formData,
    loading,
    handleLogin,
    goToRegister,
    handleForgotPassword
  }
}
