<template>
  <div class="category-section" v-if="categories.length > 0">
    <Swiper
      ref="categorySwiperRef"
      :modules="swiperModules"
      :slides-per-view="'auto'"
      :space-between="8"
      :free-mode="true"
      class="category-swiper"
    >
      <SwiperSlide class="category-slide">
        <div
          class="category-item"
          :class="{ active: selectedCategory === '' }"
          @click="handleSelectCategory('', 0)"
        >
          {{ t("全部") }}
        </div>
      </SwiperSlide>
      <SwiperSlide
        v-for="(item, index) in categories"
        :key="item.category"
        class="category-slide"
      >
        <div
          class="category-item"
          :class="{ active: selectedCategory === item.category }"
          @click="handleSelectCategory(item.category!, index + 1)"
        >
          {{ item.category }} ({{ item.count }})
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper/modules";
import "swiper/swiper.css";

const { t } = useI18n();

interface Props {
  categories: { category?: string; count?: number }[];
  selectedCategory: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [category: string];
}>();

const swiperModules = [FreeMode];
const categorySwiperRef = ref<any>(null);

function handleSelectCategory(category: string, index: number) {
  emit("select", category);

  // 智能居中：前几个靠左，中间居中，最后几个靠右
  nextTick(() => {
    const swiper = categorySwiperRef.value?.$el?.swiper;
    if (!swiper) return;

    const clickedSlide = swiper.slides[index];
    if (!clickedSlide) return;

    // 获取容器和 slide 信息
    const swiperWidth = swiper.width;
    const slideLeft = clickedSlide.offsetLeft;
    const slideWidth = clickedSlide.offsetWidth;
    const totalWidth = swiper.virtualSize;

    // 计算居中所需的偏移量
    const centerOffset = slideLeft - (swiperWidth / 2 - slideWidth / 2);
    const maxTranslate = totalWidth - swiperWidth;

    // 智能调整
    let targetTranslate;
    if (centerOffset <= 0) {
      targetTranslate = 0;
    } else if (centerOffset >= maxTranslate) {
      targetTranslate = maxTranslate;
    } else {
      targetTranslate = centerOffset;
    }

    // 设置过渡动画并滑动
    swiper.setTranslate(-targetTranslate);
    swiper.transitionStart();
    setTimeout(() => {
      swiper.transitionEnd();
    }, 300);
  });
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.category-section {
  background: $white;
  padding: 6px 0;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;

  .category-swiper {
    padding: 0 $space-sm;
    transition: transform 0.3s ease-out;

    .category-slide {
      width: auto;
    }

    .category-item {
      display: inline-block;
      padding: 4px 12px;
      background: $background-color;
      color: $text-color-2;
      font-size: $font-size-xs;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid transparent;
      white-space: nowrap;

      &:active {
        transform: scale(0.95);
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: $white;
        font-weight: 500;
        border-color: transparent;
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
      }
    }
  }
}
</style>
