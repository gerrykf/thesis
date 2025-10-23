<template>
  <div class="welcome-section">
    <div class="welcome-row">
      <h2>{{ greeting }}，{{ userName }}</h2>
      <p class="date">{{ currentDate }} {{ weekday }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { formatChineseDate, getWeekday, getGreeting } from "../utils";

const userStore = useUserStore();

const greeting = computed(() => getGreeting());
const currentDate = computed(() => formatChineseDate());
const weekday = computed(() => getWeekday());
const userName = computed(() => userStore.nickname);
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.welcome-section {
  margin-bottom: $space-xs;

  .welcome-row {
    display: flex;
    align-items: baseline;
    gap: $space-sm;
    flex-wrap: wrap;
  }

  h2 {
    font-size: $font-size-lg;
    margin: 0;
    color: $text-color;
    white-space: nowrap;
  }

  .date {
    color: $text-color-2;
    font-size: $font-size-xs;
    margin: 0;
    white-space: nowrap;
  }
}
</style>
