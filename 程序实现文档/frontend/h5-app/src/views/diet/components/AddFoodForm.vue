<template>
  <van-popup
    :show="show"
    @update:show="$emit('update:show', $event)"
    position="bottom"
    :style="{ height: '90%' }"
    round
  >
    <div class="add-food-form">
      <!-- 表单头部 -->
      <div class="form-header">
        <van-button plain size="small" @click="$emit('update:show', false)">
          {{ t("common.cancel") }}
        </van-button>
        <span class="title">{{ t("添加新食物") }}</span>
        <van-button
          plain
          size="small"
          type="primary"
          @click="handleSubmit"
          :loading="submitting"
        >
          {{ t("common.confirm") }}
        </van-button>
      </div>

      <!-- 表单内容 -->
      <div class="form-content">
        <van-form ref="formRef">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">{{ t("基本信息") }}</div>
            <van-cell-group inset>
              <van-field
                v-model="formData.name"
                :label="t('食物名称')"
                :placeholder="t('请输入食物名称')"
                required
                :rules="[{ required: true, message: t('请输入食物名称') }]"
              />
              <van-field
                v-model="formData.name_en"
                :label="t('英文名称')"
                :placeholder="t('请输入英文名称（可选）')"
              />
              <van-field
                v-model="formData.category"
                :label="t('食物分类')"
                :placeholder="t('请选择或输入分类')"
                required
                :rules="[{ required: true, message: t('请选择或输入分类') }]"
                is-link
                readonly
                @click="showCategoryPicker = true"
              />
              <van-field
                v-model="formData.brand"
                :label="t('品牌')"
                :placeholder="t('请输入品牌（可选）')"
              />
              <van-field
                v-model="formData.barcode"
                :label="t('条形码')"
                :placeholder="t('请输入条形码（可选）')"
              />
            </van-cell-group>
          </div>

          <!-- 营养信息（每100g） -->
          <div class="form-section">
            <div class="section-title">{{ t("营养信息（每100g）") }}</div>
            <van-cell-group inset>
              <van-field
                v-model="formData.calories_per_100g"
                :label="t('热量(kcal)')"
                :placeholder="t('请输入热量')"
                type="number"
                required
                :rules="[{ required: true, message: t('请输入热量') }]"
              >
                <template #button>
                  <span class="unit">kcal</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.protein_per_100g"
                :label="t('蛋白质(g)')"
                :placeholder="t('请输入蛋白质含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.fat_per_100g"
                :label="t('脂肪(g)')"
                :placeholder="t('请输入脂肪含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.carbs_per_100g"
                :label="t('碳水化合物(g)')"
                :placeholder="t('请输入碳水含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.fiber_per_100g"
                :label="t('膳食纤维(g)')"
                :placeholder="t('请输入纤维含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.sugar_per_100g"
                :label="t('糖(g)')"
                :placeholder="t('请输入糖含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.sodium_per_100g"
                :label="t('钠(mg)')"
                :placeholder="t('请输入钠含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">mg</span>
                </template>
              </van-field>
            </van-cell-group>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 分类选择器 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom" round>
      <van-picker
        :columns="categoryColumns"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false"
      >
        <template #toolbar>
          <div class="picker-toolbar">
            <van-button size="small" @click="showCategoryInput = true">
              {{ t("自定义分类") }}
            </van-button>
          </div>
        </template>
      </van-picker>
    </van-popup>

    <!-- 自定义分类输入 -->
    <van-dialog
      v-model:show="showCategoryInput"
      :title="t('输入自定义分类')"
      show-cancel-button
      @confirm="onCustomCategoryConfirm"
    >
      <van-field
        v-model="customCategory"
        :placeholder="t('请输入分类名称')"
        style="padding: 16px"
      />
    </van-dialog>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { showToast, showSuccessToast } from "vant";
import { postFoods } from "@/api/food";

const { t } = useI18n();

interface Props {
  show: boolean;
  categories: { category?: string; count?: number }[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  success: [];
}>();

// 表单数据
const formData = ref({
  name: "",
  name_en: "",
  category: "",
  brand: "",
  calories_per_100g: "",
  protein_per_100g: "",
  fat_per_100g: "",
  carbs_per_100g: "",
  fiber_per_100g: "",
  sodium_per_100g: "",
  sugar_per_100g: "",
  barcode: "",
});

const submitting = ref(false);
const showCategoryPicker = ref(false);
const showCategoryInput = ref(false);
const customCategory = ref("");
const formRef = ref();

// 分类选项
const categoryColumns = computed(() => {
  return props.categories.map((item) => ({
    text: item.category,
    value: item.category,
  }));
});

// 确认选择分类
function onCategoryConfirm(value: any) {
  formData.value.category = value.selectedOptions[0].value;
  showCategoryPicker.value = false;
}

// 确认自定义分类
function onCustomCategoryConfirm() {
  if (customCategory.value.trim()) {
    formData.value.category = customCategory.value.trim();
    showCategoryInput.value = false;
    showCategoryPicker.value = false;
    customCategory.value = "";
  }
}

// 提交表单
async function handleSubmit() {
  try {
    // 验证必填字段
    if (!formData.value.name.trim()) {
      showToast(t("请输入食物名称"));
      return;
    }
    if (!formData.value.category.trim()) {
      showToast(t("请选择或输入分类"));
      return;
    }
    if (!formData.value.calories_per_100g) {
      showToast(t("请输入热量"));
      return;
    }

    submitting.value = true;

    // 构造提交数据
    const submitData: API.CreateFoodRequest = {
      name: formData.value.name.trim(),
      category: formData.value.category.trim(),
      calories_per_100g: parseFloat(formData.value.calories_per_100g),
    };

    // 可选字段
    if (formData.value.name_en?.trim()) {
      submitData.name_en = formData.value.name_en.trim();
    }
    if (formData.value.brand?.trim()) {
      submitData.brand = formData.value.brand.trim();
    }
    if (formData.value.barcode?.trim()) {
      submitData.barcode = formData.value.barcode.trim();
    }
    if (formData.value.protein_per_100g) {
      submitData.protein_per_100g = parseFloat(formData.value.protein_per_100g);
    }
    if (formData.value.fat_per_100g) {
      submitData.fat_per_100g = parseFloat(formData.value.fat_per_100g);
    }
    if (formData.value.carbs_per_100g) {
      submitData.carbs_per_100g = parseFloat(formData.value.carbs_per_100g);
    }
    if (formData.value.fiber_per_100g) {
      submitData.fiber_per_100g = parseFloat(formData.value.fiber_per_100g);
    }
    if (formData.value.sodium_per_100g) {
      submitData.sodium_per_100g = parseFloat(formData.value.sodium_per_100g);
    }
    if (formData.value.sugar_per_100g) {
      submitData.sugar_per_100g = parseFloat(formData.value.sugar_per_100g);
    }

    // 提交到服务器
    await postFoods(submitData);

    showSuccessToast(t("添加成功"));

    // 重置表单
    resetForm();

    // 关闭弹窗并通知父组件
    emit("update:show", false);
    emit("success");
  } catch (error: any) {
    showToast(error.message || t("添加失败"));
  } finally {
    submitting.value = false;
  }
}

// 重置表单
function resetForm() {
  formData.value = {
    name: "",
    name_en: "",
    category: "",
    brand: "",
    calories_per_100g: "",
    protein_per_100g: "",
    fat_per_100g: "",
    carbs_per_100g: "",
    fiber_per_100g: "",
    sodium_per_100g: "",
    sugar_per_100g: "",
    barcode: "",
  };
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.add-food-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $background-color;

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-sm $space-md;
    background: $white;
    border-bottom: 1px solid $border-color;

    .title {
      font-size: $font-size-lg;
      font-weight: bold;
      color: $text-color;
    }
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    padding: $space-md 0;

    .form-section {
      margin-bottom: $space-md;

      .section-title {
        font-size: $font-size-base;
        font-weight: 500;
        color: $text-color;
        padding: $space-xs $space-md;
        margin-bottom: $space-xs;
      }
    }

    :deep(.van-cell-group) {
      margin-bottom: 0;
    }

    :deep(.van-field__label) {
      width: 100px;
      color: $text-color;
    }

    .unit {
      color: $text-color-3;
      font-size: $font-size-sm;
      margin-left: $space-xs;
    }
  }
}

.picker-toolbar {
  display: flex;
  justify-content: center;
  padding: $space-sm;
}
</style>
