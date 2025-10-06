/**
 * Profile模块自定义Hooks
 */

import { ref, computed } from "vue";
import { showLoadingToast, closeToast, showToast } from "vant";
import { getAuthProfile, putAuthProfile } from "@/api/auth";
import type { ProfileFormData } from "./types";
import {
  transformUserToFormData,
  transformFormDataToUpdateRequest,
  parseDateToArray,
  formatDateArrayToString,
  getGenderText,
  GENDER_OPTIONS,
} from "./index";

/**
 * 使用个人资料编辑表单
 */
export function useProfileEdit() {
  const loading = ref(false);
  const showGenderPicker = ref(false);
  const showDatePicker = ref(false);

  // 表单数据
  const formData = ref<ProfileFormData>({});

  // 日期选择器当前值
  const currentDate = ref<string[]>(parseDateToArray());

  // 性别显示文本
  const genderText = computed(() => getGenderText(formData.value.gender));

  /**
   * 加载用户资料
   */
  async function loadProfile() {
    showLoadingToast({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });

    try {
      const response = await getAuthProfile();
      const data = (response as any).data;

      if (data) {
        formData.value = transformUserToFormData(data);

        // 如果有出生日期，解析为日期选择器格式
        if (data.birth_date) {
          currentDate.value = parseDateToArray(data.birth_date);
        }
      }

      closeToast();
    } catch (error) {
      console.error("加载用户资料失败:", error);
      closeToast();
      showToast({
        message: "加载失败",
        icon: "fail",
      });
    }
  }

  /**
   * 性别选择确认
   */
  function onGenderConfirm(value: any) {
    formData.value.gender = value.selectedOptions[0].value;
    showGenderPicker.value = false;
  }

  /**
   * 日期选择确认
   */
  function onDateConfirm(value: any) {
    const { selectedValues } = value;
    formData.value.birth_date = formatDateArrayToString(selectedValues);
    currentDate.value = selectedValues;
    showDatePicker.value = false;
  }

  /**
   * 提交表单
   */
  async function submitForm() {
    loading.value = true;

    try {
      const updateData = transformFormDataToUpdateRequest(formData.value);
      const response = await putAuthProfile(updateData);

      // 使用接口返回的 message
      const message = (response as any).message || "保存成功";

      showToast({
        message,
        icon: "success",
      });

      return true;
    } catch (error) {
      console.error("保存失败:", error);

      // 尝试从错误响应中获取 message
      const errorMessage =
        (error as any)?.response?.data?.message || "保存失败";

      showToast({
        message: errorMessage,
        icon: "fail",
      });
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    // 状态
    loading,
    showGenderPicker,
    showDatePicker,
    formData,
    currentDate,
    genderText,

    // 常量
    genderOptions: GENDER_OPTIONS,

    // 方法
    loadProfile,
    onGenderConfirm,
    onDateConfirm,
    submitForm,
  };
}
