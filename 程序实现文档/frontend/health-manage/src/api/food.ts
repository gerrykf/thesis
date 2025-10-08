// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取食物列表 获取食物列表,支持分页、搜索和分类筛选 GET /api/foods */
export async function getFoods(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFoodsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      foods?: API.Food[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  }>("/api/foods", {
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

/** 创建食物 创建新的食物条目(需要管理员权限) POST /api/foods */
export async function postFoods(
  body: API.CreateFoodRequest,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
    data?: { foodId?: number };
  }>("/api/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取单个食物详情 根据ID获取指定食物的详细信息 GET /api/foods/${param0} */
export async function getFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFoodsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; data?: API.Food }>(
    `/api/foods/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新食物信息 更新指定食物的信息(需要管理员权限) PUT /api/foods/${param0} */
export async function putFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putFoodsIdParams,
  body: API.CreateFoodRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/foods/${param0}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 删除食物 删除指定食物(软删除,需要管理员权限) DELETE /api/foods/${param0} */
export async function deleteFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFoodsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/foods/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取食物分类列表 获取所有食物分类 GET /api/foods/categories */
export async function getFoodsCategories(options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    data?: { category?: string; count?: number }[];
  }>("/api/foods/categories", {
    method: "GET",
    ...(options || {}),
  });
}
