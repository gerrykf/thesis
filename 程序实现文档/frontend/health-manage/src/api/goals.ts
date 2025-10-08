// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取用户所有目标 GET /api/goals */
export async function getGoals(options?: { [key: string]: any }) {
  return request<{ success?: boolean; data?: API.UserGoal[] }>("/api/goals", {
    method: "GET",
    ...(options || {}),
  });
}

/** 创建用户目标 POST /api/goals */
export async function postGoals(
  body: {
    goal_type: "weight" | "exercise" | "calories" | "custom";
    goal_name: string;
    target_value: number;
    current_value?: number;
    unit?: string;
    start_date: string;
    target_date?: string;
    description?: string;
  },
  options?: { [key: string]: any }
) {
  return request<any>("/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户目标 PUT /api/goals/${param0} */
export async function putGoalsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putGoalsIdParams,
  body: {
    goal_name?: string;
    target_value?: number;
    current_value?: number;
    unit?: string;
    target_date?: string;
    status?: "active" | "completed" | "paused" | "cancelled";
    description?: string;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/goals/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户目标 DELETE /api/goals/${param0} */
export async function deleteGoalsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteGoalsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/goals/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}
