<template>
  <div v-if="healthTips.length > 0" class="mini-tips">
    <van-swipe
      :autoplay="3000"
      :show-indicators="false"
      :loop="true"
      class="tips-swipe"
    >
      <van-swipe-item v-for="(tip, index) in healthTips" :key="index">
        <div class="mini-tip-item">
          <van-icon name="bulb-o" class="tip-icon" />
          <span class="tip-text">{{ tip }}</span>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
interface Props {
  healthTips: string[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.mini-tips {
  margin-bottom: $space-sm;

  .tips-swipe {
    height: 40px;

    :deep(.van-swipe__track) {
      height: 100%;
    }

    :deep(.van-swipe-item) {
      height: 100%;
    }
  }

  .mini-tip-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px $space-sm;
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    color: #333;
    line-height: 1.4;
    height: 100%;

    .tip-icon {
      font-size: 20px;
      color: #f39c12;
      flex-shrink: 0;
    }

    .tip-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
  }
}
</style>
