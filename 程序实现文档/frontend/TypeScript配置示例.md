# TypeScript项目配置示例

## 📁 前台项目配置 (Vant + TypeScript)

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import autoprefixer from 'autoprefixer'
import postcssPxToRem from 'postcss-pxtorem'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPxToRem({
          rootValue: 16,
          propList: ['*'],
          selectorBlackList: ['.van-'],
          exclude: /node_modules/i,
          minPixelValue: 2,
          mediaQuery: false,
          replace: true,
        })
      ]
    }
  },
})
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### package.json
```json
{
  "name": "frontend-mobile",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.5.0",
    "pinia": "^2.2.0",
    "axios": "^1.7.0",
    "vant": "^4.9.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.0",
    "@vue/tsconfig": "^0.5.0",
    "@vant/auto-import-resolver": "^1.2.0",
    "typescript": "~5.5.0",
    "unplugin-vue-components": "^0.27.0",
    "vite": "^5.4.0",
    "vue-tsc": "^2.1.0"
  }
}
```

## 📁 后台项目配置 (Element Plus + TypeScript)

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        // 后台管理不需要rem转换，保持px
      ]
    }
  },
})
```

### package.json
```json
{
  "name": "frontend-admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.5.0",
    "pinia": "^2.2.0",
    "axios": "^1.7.0",
    "element-plus": "^2.8.0",
    "@element-plus/icons-vue": "^2.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.0",
    "@vue/tsconfig": "^0.5.0",
    "@element-plus/auto-import-resolver": "^0.2.0",
    "typescript": "~5.5.0",
    "unplugin-vue-components": "^0.27.0",
    "vite": "^5.4.0",
    "vue-tsc": "^2.1.0"
  }
}
```

## 📁 后端项目配置 (Node.js + TypeScript)

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "健康管理系统后端API",
  "main": "dist/app.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/app.js",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.19.0",
    "mysql2": "^3.11.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.0",
    "cors": "^2.8.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/express": "^4.17.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/cors": "^2.8.0",
    "typescript": "^5.5.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.1.0"
  }
}
```

### nodemon.json
```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/app.ts"
}
```

## 📝 类型定义示例

### src/types/api.ts
```typescript
// 通用API响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户相关类型
export interface User {
  id: number
  username: string
  nickname: string
  phone?: string
  gender?: 'male' | 'female'
  birthDate?: string
  height?: number
  targetWeight?: number
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// 健康记录类型
export interface HealthRecord {
  id: number
  userId: number
  recordDate: string
  weight?: number
  exerciseDuration?: number
  sleepHours?: number
  notes?: string
  createdAt: string
}

export interface CreateHealthRecordRequest {
  recordDate: string
  weight?: number
  exerciseDuration?: number
  sleepHours?: number
  notes?: string
}

// 食物和饮食记录类型
export interface Food {
  id: number
  name: string
  category: string
  caloriesPer100g: number
  proteinPer100g: number
  fatPer100g: number
  carbsPer100g: number
  isActive: boolean
  createdAt: string
}

export interface DietRecord {
  id: number
  userId: number
  foodId: number
  recordDate: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  quantity: number
  calories: number
  createdAt: string
  food?: Food
}

export interface CreateDietRecordRequest {
  foodId: number
  recordDate: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  quantity: number
}
```

### src/types/store.ts
```typescript
// Pinia Store 状态类型
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface HealthState {
  records: HealthRecord[]
  currentRecord: HealthRecord | null
  loading: boolean
}

export interface DietState {
  records: DietRecord[]
  foods: Food[]
  dailySummary: {
    totalCalories: number
    totalProtein: number
    totalFat: number
    totalCarbs: number
  }
  loading: boolean
}
```

这个配置为您的项目提供了完整的TypeScript支持，包括类型检查、自动补全和更好的开发体验。