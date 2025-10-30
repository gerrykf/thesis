# Nginx 生产环境配置 - 头像上传支持

## 问题描述

生产环境下头像上传失败，返回 `400 Bad Request`，错误信息：`"请上传头像文件"`

## 原因分析

1. **Nginx 文件大小限制**：默认 `client_max_body_size` 为 1MB
2. **反向代理配置缺失**：需要正确配置 proxy 头信息
3. **超时设置**：文件上传可能需要更长的超时时间

## Nginx 配置

### 完整配置示例

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name healthmanage.xin;

    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # 文件上传大小限制（调整为 10MB）
    client_max_body_size 10M;

    # 请求体缓冲大小
    client_body_buffer_size 128k;

    # 超时设置
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

    # 前端静态文件
    location / {
        root /var/www/h5-app/dist;
        try_files $uri $uri/ /index.html;

        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 7d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;

        # 重要：保留原始请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 文件上传必需配置
        proxy_set_header Connection "";
        proxy_http_version 1.1;

        # 禁用请求体缓冲（大文件上传）
        proxy_request_buffering off;

        # 超时时间
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    # 上传文件静态资源服务
    location /uploads/ {
        alias /opt/1panel/www/sites/healthbackend/index/server_upload/uploads/;

        # 访问控制
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, OPTIONS';

        # 缓存策略
        expires 30d;
        add_header Cache-Control "public, immutable";

        # 安全设置
        autoindex off;
    }

    # 日志
    access_log /var/log/nginx/healthmanage.access.log;
    error_log /var/log/nginx/healthmanage.error.log;
}
```

### 关键配置说明

#### 1. **文件大小限制**
```nginx
client_max_body_size 10M;
```
- 设置为 10MB（后端限制是 5MB）
- 必须大于等于后端的文件大小限制
- 如果文件超过此限制，Nginx 会返回 413 错误

#### 2. **禁用请求体缓冲**
```nginx
proxy_request_buffering off;
```
- 大文件上传时避免缓冲到磁盘
- 减少内存使用
- 提高上传速度

#### 3. **超时设置**
```nginx
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
```
- 设置为 10 分钟（600 秒）
- 防止大文件上传超时

#### 4. **保留原始请求头**
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```
- 保证后端能获取真实客户端信息
- 支持 JWT 认证

## 后端环境变量配置

### `.env` 文件

```bash
# 生产环境
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=health_management

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 文件上传配置（重要！）
UPLOAD_PATH=/var/www/health-backend/uploads
MAX_FILE_SIZE=5242880

# CORS 配置
CORS_ORIGIN=https://healthmanage.xin
```

### 上传路径配置

```bash
# 创建上传目录
sudo mkdir -p /var/www/health-backend/uploads/avatars

# 设置权限（重要！）
sudo chown -R www-data:www-data /var/www/health-backend/uploads
sudo chmod -R 755 /var/www/health-backend/uploads
```

## 部署步骤

### 1. 更新代码

```bash
cd /var/www/health-backend
git pull origin main

# 安装依赖
pnpm install

# 构建
pnpm run build
```

### 2. 配置环境变量

```bash
# 编辑 .env 文件
vim .env

# 添加 UPLOAD_PATH
UPLOAD_PATH=/var/www/health-backend/uploads
```

### 3. 测试 Nginx 配置

```bash
# 测试配置文件语法
sudo nginx -t

# 重新加载 Nginx
sudo nginx -s reload
# 或
sudo systemctl reload nginx
```

### 4. 重启后端服务

```bash
# 使用 PM2
pm2 restart health-backend
pm2 logs health-backend --lines 50

# 或使用 systemd
sudo systemctl restart health-backend
sudo journalctl -u health-backend -f
```

## 测试上传功能

### 1. 使用 curl 测试

```bash
# 获取 JWT Token（先登录）
TOKEN="your_jwt_token_here"

# 上传头像
curl -X POST https://healthmanage.xin/api/auth/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test.jpg" \
  -v
```

### 2. 检查日志

```bash
# Nginx 日志
sudo tail -f /var/log/nginx/healthmanage.error.log

# 后端日志
pm2 logs health-backend --lines 100

# 或
sudo journalctl -u health-backend -f
```

### 3. 预期输出

**成功响应：**
```json
{
  "success": true,
  "message": "头像上传成功",
  "data": {
    "avatarUrl": "/uploads/avatars/1_1234567890.jpg"
  }
}
```

**失败响应（修复前）：**
```json
{
  "success": false,
  "message": "请上传头像文件"
}
```

## 常见问题排查

### 问题 1: 413 Request Entity Too Large

**原因**：Nginx 文件大小限制
**解决**：增加 `client_max_body_size`

```nginx
client_max_body_size 10M;
```

### 问题 2: 504 Gateway Timeout

**原因**：上传超时
**解决**：增加超时时间

```nginx
proxy_read_timeout 600s;
```

### 问题 3: 403 Forbidden (访问上传的文件)

**原因**：文件权限问题
**解决**：

```bash
sudo chown -R www-data:www-data /var/www/health-backend/uploads
sudo chmod -R 755 /var/www/health-backend/uploads
```

### 问题 4: 上传目录不存在

**原因**：`UPLOAD_PATH` 环境变量未配置或目录不存在
**解决**：

```bash
# 创建目录
sudo mkdir -p /var/www/health-backend/uploads/avatars

# 设置权限
sudo chown -R www-data:www-data /var/www/health-backend/uploads
```

### 问题 5: 前端调用参数错误

**原因**：前端 API 调用参数顺序错误
**解决**：修改前端调用

```typescript
// ❌ 错误
const res = await postAuthAvatar(fileItem.file);

// ✅ 正确
const res = await postAuthAvatar({}, fileItem.file);
```

## 安全建议

### 1. 文件类型验证

后端已配置只允许图片格式：
- image/jpeg
- image/jpg
- image/png
- image/gif
- image/webp

### 2. 文件大小限制

- 前端：Vant Uploader 可配置 `max-size`
- 后端：5MB 限制（multer）
- Nginx：10MB 限制（留有余量）

### 3. 防止目录遍历

```nginx
location /uploads/ {
    autoindex off;  # 禁止目录列表
}
```

### 4. 定期清理

```bash
# 设置定时任务清理旧头像
# crontab -e
0 2 * * * find /var/www/health-backend/uploads/avatars -mtime +90 -delete
```

## 监控和日志

### 1. Nginx 日志格式

```nginx
log_format upload '$remote_addr - $remote_user [$time_local] '
                  '"$request" $status $body_bytes_sent '
                  '"$http_referer" "$http_user_agent" '
                  'upload_size:$content_length';

access_log /var/log/nginx/healthmanage.access.log upload;
```

### 2. 后端日志增强

已在控制器中添加详细日志：
- 请求信息（userId、Content-Type）
- 文件信息（文件名、大小、MIME类型）
- 错误详情（无文件时的调试信息）

### 3. PM2 监控

```bash
# 实时查看日志
pm2 logs health-backend --lines 100

# 监控面板
pm2 monit

# 查看详细信息
pm2 show health-backend
```

## 性能优化

### 1. 启用 HTTP/2

```nginx
listen 443 ssl http2;
```

### 2. 启用 gzip 压缩

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. 静态资源缓存

```nginx
location ~* \.(jpg|jpeg|png|gif)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 总结

修复上传问题的关键步骤：
1. ✅ **修复前端 API 调用参数顺序**（最重要）
2. ✅ 配置 Nginx `client_max_body_size`
3. ✅ 设置正确的上传目录权限
4. ✅ 配置 `UPLOAD_PATH` 环境变量
5. ✅ 添加详细的调试日志

按照以上步骤操作后，上传功能应该可以正常工作。如果仍有问题，查看 Nginx 和后端日志进行进一步排查。
