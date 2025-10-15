import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  code: [
    { required: true, message: "角色标识为必填项", trigger: "blur" },
    {
      pattern: /^[a-z_]+$/,
      message: "角色标识只能包含小写字母和下划线",
      trigger: "blur"
    }
  ]
});
