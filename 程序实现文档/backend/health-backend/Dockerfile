# -------- 构建阶段 --------
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml* tsconfig.json ./

# 安装全部依赖（包括 devDependencies，用于构建）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY src ./src

# 构建 TypeScript 项目
RUN pnpm run build

# -------- 生产阶段 --------
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm 和 pm2
RUN npm install -g pnpm pm2

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制构建好的 JS 文件
COPY --from=builder /app/dist ./dist

# 对外暴露端口（与 Node.js app.listen 一致）
EXPOSE 3000

# 启动命令
CMD ["pm2-runtime", "dist/app.js"]
