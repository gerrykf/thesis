<template>
  <div class="profile">
    <van-nav-bar :title="t('profile.title')" fixed placeholder />

    <div class="content">
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="avatar-upload-wrapper">
          <van-uploader
            v-model="fileList"
            :max-count="1"
            :max-size="5 * 1024 * 1024"
            :before-read="beforeRead"
            :after-read="afterRead"
            :deletable="false"
            preview-size="80"
            @oversize="onOversize"
          >
            <template #default>
              <div class="avatar-wrapper">
                <van-image
                  v-if="avatarUrl && !isUploading"
                  round
                  :src="avatarUrl"
                  fit="cover"
                >
                  <template #error>
                    <div class="avatar-placeholder">
                      <van-icon name="user-o" size="40" />
                    </div>
                  </template>
                </van-image>
                <div v-else-if="!isUploading" class="avatar-placeholder">
                  <van-icon name="user-o" size="40" />
                </div>

                <!-- 上传状态显示 -->
                <div v-if="isUploading" class="avatar-uploading">
                  <van-loading type="spinner" size="30" color="#1989fa" />
                  <div class="upload-text">{{ t("shang-chuan-zhong") }}</div>
                </div>

                <div class="avatar-mask">
                  <van-icon name="photograph" size="20" color="#fff" />
                </div>
              </div>
            </template>
          </van-uploader>
        </div>
        <div class="user-name">{{ userName }}</div>
        <div class="user-desc">
          {{ t("jian-kang-sheng-huo-cong-jin-tian-kai-shi") }}
        </div>
      </div>

      <!-- 功能列表 -->
      <van-cell-group inset>
        <van-cell
          :title="t('ge-ren-zi-liao')"
          is-link
          @click="goToEdit"
          icon="manager-o"
        />
        <van-cell
          :title="t('jian-kang-mu-biao')"
          is-link
          @click="goToGoals"
          icon="flag-o"
        />
        <van-cell
          :title="t('shu-ju-tong-ji')"
          is-link
          @click="goToAnalysis"
          icon="chart-trending-o"
        />
      </van-cell-group>

      <van-cell-group inset>
        <van-cell
          :title="t('settings.title')"
          is-link
          @click="goToSettings"
          icon="setting-o"
        />
        <!-- <van-cell title="帮助与反馈" is-link @click="showToast('功能开发中')" icon="question-o" />
        <van-cell title="关于我们" is-link @click="showToast('功能开发中')" icon="info-o" /> -->
      </van-cell-group>

      <div style="margin: 24px 16px">
        <van-button round block type="danger" @click="onLogout">
          {{ t("profile.logout") }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated } from "vue";
import { showToast, showConfirmDialog } from "vant";
import type { UploaderFileListItem } from "vant";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { postAuthAvatar } from "@/api/auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const userStore = useUserStore();
const fileList = ref<UploaderFileListItem[]>([]);
const isUploading = ref(false);

// 从 store 获取用户信息
const userName = computed(() => userStore.nickname);

// 页面激活时刷新用户信息（包括首次挂载和从其他页面返回）
onActivated(() => {
  userStore.refreshUserInfo();
});

// 获取头像URL
const avatarUrl = computed(() => {
  const avatar = userStore.userInfo?.avatar;
  if (!avatar) {
    return "";
  }
  // 直接返回路径，vite 代理会自动转发到后端
  return avatar;
});

function goToEdit() {
  router.push("/profile");
}

function goToGoals() {
  router.push("/goals");
}

function goToAnalysis() {
  router.push("/analysis");
}

function goToSettings() {
  router.push("/settings");
}

// 文件读取前的校验
function beforeRead(file: File | File[]) {
  // 处理单个文件或文件数组
  const fileToCheck = Array.isArray(file) ? file[0] : file;

  if (!fileToCheck) {
    return false;
  }

  // 验证文件类型
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(fileToCheck.type)) {
    showToast(t("zhi-zhi-chi-shang-chuan-jpgpnggifwebp-ge-shi-de-tu-pian"));
    return false;
  }
  return true;
}

// 文件超过大小限制
function onOversize() {
  showToast(t("tu-pian-da-xiao-bu-neng-chao-guo-5mb"));
}

// 文件读取完成后上传
async function afterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
  // 确保是单个文件
  const fileItem = Array.isArray(file) ? file[0] : file;

  if (!fileItem?.file) return;

  // 设置上传状态
  isUploading.value = true;
  fileItem.status = "uploading";
  fileItem.message = t("shang-chuan-zhong-0");

  try {
    const res = await postAuthAvatar(fileItem.file);

    // axios 拦截器已解包数据
    const data = res as any;
    if (data.success && data.data?.avatarUrl) {
      // 设置成功状态
      fileItem.status = "done";
      fileItem.message = "";

      // 方式1: 立即更新 store 中的头像（快速响应）
      userStore.updateAvatar(data.data.avatarUrl);

      // 方式2: 从服务器刷新完整用户信息（确保数据一致性）
      userStore.refreshUserInfo();

      showToast(t("tou-xiang-shang-chuan-cheng-gong"));

      // 清空文件列表，允许再次上传
      setTimeout(() => {
        fileList.value = [];
        isUploading.value = false;
      }, 1000);
    } else {
      // 设置失败状态
      fileItem.status = "failed";
      fileItem.message = t("shang-chuan-shi-bai");
      isUploading.value = false;
      showToast(data.message || t("shang-chuan-shi-bai-0"));
    }
  } catch (error: any) {
    // 设置失败状态
    fileItem.status = "failed";
    fileItem.message = t("shang-chuan-shi-bai-1");
    isUploading.value = false;
    console.error("上传头像失败:", error);
    showToast(error.message || t("shang-chuan-shi-bai-2"));
  }
}

function onLogout() {
  showConfirmDialog({
    title: t("ti-shi"),
    message: t("que-ding-yao-tui-chu-deng-lu-ma"),
  })
    .then(() => {
      // 使用 store 的 logout 方法（会保留记住的密码）
      userStore.logout();

      showToast(t("yi-tui-chu-deng-lu"));

      // 跳转到登录页
      router.replace("/login");
    })
    .catch(() => {
      // 取消退出
    });
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.profile {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md 0;
  padding-bottom: 70px;
  padding-top: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xl 0;
  margin-bottom: $space-md;
  background: linear-gradient(
    to bottom,
    rgba(25, 137, 250, 0.08),
    var(--card-bg, #ffffff)
  );

  .avatar-upload-wrapper {
    display: inline-block;
    width: 100px;
    height: 100px;

    :deep(.van-uploader) {
      display: inline-block;
      width: 100%;
      height: 100%;

      .van-uploader__wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
      }

      // 隐藏预览图片
      .van-uploader__preview {
        display: none !important;
      }

      // 让input覆盖在头像上
      .van-uploader__input-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        cursor: pointer;

        input {
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: transform 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .van-image,
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: block;
    }

    .avatar-mask {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 26px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0 0 40px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 5;
      pointer-events: none;
    }

    &:hover .avatar-mask,
    &:active .avatar-mask {
      opacity: 1;
    }

    .avatar-placeholder {
      border-radius: 50%;
      background: $background-color;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-color-3;
    }

    .avatar-uploading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 15;

      .upload-text {
        margin-top: 8px;
        font-size: 12px;
        color: #1989fa;
      }
    }
  }

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
