# 数据库迁移脚本

## 文件说明

### 1. rbac_system.sql
完整的 RBAC 权限系统迁移脚本，包含：
- 创建角色、菜单、角色菜单关联表
- 初始化三种角色（普通用户、管理员、超级管理员）
- 初始化菜单权限数据
- 初始化角色权限关联
- 创建超级管理员账户

### 2. fix_users_table.sql ⚠️ **重要：先执行此脚本**
修复 users 表结构问题：
- 添加主键（如果缺失）
- 设置 id 字段为 AUTO_INCREMENT
- 扩展 role 字段长度（VARCHAR(10) → VARCHAR(50)）
- 添加 username 和 email 的唯一索引

### 3. insert_super_admin.sql
独立的超级管理员账户创建脚本，用于快速创建或重置超级管理员账户。

## 超级管理员账户信息

```
用户名: sadmin
密码:   sadmin666
角色:   超级管理员 (super_admin)
邮箱:   sadmin@system.local
权限:   拥有所有系统权限，包括角色管理
```

## 使用方法

### ⚠️ 重要：执行顺序

如果遇到 "Data truncated for column 'role'" 或 "No primary key found" 错误，请按以下顺序执行：

```bash
# 1. 先修复 users 表结构（必须先执行）
mysql -u root -p health_management < migrations/fix_users_table.sql

# 2. 再执行 RBAC 迁移或创建超级管理员
mysql -u root -p health_management < migrations/insert_super_admin.sql
```

### 方法一：执行完整迁移脚本（推荐首次使用）

```bash
# 步骤1: 修复 users 表结构
mysql -u root -p health_management < migrations/fix_users_table.sql

# 步骤2: 执行完整的 RBAC 系统迁移
mysql -u root -p health_management < migrations/rbac_system.sql
```

### 方法二：仅创建超级管理员账户

```bash
# 步骤1: 先修复表结构（如果还没执行过）
mysql -u root -p health_management < migrations/fix_users_table.sql

# 步骤2: 创建超级管理员账户
mysql -u root -p health_management < migrations/insert_super_admin.sql
```

### 方法三：在 MySQL 命令行中执行

```bash
# 登录 MySQL
mysql -u root -p

# 选择数据库
USE health_management;

# 执行脚本
SOURCE /path/to/migrations/insert_super_admin.sql;
```

### 方法四：直接执行 SQL 语句

```sql
-- 在 MySQL 命令行或客户端中直接执行
INSERT INTO users (username, email, password, role, role_id, created_at)
VALUES
  ('sadmin', 'sadmin@system.local', '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW', 'super_admin', 3, NOW())
ON DUPLICATE KEY UPDATE
  password = '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW',
  role = 'super_admin',
  role_id = 3,
  updated_at = NOW();
```

## 验证安装

执行脚本后，可以通过以下方式验证：

### 1. 查询超级管理员账户

```sql
SELECT id, username, email, role, role_id, created_at
FROM users
WHERE username = 'sadmin';
```

### 2. 查询角色权限

```sql
-- 查看超级管理员拥有的菜单权限
SELECT
  m.title AS menu_title,
  m.path AS menu_path,
  m.type AS menu_type,
  m.permission
FROM role_menus rm
JOIN menus m ON rm.menu_id = m.id
WHERE rm.role_id = 3
ORDER BY m.sort;
```

### 3. 登录系统测试

使用以下凭据登录系统：
- 用户名: `sadmin`
- 密码: `sadmin666`

登录成功后，应该能看到所有菜单，包括"角色管理"菜单。

## 重置密码

如果需要重置超级管理员密码，重新执行 `insert_super_admin.sql` 脚本即可。

## 安全建议

⚠️ **重要提示**：
1. 首次登录后，请立即修改超级管理员密码
2. 生产环境中建议使用更复杂的密码
3. 定期更换管理员密码
4. 限制超级管理员账户的使用范围
5. 不要在公开渠道泄露管理员凭据

## 权限说明

### 角色权限对比

| 功能模块 | 普通用户 | 管理员 | 超级管理员 |
|---------|---------|--------|-----------|
| 首页-用户欢迎页 | ✅ | ❌ | ❌ |
| 首页-管理员仪表盘 | ❌ | ✅ | ✅ |
| 健康管理-我的记录 | ✅ | ✅ | ✅ |
| 健康管理-所有记录 | ❌ | ✅ | ✅ |
| 食物管理-查看 | ✅ | ✅ | ✅ |
| 食物管理-增删改 | ❌ | ✅ | ✅ |
| 饮食计划 | ✅ | ✅ | ✅ |
| 用户管理-用户列表 | ❌ | ✅ | ✅ |
| 用户管理-角色管理 | ❌ | ❌ | ✅ |

## 故障排查

### ⚠️ 错误：Data truncated for column 'role' at row 1

**原因**：`users` 表的 `role` 字段长度不足（通常是 VARCHAR(10)），无法容纳 'super_admin'（12个字符）

**解决方法**：
```bash
# 执行修复脚本
mysql -u root -p health_management < migrations/fix_users_table.sql
```

或手动执行：
```sql
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'user' COMMENT '用户角色';
```

### ⚠️ 错误：No primary key found for users

**原因**：`users` 表缺少主键定义

**解决方法**：
```bash
# 执行修复脚本
mysql -u root -p health_management < migrations/fix_users_table.sql
```

或手动执行：
```sql
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users MODIFY COLUMN id INT AUTO_INCREMENT;
```

### 错误：Duplicate entry 'sadmin'

这表示 `sadmin` 用户已存在，脚本会自动更新密码和角色信息，这是正常行为。

### 错误：Unknown column 'role_id'

请先执行完整的 `rbac_system.sql` 迁移脚本，该脚本会添加 `role_id` 字段。

### 错误：Cannot add foreign key constraint

请确保：
1. 先执行 `fix_users_table.sql` 修复表结构
2. `roles` 表已创建且包含 id=3 的记录
3. 执行顺序：fix_users_table.sql → rbac_system.sql → insert_super_admin.sql

## 更多信息

如有问题，请参考：
- RBAC 系统设计文档
- API 接口文档
- 系统架构文档
