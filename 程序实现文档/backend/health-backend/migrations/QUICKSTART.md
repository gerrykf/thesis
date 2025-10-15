# 快速开始指南 - 超级管理员创建

## 🚀 最快方式（推荐）

遇到 "Data truncated" 或 "No primary key" 错误？按以下步骤操作：

### 步骤 1: 修复 users 表

```bash
mysql -u root -p health_management < migrations/fix_users_table.sql
```

### 步骤 2: 创建超级管理员

```bash
mysql -u root -p health_management < migrations/insert_super_admin.sql
```

## 🎯 登录信息

```
用户名: sadmin
密码:   sadmin666
```

## 📝 一键执行（可选）

如果想自动执行所有步骤：

```bash
bash migrations/setup_all.sh
```

## ❌ 常见错误及解决

### 错误 1: Data truncated for column 'role'
→ 执行 `fix_users_table.sql` 修复表结构

### 错误 2: No primary key found
→ 执行 `fix_users_table.sql` 添加主键

### 错误 3: Duplicate entry 'sadmin'
→ 这是正常的，脚本会更新密码

## ✅ 验证安装

```sql
SELECT * FROM users WHERE username = 'sadmin';
```

应该看到 role 字段为 `super_admin`，role_id 为 `3`。

---

详细文档请参考 [README.md](./README.md)
