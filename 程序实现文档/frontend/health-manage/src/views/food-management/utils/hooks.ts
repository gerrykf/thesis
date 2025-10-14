// 食物管理模块组合式函数

import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getFoods,
  postFoods,
  putFoodsId,
  deleteFoodsId,
  getFoodsCategories
} from "@/api/food";
import { unwrap } from "@/utils/api";

export interface SearchForm {
  search?: string;
  category?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 食物列表管理Hook
export function useFoodList() {
  const loading = ref(false);
  const foodList = ref<API.Food[]>([]);
  const searchForm = reactive<SearchForm>({
    search: "",
    category: ""
  });

  const pagination = reactive<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0
  });

  // 加载食物列表
  const loadFoodList = async () => {
    loading.value = true;
    try {
      const params: API.getFoodsParams = {
        page: pagination.page,
        limit: pagination.pageSize,
        search: searchForm.search || undefined,
        category: searchForm.category || undefined
      };

      const response = await unwrap(getFoods(params));
      console.log("食物列表响应:", response);
      if (response?.success && response.data) {
        foodList.value = response.data.foods || [];
        pagination.total = response.data.pagination?.total || 0;
      }
    } catch (error) {
      console.error("加载食物列表失败:", error);
      ElMessage.error("加载食物列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 搜索食物
  const handleSearch = () => {
    pagination.page = 1;
    loadFoodList();
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.search = "";
    searchForm.category = "";
    pagination.page = 1;
    loadFoodList();
  };

  return {
    loading,
    foodList,
    searchForm,
    pagination,
    loadFoodList,
    handleSearch,
    handleReset
  };
}

// 食物分类Hook
export function useFoodCategories() {
  const categories = ref<string[]>([]);

  const loadCategories = async () => {
    try {
      const response = await unwrap(getFoodsCategories());
      if (response?.success && response.data) {
        categories.value = response.data.map(item => item.category || "");
      }
    } catch (error) {
      console.error("加载食物分类失败:", error);
    }
  };

  return {
    categories,
    loadCategories
  };
}

// 食物操作Hook
export function useFoodActions() {
  // 删除食物
  const deleteFood = async (food: API.Food) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除食物 "${food.name}" 吗？`,
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await unwrap(
        deleteFoodsId({
          id: food.id!
        })
      );

      if (response?.success) {
        ElMessage.success("删除成功");
        return { success: true };
      } else {
        throw new Error(response?.message || "删除食物失败");
      }
    } catch (error: any) {
      if (error !== "cancel") {
        console.error("删除食物失败:", error);
        ElMessage.error(error.message || "删除食物失败");
        return { success: false, message: error.message };
      }
      return { success: false, message: "操作已取消" };
    }
  };

  return {
    deleteFood
  };
}
