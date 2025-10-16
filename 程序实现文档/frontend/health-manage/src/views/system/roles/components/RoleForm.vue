<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "../utils/rules";
import type { RoleFormData } from "../utils/types";
import type { FormInstance } from "element-plus";

interface FormProps {
  formInline?: RoleFormData;
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    code: "",
    remark: ""
  })
});

const ruleFormRef = ref<FormInstance>();
const newFormInline = ref(props.formInline);

const getRef = () => {
  return ruleFormRef.value;
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="角色标识" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入角色标识（小写字母和下划线）"
      />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>
</template>
