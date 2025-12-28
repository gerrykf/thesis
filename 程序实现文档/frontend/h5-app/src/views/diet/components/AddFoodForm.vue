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
        <span class="title">{{ t("tian-jia-xin-shi-wu-0") }}</span>
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
        <van-form>
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">{{ t("ji-ben-xin-xi") }}</div>
            <van-cell-group inset>
              <van-field
                v-model="formData.name"
                :label="t('food-name')"
                :placeholder="t('qing-shu-ru-shi-wu-ming-cheng')"
                required
                :rules="[
                  {
                    required: true,
                    message: t('qing-shu-ru-shi-wu-ming-cheng'),
                  },
                ]"
              />
              <van-field
                v-model="formData.name_en"
                :label="t('english-name')"
                :placeholder="t('qing-shu-ru-shi-wu-ying-wen-ming-cheng')"
              />
              <van-field
                v-model="formData.category"
                :label="t('food-category')"
                :placeholder="t('qin-xuan-zhe-huo-shu-ru-fen-lei')"
                required
                :rules="[
                  {
                    required: true,
                    message: t('qin-xuan-zhe-huo-shu-ru-fen-lei'),
                  },
                ]"
                is-link
                readonly
                @click="showCategoryPicker = true"
              />
              <van-field
                v-model="formData.brand"
                :label="t('brand')"
                :placeholder="t('qing-shu-ru-pin-pai-ke-xuan')"
              />
              <van-field
                v-model="formData.barcode"
                :label="t('tiao-xing-ma')"
                :placeholder="t('qing-shu-ru-tiao-xing-ma-ke-xuan')"
              />
            </van-cell-group>
          </div>

          <!-- 营养信息（每100g） -->
          <div class="form-section">
            <div class="section-title">{{ t("营养信息（每100g）") }}</div>
            <van-cell-group inset>
              <van-field
                v-model="formData.calories_per_100g"
                :label="t('re-liang')"
                :placeholder="t('qin-shu-ru-re-liang')"
                type="number"
                required
                :rules="[{ required: true, message: t('qin-shu-ru-re-liang') }]"
              >
                <template #button>
                  <span class="unit">kcal</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.protein_per_100g"
                :label="t('protein')"
                :placeholder="t('qin-shu-ru-dan-bai-zhi-han-liang')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.fat_per_100g"
                :label="t('fits')"
                :placeholder="t('qing-shu-ru-zhifang-han-liang')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.carbs_per_100g"
                :label="t('carbs')"
                :placeholder="t('请输入碳水含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.fiber_per_100g"
                :label="t('shan-shi-qian-wei')"
                :placeholder="t('请输入纤维含量')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.sugar_per_100g"
                :label="t('tang')"
                :placeholder="t('qing-shu-ru-tang-han-liang')"
                type="number"
              >
                <template #button>
                  <span class="unit">g</span>
                </template>
              </van-field>
              <van-field
                v-model="formData.sodium_per_100g"
                :label="t('na')"
                :placeholder="t('qing-shu-ru-na-han-liang')"
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
      />
      <div class="picker-custom-action">
        <van-button block plain @click="showCategoryInput = true">
          {{ t("zi-ding-yi-fen-lei") }}
        </van-button>
      </div>
    </van-popup>

    <!-- 自定义分类输入 -->
    <van-dialog
      v-model:show="showCategoryInput"
      :title="t('shu-ru-zi-ding-yi-fen-lei')"
      show-cancel-button
      @confirm="onCustomCategoryConfirm"
    >
      <van-field
        v-model="customCategory"
        :placeholder="t('qing-shu-ru-fen-lei-ming-cheng')"
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
      showToast(t("qing-shu-ru-shi-wu-ming-cheng"));
      return;
    }
    if (!formData.value.category.trim()) {
      showToast(t("qing-xuan-ze-huo-shu-ru-fen-lei"));
      return;
    }
    if (!formData.value.calories_per_100g) {
      showToast(t("qing-shu-ru-re-liang"));
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

    showSuccessToast(t("tian-jia-cheng-gong"));

    // 重置表单
    resetForm();

    // 关闭弹窗并通知父组件
    emit("update:show", false);
    emit("success");
  } catch (error: any) {
    showToast(error.message || t("tian-jia-shi-bai"));
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

.picker-custom-action {
  padding: $space-sm $space-md;
  background: $white;
  border-top: 1px solid $border-color;
}
</style>
