import { computed } from "vue";

export function usePublicHooks() {
  const tagStyle = computed(() => {
    return (status: number) => {
      return status === 1
        ? { "--el-tag-bg-color": "rgba(103, 194, 58, 0.1)", "--el-tag-border-color": "rgba(103, 194, 58, 0.2)", "--el-tag-text-color": "rgb(103, 194, 58)" }
        : { "--el-tag-bg-color": "rgba(245, 108, 108, 0.1)", "--el-tag-border-color": "rgba(245, 108, 108, 0.2)", "--el-tag-text-color": "rgb(245, 108, 108)" };
    };
  });

  return {
    tagStyle
  };
}
