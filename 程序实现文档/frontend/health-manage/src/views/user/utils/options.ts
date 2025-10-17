// 用户管理模块选项配置

import { UserRole, SleepQuality, Mood } from "./enums";

// 用户角色选项
export const userRoleOptions = [
  { label: "普通用户", value: UserRole.USER },
  { label: "管理员", value: UserRole.ADMIN }
];

// 用户状态选项
export const userStatusOptions = [
  { label: "启用", value: true },
  { label: "禁用", value: false }
];

// 睡眠质量选项
export const sleepQualityOptions = [
  { label: "非常好", value: SleepQuality.EXCELLENT, type: "success" },
  { label: "好", value: SleepQuality.GOOD, type: "success" },
  { label: "一般", value: SleepQuality.FAIR, type: "warning" },
  { label: "差", value: SleepQuality.POOR, type: "danger" },
  { label: "非常差", value: SleepQuality.TERRIBLE, type: "danger" }
];

// 心情选项
export const moodOptions = [
  { label: "非常开心", value: Mood.VERY_HAPPY, type: "success" },
  { label: "开心", value: Mood.HAPPY, type: "success" },
  { label: "一般", value: Mood.NEUTRAL, type: "warning" },
  { label: "不开心", value: Mood.SAD, type: "danger" },
  { label: "非常不开心", value: Mood.VERY_SAD, type: "danger" }
];

// 分页配置
export const paginationConfig = {
  pageSizes: [10, 20, 50, 100],
  defaultPageSize: 20,
  layout: "total, sizes, prev, pager, next, jumper"
};

// 表格列配置
export const tableColumns = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "avatar", label: "头像", width: 80 },
  { prop: "username", label: "用户名", minWidth: 120 },
  { prop: "nickname", label: "昵称", minWidth: 120 },
  { prop: "email", label: "邮箱", minWidth: 180 },
  { prop: "phone", label: "手机号", minWidth: 120 },
  { prop: "role", label: "角色", width: 100 },
  { prop: "is_active", label: "状态", width: 100 },
  { prop: "last_login_at", label: "最后登录", minWidth: 180 },
  { prop: "created_at", label: "注册时间", minWidth: 180 },
  { prop: "actions", label: "操作", width: 200, fixed: "right" }
];

// 搜索表单配置
export const searchFormConfig = {
  username: {
    placeholder: "请输入用户名",
    clearable: true,
    style: { width: "200px" }
  },
  nickname: {
    placeholder: "请输入昵称",
    clearable: true,
    style: { width: "200px" }
  },
  role: {
    placeholder: "请选择角色",
    clearable: true,
    style: { width: "120px" }
  },
  is_active: {
    placeholder: "请选择状态",
    clearable: true,
    style: { width: "120px" }
  }
};
