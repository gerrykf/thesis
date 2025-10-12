/**
 * Login模块配置选项
 */

import i18n from "@/i18n";

/**
 * 表单验证规则配置
 */
export const validationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: i18n.global.t("login.usernameRule"),
  },
  password: {
    minLength: 6,
    maxLength: 20,
    message: i18n.global.t("login.passwordRule"),
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: i18n.global.t("login.phoneRule"),
  },
  code: {
    length: 6,
    pattern: /^\d{6}$/,
    message: i18n.global.t("login.codeRule"),
  },
};

/**
 * 登录提示信息
 */
export const loginMessages = {
  success: '登录成功！',
  failed: '登录失败，请检查用户名和密码',
  networkError: '网络连接失败，请稍后重试',
  timeout: '请求超时，请重试'
}
