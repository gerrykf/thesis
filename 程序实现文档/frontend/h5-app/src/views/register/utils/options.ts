/**
 * Register模块配置选项
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
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
    message: '密码必须包含大小写字母和数字，长度6-20位'
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
 * 注册提示信息
 */
export const registerMessages = {
  success: '注册成功！',
  failed: '注册失败，请稍后重试',
  userExists: '用户名已存在',
  phoneExists: '手机号已被注册',
  codeError: '验证码错误',
  codeSent: '验证码已发送',
  agreementRequired: '请阅读并同意用户协议和隐私政策'
}
