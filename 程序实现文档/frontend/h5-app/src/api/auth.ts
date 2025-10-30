// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 上传用户头像 上传并更新用户头像 POST /api/auth/avatar */
export async function postAuthAvatar(
  body: {},
  avatar?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData();

  if (avatar) {
    formData.append("avatar", avatar);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === "object" && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ""));
        } else {
          formData.append(
            ele,
            new Blob([JSON.stringify(item)], { type: "application/json" })
          );
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{
    success?: boolean;
    message?: string;
    data?: { avatarUrl?: string };
  }>("/api/auth/avatar", {
    method: "POST",
    data: formData,
    ...(options || {}),
  });
}

/** 用户登录 用户登录获取访问令牌 POST /api/auth/login */
export async function postAuthLogin(
  body: API.LoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 修改当前登录用户的密码 PUT /api/auth/password */
export async function putAuthPassword(
  body: {
    /** 当前密码 */
    oldPassword: string;
    /** 新密码(至少6位) */
    newPassword: string;
  },
  options?: { [key: string]: any }
) {
  return request<{ success?: boolean; message?: string }>(
    "/api/auth/password",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 获取当前用户信息 获取当前登录用户的详细信息 GET /api/auth/profile */
export async function getAuthProfile(options?: { [key: string]: any }) {
  return request<{ success?: boolean; data?: API.User }>("/api/auth/profile", {
    method: "GET",
    ...(options || {}),
  });
}

/** 更新用户信息 更新当前登录用户的个人信息 PUT /api/auth/profile */
export async function putAuthProfile(
  body: API.UpdateProfileRequest,
  options?: { [key: string]: any }
) {
  return request<{ success?: boolean; message?: string }>("/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注册 注册新用户账号 POST /api/auth/register */
export async function postAuthRegister(
  body: API.RegisterRequest,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
    data?: { userId?: number };
  }>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
