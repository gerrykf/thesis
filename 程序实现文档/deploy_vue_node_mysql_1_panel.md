# Vue + Node.js + MySQL 完整生产部署指南（1Panel）

本文档整理了将本地开发完成的 Vue 前端（移动端 + 管理端）、Node.js 后端服务、MySQL 数据库完整部署到一条域名上的流程，使用 1Panel 管理生产环境，并包含 DevOps 账号创建及域名访问完整流程。

---

## 0. 创建 DevOps 账号

1. 访问 Azure DevOps 官网：[https://dev.azure.com/](https://dev.azure.com/)  
2. 点击 **Start free** 或 **Sign up** 进行注册
3. 填写邮箱、用户名等信息，完成账户验证
4. 登录后可以创建组织（Organization）和项目（Project）
5. 在组织下可以创建 Pipelines、Repos、Artifacts 等，方便项目 CI/CD 管理

> DevOps 账号用于管理代码仓库、构建流水线和自动部署。

---

## 1. 申请域名

- **国外注册商**：Namecheap、GoDaddy、Google Domains
- **国内注册商**：阿里云、腾讯云

### 步骤
1. 搜索并选择未注册的域名（如 `myproject.com`）
2. 完成购买
3. 获取域名 DNS 管理权限，用于解析域名到服务器 IP

---

## 2. 服务器准备

- 使用 1Panel 需要一台 VPS 或云服务器
- 推荐配置：
  - CPU：2 核以上
  - 内存：4GB 以上
  - 系统：Ubuntu 22.04 / 20.04 LTS

---

## 3. 1Panel 注册和部署

1. 注册 1Panel 账户：[https://1panel.io/](https://1panel.io/)
2. 部署 1Panel Agent 到服务器：

```bash
curl -fsSL https://get.1panel.io | bash
```

- 执行后绑定账户，1Panel 会检测服务器环境

---

## 4. 部署 Node.js 后端

1. 上传 Node.js 项目到服务器：

```bash
git clone <your-repo>
cd <your-backend-folder>
```

2. 安装依赖：

```bash
npm install  # 或 pnpm install
```

3. 使用 PM2 或 1Panel 管理服务：

```bash
pm2 start server.js --name my-backend
```

- 1Panel 控制台也可添加 Node.js 应用并管理进程

---

## 5. 部署 MySQL 数据库

1. 安装 MySQL（Ubuntu 例子）：

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

2. 创建数据库和用户：

```sql
CREATE DATABASE myproject_db;
CREATE USER 'myproject_user'@'localhost' IDENTIFIED BY 'StrongPassword!';
GRANT ALL PRIVILEGES ON myproject_db.* TO 'myproject_user'@'localhost';
FLUSH PRIVILEGES;
```

3. 导入表结构或数据：

```bash
mysql -u myproject_user -p myproject_db < schema.sql
```

- 1Panel 支持添加 MySQL 服务，控制台可管理数据库

---

## 6. 构建和部署 Vue 前端

1. 本地构建：

```bash
# 移动端
cd vue-mobile
pnpm install
pnpm run build

# 管理端
cd vue-admin
pnpm install
pnpm run build
```

2. 上传到服务器：

```bash
scp -r dist/* user@your-server:/var/www/myproject
```

3. 配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name myproject.com;

    root /var/www/myproject;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- 1Panel 可直接部署静态 Web App，无需手动 Nginx 配置

---

## 7. 配置 HTTPS

1. 使用 1Panel 自带 Let’s Encrypt 一键生成 SSL
2. 或手动使用 Certbot：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d myproject.com
```

- 自动配置 HTTPS 和续期

---

## 8. 配置域名 DNS

- 添加 A 记录指向服务器公网 IP：

```
主机记录: @
记录类型: A
记录值: <服务器公网 IP>
TTL: 600
```

- 等待解析生效（几分钟到 24 小时）
- 测试域名访问：

```
ping myproject.com
curl http://myproject.com
```

---

## 9. 访问验证

- 浏览器访问：

```
http://myproject.com       # 前端
https://myproject.com      # HTTPS 前端
http://myproject.com/api/  # Node.js 后端接口
```

- 在 1Panel 控制台查看：
  - Node.js 进程状态
  - MySQL 数据库状态
  - Web 服务状态

---

## ✅ 总结

完整链路：
1. 创建 DevOps 账号 → 管理仓库与 CI/CD
2. 申请域名 → 配置 DNS
3. 准备服务器 → Ubuntu
4. 安装 1Panel → 部署 Agent
5. 部署 MySQL → 导入数据库
6. 部署 Node.js → PM2 / 1Panel 管理
7. 构建并部署 Vue 前端 → Nginx / 1Panel Web App
8. 配置 HTTPS
9. 验证访问

> 使用 1Panel 可以可视化管理前端、后端、数据库以及 SSL，让整个部署流程更简单。

