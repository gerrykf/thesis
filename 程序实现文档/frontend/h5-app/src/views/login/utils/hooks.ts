/**
 * Login模块自定义Hooks
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import type { LoginFormData } from './types'
import { validateLoginForm, saveLoginInfo } from './tools'
import { loginMessages } from './options'
import { postAuthLogin } from '@/api/auth'
import type { ErrorResponse } from '@/types/request'

/**
 * 登录表单管理Hook
 */
export function useLoginForm() {
  const router = useRouter()
  const loading = ref(false)
  const formData = ref<LoginFormData>({
    username: '',
    password: '',
    remember: false
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
        // 保存登录信息
        saveLoginInfo(result.data.token, formData.value.remember ?? false)

        // 保存用户信息
        if (result.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(result.data.user))
        }

        showSuccessToast(result.message || loginMessages.success)

        // 延迟跳转到首页
        setTimeout(() => {
          router.push('/home')
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
