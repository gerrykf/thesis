// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取健康记录列表 获取当前用户的健康记录列表,支持分页和日期筛选 GET /api/health/records */
export async function getHealthRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHealthRecordsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      records?: API.HealthRecord[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  }>("/api/health/records", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // limit has a default value: 10
      limit: "10",

      ...params,
    },
    ...(options || {}),
  });
}

/** 创建健康记录 创建或更新指定日期的健康记录 POST /api/health/records */
export async function postHealthRecords(
  body: API.CreateHealthRecordRequest,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
    data?: { recordId?: number };
  }>("/api/health/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取单条健康记录 根据ID获取指定健康记录详情 GET /api/health/records/${param0} */
export async function getHealthRecordsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHealthRecordsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; data?: API.HealthRecord }>(
    `/api/health/records/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除健康记录 删除指定的健康记录 DELETE /api/health/records/${param0} */
export async function deleteHealthRecordsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteHealthRecordsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/health/records/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
