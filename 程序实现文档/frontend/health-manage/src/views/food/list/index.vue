<template>
  <div class="food-management-container">
    <!-- 搜索和筛选区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.search"
            placeholder="请输入食物名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button
            v-perms="[FoodPermission.ADD]"
            type="success"
            :icon="Plus"
            @click="handleCreate"
          >
            新增食物
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 食物列表表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>食物列表</span>
          <el-button type="primary" :icon="Refresh" @click="loadFoodList">
            刷新
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="foodList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="食物名称" min-width="150" />
        <el-table-column prop="name_en" label="英文名称" min-width="150">
          <template #default="{ row }">
            {{ row.name_en || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="brand" label="品牌" width="120">
          <template #default="{ row }">
            {{ row.brand || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="营养成分（每100g）" min-width="350">
          <template #default="{ row }">
            <div class="nutrition-info">
              <el-tag size="small"
                >热量: {{ row.calories_per_100g }}kcal</el-tag
              >
              <el-tag size="small" type="success"
                >蛋白质: {{ row.protein_per_100g }}g</el-tag
              >
              <el-tag size="small" type="warning"
                >脂肪: {{ row.fat_per_100g }}g</el-tag
              >
              <el-tag size="small" type="info"
                >碳水: {{ row.carbs_per_100g }}g</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'info'">
              {{ row.is_active ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-perms="[FoodPermission.EDIT, FoodPermission.DELETE]"
          label="操作"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadFoodList"
          @current-change="loadFoodList"
        />
      </div>
    </el-card>

    <!-- 新增/编辑食物对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        :disabled="dialogLoading"
      >
        <el-form-item label="食物名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入食物名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="name_en">
          <el-input v-model="formData.name_en" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择分类"
            filterable
            allow-create
            style="width: 100%"
          >
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="formData.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-divider>营养成分（每100g）</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="热量(kcal)" prop="calories_per_100g">
              <el-input-number
                v-model="formData.calories_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="蛋白质(g)" prop="protein_per_100g">
              <el-input-number
                v-model="formData.protein_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="脂肪(g)" prop="fat_per_100g">
              <el-input-number
                v-model="formData.fat_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="碳水化合物(g)" prop="carbs_per_100g">
              <el-input-number
                v-model="formData.carbs_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纤维(g)">
              <el-input-number
                v-model="formData.fiber_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="糖(g)">
              <el-input-number
                v-model="formData.sugar_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="钠(mg)">
              <el-input-number
                v-model="formData.sodium_per_100g"
                :min="0"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片URL">
          <el-input v-model="formData.image_url" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="条形码">
          <el-input v-model="formData.barcode" placeholder="请输入条形码" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="dialogLoading"
            @click="handleSubmit"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete } from "@element-plus/icons-vue";
import { useFoodList, useFoodCategories, useFoodActions } from "../utils/hooks";
import { postAdminFoods, putAdminFoodsId } from "@/api/admin";
import { unwrap } from "@/utils/api";
import type { FormInstance, FormRules } from "element-plus";
import { FoodPermission } from "@/utils/rbac";

defineOptions({
  name: "FoodList"
});

// 使用组合式函数
const {
  loading,
  foodList,
  searchForm,
  pagination,
  loadFoodList,
  handleSearch,
  handleReset
} = useFoodList();

const { categories, loadCategories } = useFoodCategories();
const { deleteFood } = useFoodActions();

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogLoading = ref(false);
const isEditing = ref(false);
const editingId = ref<number>();

// 表单引用和数据
const formRef = ref<FormInstance>();
const formData = reactive<API.CreateFoodRequest>({
  name: "",
  name_en: "",
  category: "",
  brand: "",
  calories_per_100g: 0,
  protein_per_100g: 0,
  fat_per_100g: 0,
  carbs_per_100g: 0,
  fiber_per_100g: 0,
  sodium_per_100g: 0,
  sugar_per_100g: 0,
  image_url: "",
  barcode: "",
  is_active: true
});

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: "请输入食物名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  calories_per_100g: [
    { required: true, message: "请输入热量", trigger: "blur" }
  ],
  protein_per_100g: [
    { required: true, message: "请输入蛋白质含量", trigger: "blur" }
  ],
  fat_per_100g: [
    { required: true, message: "请输入脂肪含量", trigger: "blur" }
  ],
  carbs_per_100g: [
    { required: true, message: "请输入碳水化合物含量", trigger: "blur" }
  ]
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: "",
    name_en: "",
    category: "",
    brand: "",
    calories_per_100g: 0,
    protein_per_100g: 0,
    fat_per_100g: 0,
    carbs_per_100g: 0,
    fiber_per_100g: 0,
    sodium_per_100g: 0,
    sugar_per_100g: 0,
    image_url: "",
    barcode: "",
    is_active: true
  });
  formRef.value?.clearValidate();
};

// 新增食物
const handleCreate = () => {
  resetForm();
  isEditing.value = false;
  dialogTitle.value = "新增食物";
  dialogVisible.value = true;
};

// 编辑食物
const handleEdit = (row: API.Food) => {
  resetForm();
  isEditing.value = true;
  editingId.value = row.id;
  dialogTitle.value = "编辑食物";

  // 填充表单数据 - 确保数值类型正确转换
  Object.assign(formData, {
    name: row.name || "",
    name_en: row.name_en || "",
    category: row.category || "",
    brand: row.brand || "",
    calories_per_100g: Number(row.calories_per_100g) || 0,
    protein_per_100g: Number(row.protein_per_100g) || 0,
    fat_per_100g: Number(row.fat_per_100g) || 0,
    carbs_per_100g: Number(row.carbs_per_100g) || 0,
    fiber_per_100g: Number(row.fiber_per_100g) || 0,
    sodium_per_100g: Number(row.sodium_per_100g) || 0,
    sugar_per_100g: Number(row.sugar_per_100g) || 0,
    image_url: row.image_url || "",
    barcode: row.barcode || "",
    is_active: row.is_active !== false
  });

  dialogVisible.value = true;
};

// 删除食物
const handleDelete = async (row: API.Food) => {
  const result = await deleteFood(row);
  if (result.success) {
    loadFoodList(); // 重新加载列表
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  dialogLoading.value = true;
  try {
    if (isEditing.value && editingId.value) {
      // 更新食物
      const response = await unwrap(
        putAdminFoodsId({ id: editingId.value }, formData as any)
      );
      if (response?.success) {
        ElMessage.success("更新成功");
        dialogVisible.value = false;
        loadFoodList();
      } else {
        ElMessage.error(response?.message || "更新失败");
      }
    } else {
      // 新增食物
      const response = await unwrap(postAdminFoods(formData as any));
      if (response?.success) {
        ElMessage.success("添加成功");
        dialogVisible.value = false;
        loadFoodList();
      } else {
        ElMessage.error(response?.message || "添加失败");
      }
    }
  } catch (error) {
    console.error("保存食物失败:", error);
    ElMessage.error("保存食物失败");
  } finally {
    dialogLoading.value = false;
  }
};

// 页面初始化
onMounted(() => {
  loadCategories();
  loadFoodList();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nutrition-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-table th) {
  color: #606266;
  font-weight: 600;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
