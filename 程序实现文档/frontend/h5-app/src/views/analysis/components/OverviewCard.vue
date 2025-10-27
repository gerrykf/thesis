<template>
  <div v-if="overview" class="overview-card">
    <div class="overview-header">
      <h3>{{ t("shu-ju-gai-lan") }}</h3>
      <span class="overview-period">{{
        t("zui-jin-activetab-tian", [days])
      }}</span>
    </div>

    <div class="stats-grid">
      <div class="stat-item stat-weight">
        <div class="stat-icon">⚖</div>
        <div class="stat-info">
          <div class="stat-label">{{ t("ping-jun-ti-zhong") }}</div>
          <div class="stat-value">
            {{ formatNumber(overview.avg_weight) }}
            <span class="unit">kg</span>
          </div>
        </div>
      </div>

      <div class="stat-item stat-exercise">
        <div class="stat-icon">🏃‍♂️</div>
        <div class="stat-info">
          <div class="stat-label">{{ t("ping-jun-yun-dong") }}</div>
          <div class="stat-value">
            {{ formatNumber(overview.avg_exercise_duration) }}
            <span class="unit">{{ t("fen-zhong") }}</span>
          </div>
        </div>
      </div>

      <div class="stat-item stat-sleep">
        <div class="stat-icon">😴</div>
        <div class="stat-info">
          <div class="stat-label">{{ t("ping-jun-shui-mian") }}</div>
          <div class="stat-value">
            {{ formatNumber(overview.avg_sleep_hours) }}
            <span class="unit">{{ t("xiao-shi") }}</span>
          </div>
        </div>
      </div>

      <div class="stat-item stat-calorie">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <div class="stat-label">{{ t("ping-jun-re-liang") }}</div>
          <div class="stat-value">
            {{ formatNumber(overview.avg_daily_calories) }}
            <span class="unit">kcal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface OverviewData {
  avg_weight?: number;
  avg_exercise_duration?: number;
  avg_sleep_hours?: number;
  avg_daily_calories?: number;
  health_records_count?: number;
  diet_records_count?: number;
  total_calories?: number;
}

interface Props {
  overview: OverviewData | undefined;
  days?: number;
}

withDefaults(defineProps<Props>(), {
  days: 7,
});

/**
 * 格式化数字
 */
function formatNumber(value?: number): string {
  if (!value || typeof value !== "number" || isNaN(value)) return "0";
  return value.toFixed(1);
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.overview-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-lg;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .overview-header {
    @include flex-between;
    align-items: center;
    margin-bottom: $space-lg;

    h3 {
      font-size: $font-size-lg;
      color: $text-color;
      margin: 0;
    }

    .overview-period {
      font-size: $font-size-sm;
      color: $text-color-3;
      padding: 4px $space-sm;
      background: $background-color;
      border-radius: $radius-md;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-md;

    .stat-item {
      display: flex;
      align-items: center;
      gap: $space-md;
      padding: $space-md;
      border-radius: $radius-md;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      // 体重 - 蓝色
      &.stat-weight {
        background: linear-gradient(
          135deg,
          var(--gradient-weight-start) 0%,
          var(--gradient-weight-end) 100%
        );
        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);

        &:hover {
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }
      }

      // 运动 - 橙色
      &.stat-exercise {
        background: linear-gradient(
          135deg,
          var(--gradient-exercise-start) 0%,
          var(--gradient-exercise-end) 100%
        );
        box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);

        &:hover {
          box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        }
      }

      // 睡眠 - 薰衣草紫
      &.stat-sleep {
        background: linear-gradient(
          135deg,
          var(--gradient-sleep-start) 0%,
          var(--gradient-sleep-end) 100%
        );
        box-shadow: 0 2px 8px rgba(156, 39, 176, 0.2);

        &:hover {
          box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
        }
      }

      // 热量 - 红橙色
      &.stat-calorie {
        background: linear-gradient(
          135deg,
          var(--gradient-calorie-start) 0%,
          var(--gradient-calorie-end) 100%
        );
        box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);

        &:hover {
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }
      }

      .stat-icon {
        font-size: 32px;
        flex-shrink: 0;
      }

      .stat-info {
        flex: 1;
        min-width: 0;

        .stat-label {
          font-size: $font-size-sm;
          color: $text-color-2;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $text-color;

          .unit {
            font-size: $font-size-xs;
            font-weight: 400;
            color: $text-color-3;
            margin-left: 2px;
          }
        }
      }
    }
  }
}
</style>
