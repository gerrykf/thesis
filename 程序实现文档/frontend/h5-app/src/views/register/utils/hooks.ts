/**
 * Register模块自定义Hooks
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import type { RegisterFormData } from './types'
import { validateRegisterForm } from './tools'
import { registerMessages } from './options'
import { postAuthRegister } from '@/api/auth'
import type { ErrorResponse } from '@/types/request'

/**
 * 注册表单管理Hook
 */
export function useRegisterForm() {
  const router = useRouter()
  const loading = ref(false)

  const formData = ref<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    agree: false
  })

  /**
   * 提交注册
   */
  async function handleRegister() {
    // 验证表单
    const validation = validateRegisterForm(formData.value)
    if (!validation.valid) {
      showToast(validation.message)
      return
    }

    loading.value = true

    try {
      // 调用注册API
      const response = await postAuthRegister({
        username: formData.value.username,
        password: formData.value.password,
        nickname: formData.value.username // 默认使用用户名作为昵称
      })

      // 响应拦截器已解包，直接使用 response
      const result = response as {
        success?: boolean
        message?: string
        data?: { userId?: number }
      }

      if (result.success) {
        showSuccessToast(result.message || registerMessages.success)

        // 延迟跳转到登录页
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        showToast(result.message || registerMessages.failed)
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse
      showToast(err.response?.data?.message || registerMessages.failed)
    } finally {
      loading.value = false
    }
  }

  /**
   * 返回登录页
   */
  function goToLogin() {
    router.push('/login')
  }

  return {
    formData,
    loading,
    handleRegister,
    goToLogin
  }
}
