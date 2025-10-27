<template>
  <div class="check-in-card" data-v-step="1">
    <div class="card-header">
      <div class="title-row">
        <h3>{{ t("jin-ri-da-ka") }}</h3>
        <van-tag v-if="hasCheckedIn" type="success" size="medium">{{
          t("yi-da-ka")
        }}</van-tag>
        <van-tag v-else type="warning" size="medium">{{ t("qu-da-ka") }}</van-tag>
      </div>
    </div>

    <!-- 已打卡：显示简要数据 - 网格布局 -->
    <div v-if="hasCheckedIn" class="checked-in-data">
      <div class="data-grid">
        <div class="data-card mood">
          <div class="card-icon">{{ moodIcon }}</div>
          <div class="card-info">
            <div class="card-value">{{ moodDisplay }}</div>
          </div>
        </div>
        <div class="data-card weight">
          <div class="card-icon">⚖</div>
          <div class="card-info">
            <div class="card-value">
              {{ todayData.weight }}<span class="unit">kg</span>
            </div>
          </div>
        </div>
        <div class="data-card exercise" v-if="todayData.exercise">
          <div class="card-icon">🏃‍♂️</div>
          <div class="card-info">
            <div class="card-value">{{ exerciseDisplay }}</div>
            <div class="card-extra">{{ exerciseTypeDisplay }}</div>
          </div>
        </div>
        <div class="data-card sleep">
          <div class="card-icon">😴</div>
          <div class="card-info">
            <div class="card-value">{{ sleepDisplay }}</div>
            <div class="card-extra">{{ sleepQualityText }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未打卡：显示提示 -->
    <div v-else class="not-checked-in">
      <div class="tip-icon">📝</div>
      <p class="tip-text">{{ t("jin-tian-huan-mei-you-da-kao-ji-lu-yi-xia-ba") }}</p>
      <van-button type="primary" size="small" round @click="emit('go-to-health')">
        {{ t("li-ji-da-ka") }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface TodayData {
  mood?: string;
  weight?: number;
  exercise?: number;
  exercise_type?: string;
  sleep?: number;
  sleep_quality?: string;
}

interface Props {
  hasCheckedIn: boolean;
  todayData: TodayData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "go-to-health": [];
}>();

// 格式化运动时长显示
const exerciseDisplay = computed(() => {
  const minutes = props.todayData.exercise;
  if (!minutes) return t("wei-yun-dong");
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return t("hours-xiao-shi", [hours]);
    }
    return t("hours-xiao-shi-remainingminutes-fen-zhong", [hours, remainingMinutes]);
  }
  return t("minutes-fen-zhong", [minutes]);
});

// 运动类型显示
const exerciseTypeDisplay = computed(() => {
  return props.todayData.exercise_type || t("qi-ta-yun-dong");
});

// 睡眠时长显示
const sleepDisplay = computed(() => {
  const hours = props.todayData.sleep;
  return hours ? t("hours-xiao-shi-0", [hours]) : t("wei-ji-lu");
});

// 睡眠质量文本
const sleepQualityText = computed(() => {
  const qualityMap: Record<string, string> = {
    excellent: t("you-xiu"),
    good: t("liang-hao"),
    fair: t("yi-ban"),
    poor: t("jiao-cha"),
  };
  return qualityMap[props.todayData.sleep_quality || ""] || t("wei-ping-jia");
});

// 心情状态显示
const moodDisplay = computed(() => {
  const moodMap: Record<string, string> = {
    excellent: t("xin-qing-hen-hao"),
    good: t("xin-qing-bu-cuo"),
    fair: t("xin-qing-yi-ban"),
    poor: t("xin-qing-qian-jia"),
  };
  return moodMap[props.todayData.mood || ""] || t("wei-ji-lu-0");
});

// 心情图标
const moodIcon = computed(() => {
  const iconMap: Record<string, string> = {
    excellent: "😄",
    good: "😊",
    fair: "😐",
    poor: "😔",
  };
  return iconMap[props.todayData.mood || ""] || "😶";
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.check-in-card {
  background: $white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .card-header {
    margin-bottom: $space-sm;

    .title-row {
      @include flex-between;
      align-items: center;

      h3 {
        font-size: $font-size-base;
        color: $text-color;
      }
    }
  }

  .checked-in-data {
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 6px;
    }

    .data-card {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px;
      background: $background-color;
      border-radius: $radius-sm;
      transition: all 0.3s;
      margin: 4px 0;

      &:active {
        transform: scale(0.98);
      }

      .card-icon {
        font-size: 35px;
        flex-shrink: 0;
      }

      .card-info {
        flex: 1;
        min-width: 0;

        .card-value {
          font-size: $font-size-base;
          color: $text-color;
          font-weight: 600;
          line-height: 1.2;

          .unit {
            font-size: $font-size-xs;
            font-weight: 400;
            color: $text-color-2;
            margin-left: 1px;
          }
        }

        .card-extra {
          font-size: $font-size-xs;
          color: $text-color-3;
          line-height: 1.3;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
    }
  }

  .not-checked-in {
    text-align: center;
    padding: $space-md 0;

    .tip-icon {
      font-size: 46px;
      margin-bottom: $space-xs;
    }

    .tip-text {
      font-size: $font-size-sm;
      color: $text-color-2;
      margin-bottom: $space-md;
    }
  }
}
</style>
