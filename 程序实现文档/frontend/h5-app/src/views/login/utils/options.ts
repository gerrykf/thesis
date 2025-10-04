/**
 * Login模块配置选项
 */

/**
 * 表单验证规则配置
 */
export const validationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: '用户名必须是3-20位字母、数字或下划线'
  },
  password: {
    minLength: 6,
    maxLength: 20,
    message: '密码长度必须在6-20位之间'
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号码'
  },
  code: {
    length: 6,
    pattern: /^\d{6}$/,
    message: '请输入6位数字验证码'
  }
}

/**
 * 登录提示信息
 */
export const loginMessages = {
  success: '登录成功！',
  failed: '登录失败，请检查用户名和密码',
  networkError: '网络连接失败，请稍后重试',
  timeout: '请求超时，请重试'
}
