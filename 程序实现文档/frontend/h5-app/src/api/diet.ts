// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取饮食记录列表 获取当前用户的饮食记录列表,支持分页和日期筛选 GET /api/diet/records */
export async function getDietRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDietRecordsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      records?: API.DietRecord[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  }>("/api/diet/records", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // limit has a default value: 20
      limit: "20",

      ...params,
    },
    ...(options || {}),
  });
}

/** 创建饮食记录 创建新的饮食记录 POST /api/diet/records */
export async function postDietRecords(
  body: API.CreateDietRecordRequest,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
    data?: { recordId?: number };
  }>("/api/diet/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除饮食记录 删除指定的饮食记录 DELETE /api/diet/records/${param0} */
export async function deleteDietRecordsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDietRecordsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/diet/records/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取饮食摘要 获取指定日期或日期范围的饮食营养摘要 GET /api/diet/summary */
export async function getDietSummary(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDietSummaryParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      total_calories?: number;
      total_protein?: number;
      total_fat?: number;
      total_carbs?: number;
      meal_breakdown?: Record<string, any>;
    };
  }>("/api/diet/summary", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
