<template>
  <div class="profile">
    <van-nav-bar title="个人中心" fixed />

    <div class="content" style="padding-top: 46px;">
      <!-- 用户信息 -->
      <div class="user-info">
        <van-image
          round
          width="80"
          height="80"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="user-name">用户昵称</div>
        <div class="user-desc">健康生活，从今天开始</div>
      </div>

      <!-- 功能列表 -->
      <van-cell-group inset>
        <van-cell title="个人资料" is-link @click="showToast('功能开发中')" icon="manager-o" />
        <van-cell title="健康目标" is-link @click="showToast('功能开发中')" icon="flag-o" />
        <van-cell title="数据统计" is-link @click="showToast('功能开发中')" icon="chart-trending-o" />
      </van-cell-group>

      <van-cell-group inset>
        <van-cell title="设置" is-link @click="showToast('功能开发中')" icon="setting-o" />
        <van-cell title="帮助与反馈" is-link @click="showToast('功能开发中')" icon="question-o" />
        <van-cell title="关于我们" is-link @click="showToast('功能开发中')" icon="info-o" />
      </van-cell-group>

      <div style="margin: 24px 16px;">
        <van-button round block type="danger" @click="onLogout">
          退出登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast, showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

function onLogout() {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  })
    .then(() => {
      // 清除本地存储的登录信息
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')

      showToast('已退出登录')

      // 跳转到登录页
      router.replace('/login')
    })
    .catch(() => {
      // 取消退出
    })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.profile {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md;
  padding-bottom: 70px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xl 0;
  margin-bottom: $space-md;

  .user-name {
    margin-top: $space-md;
    font-size: $font-size-xl;
    font-weight: bold;
    color: $text-color;
  }

  .user-desc {
    margin-top: $space-xs;
    font-size: $font-size-md;
    color: $text-color-2;
  }
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}
</style>
