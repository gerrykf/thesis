<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/health" icon="add-o">打卡</van-tabbar-item>
      <van-tabbar-item to="/diet" icon="goods-collect-o">饮食</van-tabbar-item>
      <van-tabbar-item to="/history" icon="clock-o">历史</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
</script>

<style scoped>
.app {
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--white);
  position: relative;
}

/* PC端居中效果 */
@media (min-width: 769px) {
  .app {
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    min-height: calc(100vh - 20px);
  }

  body {
    background: #f5f5f5;
  }
}
</style>
