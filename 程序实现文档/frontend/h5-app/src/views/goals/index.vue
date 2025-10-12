<template>
  <div class="goals">
    <van-nav-bar :title="t('wo-de-mu-biao')" fixed placeholder>
      <template #left>
        <van-icon name="arrow-left" @click="goBack" />
      </template>
      <template #right>
        <van-icon name="plus" @click="showAddDialog = true" data-v-step="3" />
      </template>
    </van-nav-bar>

    <!-- Vue3 Tour 引导 -->
    <v-tour
      name="goalsTour"
      :steps="tourSteps"
      :callbacks="tourCallbacks"
      :options="tourOptions"
    ></v-tour>

    <div class="content">
      <!-- 目标列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" data-v-step="2">
        <div v-if="goals.length > 0" class="goals-list">
          <div
            v-for="goal in goals"
            :key="goal.id"
            class="goal-card"
            :data-v-step="goal === goals[0] ? '1' : ''"
            @click="onEditGoal(goal)"
          >
            <div class="goal-header">
              <div class="goal-type-badge" :class="`type-${goal.goal_type}`">
                {{ getGoalTypeText(goal.goal_type) }}
              </div>
              <div class="goal-status" :class="`status-${goal.status}`">
                {{ getStatusText(goal.status) }}
              </div>
            </div>
            <div class="goal-title">{{ goal.goal_name }}</div>
            <div class="goal-progress">
              <van-progress
                :percentage="getProgressPercentage(goal)"
                :show-pivot="false"
                :stroke-width="8"
                color="#667eea"
              />
              <div class="progress-text">
                <span class="current"
                  >{{ goal.current_value }}{{ goal.unit }}</span
                >
                <span class="separator">/</span>
                <span class="target"
                  >{{ goal.target_value }}{{ goal.unit }}</span
                >
              </div>
            </div>
            <div v-if="goal.target_date" class="goal-footer">
              <span class="date-label">{{ t('mu-biao-ri-qi') }}</span>
              <span class="date-value">{{ formatDate(goal.target_date) }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <van-empty v-else description="暂无目标，点击右上角添加" data-v-step="1" />
      </van-pull-refresh>
    </div>

    <!-- 添加目标弹窗 -->
    <van-popup
      v-model:show="showAddDialog"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="dialog-header">
        <van-button plain @click="() => (showAddDialog = false)"
          >{{ t('common.cancel') }}</van-button
        >
        <span class="title">{{ t('tian-jia-mu-biao') }}</span>
        <van-button plain type="primary" @click="onAddGoal">{{ t('common.save') }}</van-button>
      </div>
      <div class="dialog-content">
        <van-form ref="addFormRef">
          <van-field
            v-model="addForm.goal_name"
            name="goal_name"
            :label="t('mu-biao-ming-cheng')"
            :placeholder="t('qing-shu-ru-mu-biao-ming-cheng')"
            :rules="[{ required: true, message: '请输入目标名称' }]"
          />
          <van-field name="goal_type" :label="t('mu-biao-lei-xing')">
            <template #input>
              <div class="goal-type-tags">
                <van-tag
                  v-for="type in goalTypes"
                  :key="type.value"
                  :type="addForm.goal_type === type.value ? type.color as any : 'default'"
                  size="large"
                  :plain="addForm.goal_type !== type.value"
                  @click="addForm.goal_type = type.value as GoalType"
                >
                  {{ type.label }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-field
            v-model="addForm.current_value"
            name="current_value"
            type="number"
            :label="t('dang-qian-zhi')"
            :placeholder="t('qing-shu-ru-dang-qian-zhi')"
            :rules="[{ required: true, message: '请输入当前值' }]"
          />
          <van-field
            v-model="addForm.target_value"
            name="target_value"
            type="number"
            :label="t('mu-biao-zhi')"
            :placeholder="t('qing-shu-ru-mu-biao-zhi')"
            :rules="[{ required: true, message: '请输入目标值' }]"
          />
          <van-field
            v-model="addForm.unit"
            name="unit"
            :label="t('dan-wei')"
            :placeholder="t('ru-kg-fen-zhong-kcal')"
            :rules="[{ required: true, message: '请输入单位' }]"
          />
          <van-field
            :model-value="formattedAddStartDate"
            is-link
            readonly
            name="start_date"
            :label="t('kai-shi-ri-qi')"
            :placeholder="t('xuan-ze-kai-shi-ri-qi')"
            @click="() => (showStartDatePicker = true)"
          />
          <van-field
            :model-value="formattedAddTargetDate"
            is-link
            readonly
            name="target_date"
            :label="t('mu-biao-ri-qi-0')"
            :placeholder="t('xuan-ze-mu-biao-ri-qi-ke-xuan')"
            @click="() => (showTargetDatePicker = true)"
          />
          <van-field
            v-model="addForm.description"
            rows="2"
            autosize
            :label="t('miao-shu')"
            type="textarea"
            maxlength="200"
            :placeholder="t('qing-shu-ru-mu-biao-miao-shu-ke-xuan')"
            show-word-limit
          />
        </van-form>
      </div>
    </van-popup>

    <!-- 编辑目标弹窗 -->
    <van-popup
      v-model:show="showEditDialog"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="dialog-header">
        <van-button plain @click="() => (showEditDialog = false)"
          >{{ t('common.cancel') }}</van-button
        >
        <span class="title">{{ t('bian-ji-mu-biao') }}</span>
        <van-button plain type="danger" @click="onDeleteGoal">{{ t('common.delete') }}</van-button>
      </div>
      <div class="dialog-content">
        <van-form ref="editFormRef">
          <van-field
            v-model="editForm.goal_name"
            name="goal_name"
            :label="t('mu-biao-ming-cheng-0')"
            :placeholder="t('qing-shu-ru-mu-biao-ming-cheng-0')"
          />
          <van-field
            v-model="editForm.current_value"
            name="current_value"
            type="number"
            :label="t('dang-qian-zhi-0')"
            :placeholder="t('qing-shu-ru-dang-qian-zhi-0')"
          />
          <van-field
            v-model="editForm.target_value"
            name="target_value"
            type="number"
            :label="t('mu-biao-zhi-0')"
            :placeholder="t('qing-shu-ru-mu-biao-zhi-0')"
          />
          <van-field
            :model-value="formattedEditTargetDate"
            is-link
            readonly
            name="target_date"
            :label="t('mu-biao-ri-qi-1')"
            :placeholder="t('xuan-ze-mu-biao-ri-qi')"
            @click="handleShowEditDatePicker"
          />
          <van-field name="status" :label="t('zhuang-tai')">
            <template #input>
              <van-radio-group v-model="editForm.status" direction="horizontal">
                <van-radio name="active">{{ t('jin-hang-zhong') }}</van-radio>
                <van-radio name="completed">{{ t('yi-wan-cheng') }}</van-radio>
                <van-radio name="paused">{{ t('yi-zan-ting') }}</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="editForm.description"
            rows="2"
            autosize
            :label="t('miao-shu-0')"
            type="textarea"
            maxlength="200"
            :placeholder="t('qing-shu-ru-mu-biao-miao-shu')"
            show-word-limit
          />
        </van-form>
        <div class="form-actions">
          <van-button block type="primary" @click="onUpdateGoal"
            >{{ t('bao-cun-xiu-gai') }}</van-button
          >
        </div>
      </div>
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showStartDatePicker" position="bottom">
      <van-date-picker
        v-model="startDatePickerValue"
        @confirm="onStartDateConfirm"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showTargetDatePicker" position="bottom">
      <van-date-picker
        v-model="targetDatePickerValue"
        @confirm="onTargetDateConfirm"
        @cancel="showTargetDatePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showEditTargetDatePicker" position="bottom">
      <van-date-picker
        v-model="editTargetDatePickerValue"
        @confirm="onEditTargetDateConfirm"
        @cancel="showEditTargetDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import {
  useGoalList,
  useAddGoalForm,
  useEditGoalForm,
  getGoalTypeText,
  getStatusText,
  calculateProgress,
  formatDate,
} from "./utils";
import type { GoalType, UserGoal } from "./utils";
import { useI18n } from "vue-i18n";

const {t} = useI18n();

const router = useRouter();
const instance = getCurrentInstance();

// Vue3 Tour 引导配置
const tourSteps = ref([
  {
    target: '[data-v-step="1"]',
    header: {
      title: t('huan-ying-lai-dao-mu-biao-guan-li'),
    },
    content:
      t('zai-zhe-li-nin-ke-yi-she-zhi-he-guan-li-jian-kang-mu-biao-rang-wo-men-kai-shi-chuang-jian-di-yi-ge-mu-biao-ba'),
    params: {
      placement: "bottom",
      highlight: true,
    },
  },
  {
    target: '[data-v-step="3"]',
    header: {
      title: t('tian-jia-mu-biao-0'),
    },
    content:
      t('dian-ji-you-shang-jiao-de-jia-hao-an-niu-ke-yi-chuang-jian-xin-de-jian-kang-mu-biao-zhi-chi-ti-zhong-yun-dong-ka-lu-li-he-zi-ding-yi-mu-biao-lei-xing'),
    params: {
      placement: "bottom",
      highlight: true,
    },
  },
  {
    target: '[data-v-step="2"]',
    header: {
      title: t('xia-la-shua-xin'),
    },
    content:
      t('chuang-jian-mu-biao-hou-ke-yi-xia-la-ye-mian-shua-xin-mu-biao-lie-biao-dian-ji-mu-biao-ka-pian-ke-yi-bian-ji-jin-du-he-zhuang-tai-zhu-nin-geng-hao-di-zhui-zong-mu-biao-wan-cheng-qing-kuang'),
    params: {
      placement: "top",
      highlight: true,
    },
  },
]);

const tourOptions = ref({
  useKeyboardNavigation: true,
  labels: {
    buttonSkip: t('tiao-guo'),
    buttonPrevious: t('shang-yi-bu'),
    buttonNext: t('xia-yi-bu'),
    buttonStop: t('kai-shi-shi-yong'),
  },
});

const tourCallbacks = ref({
  onStop: () => {
    // 引导结束后,标记用户已完成引导
    localStorage.setItem("goalsTourCompleted", "true");
  },
  onSkip: () => {
    // 跳过引导也标记为已完成
    localStorage.setItem("goalsTourCompleted", "true");
  },
});

// 检查是否需要显示引导
function checkAndStartTour() {
  const route = router.currentRoute.value;
  const isFirstTime = route.query.firstTime === "true";
  const tourCompleted = localStorage.getItem("goalsTourCompleted");

  console.log('引导检查:', {
    isFirstTime,
    tourCompleted,
    hasTours: !!instance?.proxy?.$tours,
    hasGoalsTour: !!instance?.proxy?.$tours?.goalsTour
  });

  // 只在首次登录且未完成引导时显示
  if (isFirstTime && !tourCompleted) {
    // 延迟一下让页面完全渲染并等待 tour 组件初始化
    setTimeout(() => {
      console.log('尝试启动引导:', {
        hasTours: !!instance?.proxy?.$tours,
        hasGoalsTour: !!instance?.proxy?.$tours?.goalsTour
      });

      // 确保目标元素存在
      const targetElement = document.querySelector('[data-v-step="1"]');
      console.log('目标元素是否存在:', !!targetElement, targetElement);

      if (instance?.proxy?.$tours?.goalsTour) {
        console.log('启动目标页面引导');
        instance.proxy.$tours.goalsTour.start();

        // 检查引导是否真的启动了
        setTimeout(() => {
          const tourElement = document.querySelector('.v-step');
          const maskElement = document.querySelector('.v-tour__target--highlighted');
          console.log('引导元素检查:', {
            tourElement: !!tourElement,
            maskElement: !!maskElement
          });
        }, 500);
      } else {
        console.warn('无法找到 goalsTour 实例');
      }
    }, 1500);
  }
}

// 目标类型选项
const goalTypes = [
  { value: "weight", label: t('ti-zhong'), color: "primary" },
  { value: "exercise", label: t('yun-dong'), color: "success" },
  { value: "calories", label: t('ka-lu-li'), color: "warning" },
  { value: "custom", label: t('zi-ding-yi'), color: "default" },
];

// 使用Hooks
const { goals, refreshing, loadGoals, onRefresh } = useGoalList();
const {
  showAddDialog,
  addForm,
  showStartDatePicker,
  showTargetDatePicker,
  startDatePickerValue,
  targetDatePickerValue,
  handleAddGoal,
  resetAddForm,
} = useAddGoalForm();
const {
  showEditDialog,
  editForm,
  showEditTargetDatePicker,
  editTargetDatePickerValue,
  openEditDialog,
  handleUpdateGoal,
  handleDeleteGoal,
} = useEditGoalForm();

// 格式化编辑表单中的目标日期显示
const formattedEditTargetDate = computed(() => {
  return formatDate(editForm.value.target_date);
});

// 格式化添加表单中的开始日期显示
const formattedAddStartDate = computed(() => {
  return formatDate(addForm.value.start_date);
});

// 格式化添加表单中的目标日期显示
const formattedAddTargetDate = computed(() => {
  return formatDate(addForm.value.target_date);
});

onMounted(() => {
  loadGoals();
  resetAddForm();
  // 检查并启动引导
  checkAndStartTour();
});

function getProgressPercentage(goal: UserGoal): number {
  return calculateProgress(goal.current_value, goal.target_value);
}

function onStartDateConfirm(value: { selectedValues: string[] }) {
  addForm.value.start_date = value.selectedValues.join("-");
  showStartDatePicker.value = false;
}

function onTargetDateConfirm(value: { selectedValues: string[] }) {
  addForm.value.target_date = value.selectedValues.join("-");
  showTargetDatePicker.value = false;
}

function onEditTargetDateConfirm(value: { selectedValues: string[] }) {
  editForm.value.target_date = value.selectedValues.join("-");
  showEditTargetDatePicker.value = false;
}

function handleShowEditDatePicker() {
  // 初始化日期选择器的值
  if (editForm.value.target_date) {
    // 处理接口返回的日期，可能是 YYYY-MM-DD 或 ISO 8601 格式
    let dateStr = editForm.value.target_date;
    // 如果是 ISO 8601 格式（包含 T），只取日期部分
    if (dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0] || "";
    }
    const dateParts = dateStr.split("-");
    editTargetDatePickerValue.value = dateParts;
  } else {
    // 如果没有目标日期，使用北京时间今天
    const now = new Date();
    // 获取UTC时间戳
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    // 转换为北京时间 (UTC+8)
    const beijingTime = new Date(utcTime + 8 * 3600000);
    editTargetDatePickerValue.value = [
      String(beijingTime.getFullYear()),
      String(beijingTime.getMonth() + 1).padStart(2, "0"),
      String(beijingTime.getDate()).padStart(2, "0"),
    ];
  }
  showEditTargetDatePicker.value = true;
}

// 调用hook中的添加目标函数
async function onAddGoal() {
  await handleAddGoal(loadGoals);
}

// 调用hook中的编辑目标函数
function onEditGoal(goal: UserGoal) {
  openEditDialog(goal);
}

// 调用hook中的更新目标函数
async function onUpdateGoal() {
  await handleUpdateGoal(loadGoals);
}

// 调用hook中的删除目标函数
async function onDeleteGoal() {
  await handleDeleteGoal(loadGoals);
}

function goBack() {
  // 智能返回逻辑：
  // 1. 如果URL中有 firstTime=true 参数（首次登录），跳转到首页
  // 2. 否则使用 router.back() 返回上一页
  const route = router.currentRoute.value;

  if (route.query.firstTime === 'true') {
    // 首次登录进入目标页，返回时跳转到首页
    router.replace('/home');
  } else {
    // 其他情况（如从个人中心进入），正常返回
    router.back();
  }
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.goals {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-sm $space-md;
  padding-bottom: 80px;
  min-height: calc(100vh - 46px); // 减去导航栏高度
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  margin-top: $space-sm;
}

// 确保下拉刷新容器占满剩余空间
:deep(.van-pull-refresh) {
  min-height: calc(100vh - 46px - $space-sm * 2); // 减去导航栏和内容padding
}

// 空状态样式调整 - 使用弹性布局自动填充
:deep(.van-empty) {
  padding: $space-xl 0;
  height: 100%;
  min-height: calc(100vh - 46px - $space-sm * 2 - $space-xl * 2); // 完整视窗高度减去各种padding
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.goal-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-sm;
}

.goal-type-badge {
  font-size: $font-size-xs;
  padding: 4px $space-sm;
  border-radius: $radius-sm;
  color: $white;

  &.type-weight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.type-exercise {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.type-calories {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.type-custom {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }
}

.goal-status {
  font-size: $font-size-xs;
  padding: 4px $space-sm;
  border-radius: $radius-sm;

  &.status-active {
    color: #52c41a;
    background: #f6ffed;
  }

  &.status-completed {
    color: #1890ff;
    background: #e6f7ff;
  }

  &.status-paused {
    color: #faad14;
    background: #fffbe6;
  }

  &.status-cancelled {
    color: #8c8c8c;
    background: #fafafa;
  }
}

.goal-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: text-color;
  margin-bottom: $space-md;
}

.goal-progress {
  margin-bottom: $space-sm;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: $space-xs;
  font-size: $font-size-sm;

  .current {
    color: $primary-color;
    font-weight: bold;
  }

  .separator {
    color: text-color-3;
  }

  .target {
    color: text-color-2;
  }
}

.goal-footer {
  font-size: $font-size-sm;
  color: text-color-2;
  margin-top: $space-sm;

  .date-label {
    margin-right: $space-xs;
  }

  .date-value {
    color: text-color;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md $space-lg;
  border-bottom: 1px solid $border-color;

  .title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: text-color;
  }
}

.dialog-content {
  padding: $space-md 0;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.goal-type-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .van-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }
  }
}

.form-actions {
  padding: $space-lg 0;
}

// Vue3 Tour 自定义样式 - 高亮目标元素
:deep(.v-tour__target--highlighted) {
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.6) !important;
  position: relative !important;
  z-index: 9999 !important;
}

// 当引导激活时，body 添加遮罩层
.goals:has(.v-tour__target--highlighted) {
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9998;
    pointer-events: none;
  }
}

// 确保导航栏不会遮挡引导
:deep(.van-nav-bar) {
  z-index: 1 !important;

  &.van-nav-bar--fixed {
    z-index: 1 !important;
  }
}

:deep(.v-step) {
  background: $white !important;
  border-radius: $radius-md !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  padding: $space-md !important;
  max-width: 375px !important;
  z-index: 10000 !important;

  .v-step__header {
    margin-bottom: $space-sm !important;

    h3 {
      font-size: $font-size-lg !important;
      color: text-color !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }
  }

  .v-step__content {
    font-size: $font-size-sm !important;
    color: text-color-2 !important;
    line-height: 1.6 !important;
    margin-bottom: $space-md !important;
  }

  .v-step__buttons {
    display: flex !important;
    justify-content: space-between !important;
    gap: $space-sm !important;

    button {
      flex: 1 !important;
      padding: 9px $space-md !important;
      border-radius: $radius-sm !important;
      font-size: $font-size-sm !important;
      line-height: 6px;
      border: none !important;
      cursor: pointer !important;
      transition: all 0.3s !important;

      &.v-step__button-skip {
        background: $background-color !important;
        color: text-color-2 !important;

        &:active {
          opacity: 0.7 !important;
        }
      }

      &.v-step__button-previous {
        background: $background-color !important;
        color: text-color !important;

        &:active {
          opacity: 0.7 !important;
        }
      }

      &.v-step__button-next,
      &.v-step__button-stop {
        background: $primary-color !important;
        color: $white !important;

        &:active {
          opacity: 0.8 !important;
        }
      }
    }
  }

  .v-step__arrow {
    border-color: $white !important;

    &--dark {
      border-color: $white !important;
    }
  }
}
</style>
