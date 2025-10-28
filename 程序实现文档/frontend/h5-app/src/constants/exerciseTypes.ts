// 运动类型统一数据
export interface ExerciseType {
  value: string; // 中文值，用于提交到后端
  labelKey: string; // i18n键
  descKey: string; // 描述i18n键（轮盘用）
  icon: string; // emoji图标（轮盘用）
  color: string; // 颜色
}

// 所有运动类型数据
export const EXERCISE_TYPES: ExerciseType[] = [
  {
    value: "跑步",
    labelKey: "pao-bu",
    descKey: "pao-bu-desc",
    icon: "🏃‍♂️",
    color: "primary",
  },
  {
    value: "游泳",
    labelKey: "you-yong",
    descKey: "you-yong-desc",
    icon: "🏊‍♂️",
    color: "success",
  },
  {
    value: "瑜伽",
    labelKey: "yu-jia",
    descKey: "yu-jia-desc",
    icon: "🧘‍♀️",
    color: "warning",
  },
  {
    value: "骑行",
    labelKey: "qi-che",
    descKey: "qi-che-desc",
    icon: "🚴‍♂️",
    color: "danger",
  },
  {
    value: "健身",
    labelKey: "li-liang-xun-lian",
    descKey: "li-liang-xun-lian-desc",
    icon: "🏋️",
    color: "primary",
  },
  {
    value: "篮球",
    labelKey: "qiu-lei-yun-dong",
    descKey: "qiu-lei-yun-dong-desc",
    icon: "🤾",
    color: "success",
  },
  {
    value: "足球",
    labelKey: "zu-qiu",
    descKey: "zu-qiu-desc",
    icon: "⚽",
    color: "warning",
  },
  {
    value: "羽毛球",
    labelKey: "yu-mao-qiu",
    descKey: "yu-mao-qiu-desc",
    icon: "🏸",
    color: "danger",
  },
  {
    value: "乒乓球",
    labelKey: "ping-pang-qiu",
    descKey: "ping-pang-qiu-desc",
    icon: "🏓",
    color: "primary",
  },
  {
    value: "登山",
    labelKey: "deng-shan",
    descKey: "deng-shan-desc",
    icon: "🏞️",
    color: "success",
  },
  {
    value: "跳绳",
    labelKey: "tiao-sheng",
    descKey: "tiao-sheng-desc",
    icon: "🧵",
    color: "warning",
  },
];

// 从所有运动类型中随机选择指定数量
export function getRandomExerciseTypes(count: number): ExerciseType[] {
  const shuffled = [...EXERCISE_TYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// localStorage键
export const LOTTERY_RESULT_KEY = "exercise_lottery_result";

// 保存抽奖结果到localStorage
export function saveLotteryResult(exercise: ExerciseType): void {
  try {
    localStorage.setItem(LOTTERY_RESULT_KEY, JSON.stringify(exercise));
  } catch (error) {
    console.error("保存抽奖结果失败:", error);
  }
}

// 从localStorage读取抽奖结果
export function getLotteryResult(): ExerciseType | null {
  try {
    const result = localStorage.getItem(LOTTERY_RESULT_KEY);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error("读取抽奖结果失败:", error);
    return null;
  }
}

// 清除抽奖结果
export function clearLotteryResult(): void {
  try {
    localStorage.removeItem(LOTTERY_RESULT_KEY);
  } catch (error) {
    console.error("清除抽奖结果失败:", error);
  }
}
