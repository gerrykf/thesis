# 数据库脚本使用指南

## 快速开始

### 方式一：完整初始化（推荐）

一次性创建数据库、表结构和测试数据：

```bash
# 1. 初始化数据库和表结构
mysql -u root -p < setup_database.sql

# 2. 插入测试数据
mysql -u root -p < test_data.sql
```

### 方式二：分步执行

如果需要更细粒度的控制：

```bash
# 1. 只创建数据库和表结构
mysql -u root -p < init_database.sql

# 2. (可选) 插入测试数据
mysql -u root -p < test_data.sql
```

### 方式三：迁移现有数据库

如果数据库已存在，只需要更新表结构：

```bash
# 移除 health_records 表中的废弃字段
mysql -u root -p < migrations/002_remove_unused_health_fields.sql
```

## 脚本说明

### 核心脚本

| 文件 | 说明 | 用途 |
|------|------|------|
| `setup_database.sql` | **完整初始化脚本** | 创建数据库+所有表结构+管理员账号 |
| `init_database.sql` | 数据库初始化脚本 | 只创建数据库和表结构 |
| `test_data.sql` | 测试数据脚本 | 插入10条测试数据到每张表 |

### 迁移脚本

| 文件 | 说明 | 执行时机 |
|------|------|----------|
| `migrations/001_add_user_goals.sql` | 添加用户目标表 | 已包含在 init_database.sql 中 |
| `migrations/002_remove_unused_health_fields.sql` | 移除废弃的健康记录字段 | 用于更新现有数据库 |

### 文档

| 文件 | 说明 |
|------|------|
| `数据库设计文档.md` | 完整的数据库设计说明 |
| `README.md` | 本文档 |

## 数据库信息

### 基本信息

- **数据库名**: `health_management`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`

### 默认管理员账号

执行 `setup_database.sql` 后会自动创建管理员账号：

- **用户名**: `admin`
- **密码**: `admin123456`
- **角色**: `admin`

### 测试用户账号

执行 `test_data.sql` 后会创建10个测试用户：

| 用户名 | 密码 | 昵称 | 角色 |
|--------|------|------|------|
| zhang_wei | 123456 | 张伟 | user |
| li_na | 123456 | 李娜 | user |
| wang_fang | 123456 | 王芳 | user |
| liu_qiang | 123456 | 刘强 | user |
| chen_jing | 123456 | 陈静 | user |
| zhao_ming | 123456 | 赵明 | user |
| sun_li | 123456 | 孙丽 | user |
| zhou_lei | 123456 | 周磊 | user |
| wu_xia | 123456 | 吴霞 | user |
| zheng_hao | 123456 | 郑浩 | user |

## 数据库表结构

### 核心表

1. **users** - 用户表
   - 存储用户基本信息、登录凭证、个人资料

2. **health_records** - 健康记录表
   - 每日健康数据：体重、运动、睡眠、心情
   - 每个用户每天只能有一条记录

3. **foods** - 食物表
   - 食物营养成分数据库
   - 支持全文搜索

4. **food_categories** - 食物分类表
   - 二级分类结构
   - 预置10个一级分类

5. **diet_records** - 饮食记录表
   - 记录每餐食物摄入
   - 自动计算营养成分

6. **user_goals** - 用户目标表
   - 支持体重、运动、卡路里、自定义目标
   - 状态跟踪：进行中、已完成、已暂停、已取消

7. **system_logs** - 系统日志表
   - 记录用户操作和系统事件

## health_records 表字段说明

当前版本只包含实际使用的字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 记录ID（主键） |
| user_id | INT | 用户ID（外键） |
| record_date | DATE | 记录日期 |
| weight | DECIMAL(5,2) | 体重(kg) |
| exercise_duration | INT | 运动时长(分钟) |
| exercise_type | VARCHAR(50) | 运动类型 |
| sleep_hours | DECIMAL(4,2) | 睡眠时长(小时) |
| sleep_quality | ENUM | 睡眠质量(excellent/good/fair/poor) |
| mood | ENUM | 心情状态(excellent/good/fair/poor) |
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**已移除的字段**（2025-10-05）：
- `exercise_calories` - 运动消耗热量
- `blood_pressure_systolic` - 收缩压
- `blood_pressure_diastolic` - 舒张压
- `heart_rate` - 心率
- `body_temperature` - 体温

这些字段已从表结构中移除，因为后端API不使用它们。

## 注意事项

### 重要提示

⚠️ **数据安全**
- `setup_database.sql` 中的 `DROP DATABASE` 语句默认已注释
- 如需重建数据库，请先备份现有数据
- 生产环境请谨慎使用测试数据脚本

⚠️ **密码安全**
- 测试账号密码都是 `123456`（bcrypt加密）
- 生产环境请立即修改默认密码
- 管理员密码必须使用强密码

### 数据验证

执行测试数据脚本后，会自动显示各表的数据条数：

```sql
SELECT '用户表' as 表名, COUNT(*) as 数据条数 FROM users
-- ... 其他表的统计
```

预期结果：
- 用户表：11条（1个管理员 + 10个测试用户）
- 食物分类表：20条（10个一级 + 10个二级）
- 食物表：10条
- 健康记录表：10条
- 饮食记录表：10条
- 用户目标表：10条
- 系统日志表：10条

## 常见问题

### Q: 如何清空测试数据但保留表结构？

```sql
USE health_management;

-- 按照外键依赖顺序删除
TRUNCATE TABLE system_logs;
TRUNCATE TABLE user_goals;
TRUNCATE TABLE diet_records;
TRUNCATE TABLE health_records;
TRUNCATE TABLE foods;
DELETE FROM food_categories WHERE parent_id IS NOT NULL;
DELETE FROM food_categories WHERE parent_id IS NULL;
DELETE FROM users WHERE username != 'admin';
```

### Q: 如何重置管理员密码？

```sql
USE health_management;

-- 重置为 admin123456
UPDATE users
SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ln8xqjEJ8KjDAKRBK'
WHERE username = 'admin';
```

### Q: 如何备份数据库？

```bash
# 备份完整数据库
mysqldump -u root -p health_management > backup_$(date +%Y%m%d).sql

# 只备份结构
mysqldump -u root -p --no-data health_management > structure.sql

# 只备份数据
mysqldump -u root -p --no-create-info health_management > data.sql
```

### Q: 如何恢复数据库？

```bash
mysql -u root -p health_management < backup_20250105.sql
```

## 版本历史

### v1.1 (2025-10-05)
- 移除 health_records 表中5个未使用字段
- 创建迁移脚本 002_remove_unused_health_fields.sql
- 更新测试数据脚本
- 新增 setup_database.sql 一键初始化脚本

### v1.0 (2025-10-04)
- 初始版本
- 创建7张核心数据表
- 添加测试数据脚本
