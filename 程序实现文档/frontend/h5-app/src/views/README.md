# Views 目录结构说明

## 目录结构

每个模块采用独立文件夹管理，包含组件文件和工具函数集合：

```
views/
├── home/                    # 首页模块
│   ├── index.vue           # 页面组件
│   └── utils/              # 工具函数文件夹
│       ├── types.ts        # 类型定义
│       ├── enums.ts        # 枚举定义
│       ├── options.ts      # 配置选项
│       ├── hooks.ts        # 自定义Hooks
│       └── index.ts        # 工具函数入口
│
├── health/                  # 健康打卡模块
│   ├── index.vue
│   └── utils/
│       ├── types.ts
│       ├── enums.ts
│       ├── options.ts
│       ├── hooks.ts
│       └── index.ts
│
├── diet/                    # 饮食记录模块
│   ├── index.vue
│   └── utils/
│       ├── types.ts
│       ├── enums.ts
│       ├── options.ts
│       ├── hooks.ts
│       └── index.ts
│
├── history/                 # 历史记录模块
│   ├── index.vue
│   └── utils/
│       ├── types.ts
│       └── index.ts
│
└── profile/                 # 个人中心模块
    ├── index.vue
    └── utils/
        ├── types.ts
        └── index.ts
```

## 工具文件说明

### 1. types.ts - 类型定义
定义模块相关的 TypeScript 类型和接口。

**示例**：
```typescript
// home/utils/types.ts
export interface HealthData {
  weight: number
  exercise: number
  sleep: number
  calories: number
}
```

### 2. enums.ts - 枚举定义
定义模块相关的枚举类型。

**示例**：
```typescript
// health/utils/enums.ts
export enum BMILevel {
  UNDERWEIGHT = 'underweight',
  NORMAL = 'normal',
  OVERWEIGHT = 'overweight',
  OBESE = 'obese'
}
```

### 3. options.ts - 配置选项
定义模块的配置项、常量、静态数据等。

**示例**：
```typescript
// diet/utils/options.ts
export const mealConfig = {
  breakfast: {
    name: '早餐',
    icon: '🌅',
    recommendedRatio: 0.3
  }
}
```

### 4. hooks.ts - 自定义Hooks
定义模块的可复用逻辑 Hooks。

**示例**：
```typescript
// home/utils/hooks.ts
export function useDateInfo() {
  const currentDate = computed(() => formatChineseDate())
  const weekday = computed(() => getWeekday())

  return {
    currentDate,
    weekday
  }
}
```

### 5. index.ts - 统一导出
作为工具函数的入口文件，统一导出所有工具函数、类型、枚举等。

**示例**：
```typescript
// home/utils/index.ts
export * from './types'
export * from './enums'
export * from './options'
export * from './hooks'

export function formatChineseDate(date: Date): string {
  // ...
}
```

## 使用方式

### 在组件中导入

```vue
<script setup lang="ts">
// 导入工具函数和类型
import {
  formatChineseDate,
  getWeekday,
  calculateHealthScore,
  type HealthData
} from './utils'

// 或者导入Hooks
import { useDateInfo, useHealthData } from './utils/hooks'

// 使用
const { currentDate, weekday } = useDateInfo()
</script>
```

### 跨模块引用

```vue
<script setup lang="ts">
// 从其他模块导入
import { type Food } from '@/views/diet/utils/types'
import { calculateBMI } from '@/views/health/utils'
</script>
```

## 命名规范

### 文件命名
- 组件文件：`index.vue`
- 类型文件：`types.ts`
- 枚举文件：`enums.ts`
- 配置文件：`options.ts`
- Hooks文件：`hooks.ts`
- 入口文件：`index.ts`

### 函数命名
- 普通函数：小驼峰命名 `formatDate`, `calculateScore`
- Hooks：`use` 前缀 + 大驼峰 `useHealthData`, `useDateInfo`
- 验证函数：`validate` 前缀 `validateWeight`, `validateEmail`
- 获取函数：`get` 前缀 `getGreeting`, `getBMIComment`

### 类型命名
- 接口：大驼峰命名 `HealthData`, `UserInfo`
- 枚举：大驼峰命名 `BMILevel`, `MealType`
- 类型别名：大驼峰命名 `RecordType`

## 最佳实践

### 1. 模块独立性
- 每个模块的工具函数应该独立，避免过度依赖其他模块
- 共用的工具函数应放在 `src/utils` 全局工具目录

### 2. 类型安全
- 充分利用 TypeScript，为所有函数添加类型注解
- 导出的类型应在 `types.ts` 中统一定义

### 3. 代码复用
- 相同逻辑抽取为 Hooks
- 静态数据抽取为配置项
- 通用函数抽取到 `index.ts`

### 4. 文件组织
```typescript
// ✅ 推荐：按功能分类
utils/
  ├── types.ts      # 所有类型
  ├── enums.ts      # 所有枚举
  ├── options.ts    # 所有配置
  ├── hooks.ts      # 所有Hooks
  └── index.ts      # 工具函数

// ❌ 避免：功能分散
utils/
  ├── dateUtils.ts
  ├── validationUtils.ts
  ├── formatUtils.ts
  └── ...
```

## 模块间通信

### 通过 Pinia Store
```typescript
// 推荐：使用 Pinia 进行模块间数据共享
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
```

### 通过 Props/Emit
```vue
<!-- 父子组件通信 -->
<ChildComponent :data="healthData" @update="handleUpdate" />
```

### 通过路由传参
```typescript
// 路由跳转传参
router.push({
  name: 'Health',
  query: { date: '2024-01-15' }
})
```

## 注意事项

1. **避免循环依赖**：模块间引用要注意避免循环依赖
2. **保持简洁**：utils 应该只包含纯函数和简单的 Hooks
3. **适度抽象**：不要过度抽象，保持代码可读性
4. **及时清理**：删除不再使用的工具函数和类型定义
