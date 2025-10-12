<template>
  <div class="health-calendar">
    <van-nav-bar
      :title="t('utils.quickActions.healthCheckIn')"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="content">
      <!-- 当月打卡统计 -->
      <div class="stats-card">
        <div class="stats-header">
          <span class="title">{{
            t("currentmonth-1-yue-da-ka-jin-du", [currentMonth + 1])
          }}</span>
          <span class="count"
            >{{ monthStats.checkedDays }} / {{ monthStats.totalDays }}</span
          >
        </div>
        <van-progress
          :percentage="checkedRate"
          stroke-width="8"
          color="linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
          track-color="rgba(255, 255, 255, 0.3)"
          :show-pivot="false"
        />
      </div>

      <!-- 打卡日历展示 -->
      <div class="calendar-display">
        <!-- 月份切换 -->
        <div class="month-header">
          <van-icon
            name="arrow-left"
            @click="prevMonth"
            :class="{ disabled: !canGoPrev }"
          />
          <div class="month-title">{{ currentMonthTitle }}</div>
          <van-icon
            name="arrow"
            @click="nextMonth"
            :class="{ disabled: !canGoNext }"
          />
        </div>

        <!-- 星期标题 -->
        <div class="weekdays">
          <div class="weekday">{{ t("ri") }}</div>
          <div class="weekday">{{ t("yi") }}</div>
          <div class="weekday">{{ t("er") }}</div>
          <div class="weekday">{{ t("san") }}</div>
          <div class="weekday">{{ t("si") }}</div>
          <div class="weekday">{{ t("wu") }}</div>
          <div class="weekday">{{ t("liu") }}</div>
        </div>

        <!-- 日期网格 -->
        <div class="days-grid">
          <div
            v-for="day in calendarDays"
            :key="day.key"
            :class="[
              'day-cell',
              {
                'other-month': !day.isCurrentMonth,
                today: day.isToday,
                checked: day.isChecked,
                disabled: day.isFuture,
              },
            ]"
            @click="onDayClick(day)"
          >
            <div class="day-number">{{ day.day }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { getHealthRecords } from "@/api/health";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

// 当前显示的月份
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth()); // 0-11

// 打卡记录
const recentRecords = ref<any[]>([]);
const checkedDates = ref<Set<string>>(new Set());

// 当前月份标题
const currentMonthTitle = computed(() => {
  return t("currentyearvalue-nian-currentmonthvalue-1-yue", [
    currentYear.value,
    currentMonth.value + 1,
  ]);
});

// 是否可以切换到上一月
const canGoPrev = computed(() => {
  return !(currentYear.value === 2020 && currentMonth.value === 0);
});

// 是否可以切换到下一月
const canGoNext = computed(() => {
  const now = new Date();
  return !(
    currentYear.value === now.getFullYear() &&
    currentMonth.value === now.getMonth()
  );
});

// 生成当前月份的日历数据
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 获取当月第一天是星期几（0-6）
  const firstDayOfWeek = firstDay.getDay();

  // 获取上个月的天数
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days: any[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 添加上个月的日期（填充）
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    const dateStr = formatDate(date);

    days.push({
      key: `prev-${day}`,
      day,
      date,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      isChecked: checkedDates.value.has(dateStr),
      isFuture: date > today,
    });
  }

  // 添加当月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);

    days.push({
      key: `current-${day}`,
      day,
      date,
      dateStr,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      isChecked: checkedDates.value.has(dateStr),
      isFuture: date > today,
    });
  }

  // 添加下个月的日期（填充到42格，6行）
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    const dateStr = formatDate(date);

    days.push({
      key: `next-${day}`,
      day,
      date,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      isChecked: checkedDates.value.has(dateStr),
      isFuture: date > today,
    });
  }

  return days;
});

// 当前月份统计
const monthStats = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const totalDays = new Date(year, month + 1, 0).getDate();

  let checkedDays = 0;
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    if (checkedDates.value.has(dateStr)) {
      checkedDays++;
    }
  }

  return { checkedDays, totalDays };
});

// 打卡率
const checkedRate = computed(() => {
  if (monthStats.value.totalDays === 0) return 0;
  return Math.round(
    (monthStats.value.checkedDays / monthStats.value.totalDays) * 100
  );
});

// 格式化日期
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 点击日期
function onDayClick(day: any) {
  if (day.isFuture) return; // 未来日期不可点击
  router.push({
    path: "/health/form",
    query: { date: day.dateStr },
  });
}

// 上一月
function prevMonth() {
  if (!canGoPrev.value) return;

  if (currentMonth.value === 0) {
    currentYear.value--;
    currentMonth.value = 11;
  } else {
    currentMonth.value--;
  }
}

// 下一月
function nextMonth() {
  if (!canGoNext.value) return;

  if (currentMonth.value === 11) {
    currentYear.value++;
    currentMonth.value = 0;
  } else {
    currentMonth.value++;
  }
}

// 加载打卡记录
async function loadRecords() {
  try {
    // 获取今年所有的记录
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1); // 今年1月1日
    const endDate = now;

    const response = await getHealthRecords({
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      limit: 366, // 一年最多366天
    });

    // 尝试不同的数据路径
    let records =
      response.data?.data?.records || (response.data as any)?.records || [];

    if (records && records.length > 0) {
      recentRecords.value = records.slice(0, 10);

      // 构建已打卡日期集合 - 需要按本地时区处理
      checkedDates.value = new Set(
        records.map((r: any) => {
          // 将ISO日期字符串转换为本地日期
          const date = new Date(r.record_date);
          return formatDate(date);
        })
      );
    }
  } catch (error) {
    console.error("加载打卡记录失败:", error);
  }
}

function onClickLeft() {
  router.push("/");
}

onMounted(() => {
  loadRecords();
});

// 页面激活时重新加载数据（从表单返回时）
onActivated(() => {
  loadRecords();
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.health-calendar {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: 0 $space-md;
  padding-bottom: 70px;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: $space-md 0;
  padding: $space-lg;
  border-radius: $radius-lg;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  color: $white;

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;

    .title {
      font-size: $font-size-lg;
      font-weight: 500;
    }

    .count {
      font-size: $font-size-lg;
      font-weight: bold;
    }
  }

  :deep(.van-progress) {
    background: transparent;
  }
}

.calendar-display {
  margin: $space-md 0;
  background: $white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: $space-md;

  .month-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    margin-bottom: $space-md;

    .month-title {
      font-size: $font-size-lg;
      font-weight: bold;
      color: $text-color;
    }

    .van-icon {
      font-size: 20px;
      color: $primary-color;
      cursor: pointer;
      padding: $space-xs;

      &.disabled {
        color: $text-color-3;
        cursor: not-allowed;
      }
    }
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: $space-sm;

    .weekday {
      text-align: center;
      font-size: $font-size-sm;
      color: $text-color-2;
      padding: $space-sm 0;
    }
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;

    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;

      &.other-month {
        .day-number {
          color: $text-color-3;
        }
      }

      &.today {
        .day-number {
          color: $primary-color;
          font-weight: bold;
        }
      }

      &.checked {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .day-number {
          color: $white;
          font-weight: bold;
        }
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      &:not(.disabled):not(.other-month):hover {
        background: #f7f8fa;
      }

      &.checked:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0.9;
      }

      .day-number {
        font-size: $font-size-base;
        color: $text-color;
      }
    }
  }
}
</style>
