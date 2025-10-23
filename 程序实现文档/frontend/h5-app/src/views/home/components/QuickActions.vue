<template>
  <div class="quick-actions" data-v-step="3">
    <van-grid :column-num="4" :border="false" :gutter="6">
      <van-grid-item
        icon="add-o"
        :text="t('da-ka')"
        @click="emit('go-to-health')"
      />
      <van-grid-item
        icon="goods-collect-o"
        :text="t('yin-shi')"
        @click="emit('go-to-diet')"
      />
      <van-grid-item
        icon="chart-trending-o"
        :text="t('fen-xi')"
        @click="emit('go-to-analysis')"
      />
      <van-grid-item
        icon="setting-o"
        :text="t('mu-biao')"
        @click="emit('go-to-goals')"
      />
    </van-grid>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits<{
  "go-to-health": [];
  "go-to-diet": [];
  "go-to-analysis": [];
  "go-to-goals": [];
}>();
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.quick-actions {
  margin-bottom: $space-sm;

  :deep(.van-grid) {
    .van-grid-item__content {
      padding: $space-sm 6px;
      background: $white;
      border-radius: $radius-md;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:active {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .van-grid-item__icon {
      font-size: 35px;
      color: $primary-color;
    }

    .van-grid-item__text {
      margin-top: 6px;
      font-size: $font-size-xs;
      color: $text-color;
      font-weight: 500;
    }
  }
}
</style>
