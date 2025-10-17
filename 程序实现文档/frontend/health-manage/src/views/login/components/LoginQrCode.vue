<script setup lang="ts">
import Motion from "../utils/motion";
import { useUserStoreHook } from "@/store/modules/user";

function onBack() {
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <Motion>
    <p class="text-center">二维码登录功能开发中...</p>
    <el-button class="w-full mt-4" size="default" @click="onBack">
      返回
    </el-button>
  </Motion>
</template>
