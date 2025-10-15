-- ====================================================
-- 修复 users 表结构
-- ====================================================
-- 创建时间: 2025-10-15
-- 说明: 该脚本用于修复 users 表的结构问题
-- 问题:
--   1. role 字段长度不足，导致 'super_admin' 被截断
--   2. 缺少主键
-- ====================================================

USE health_management;

-- ====================================================
-- 1. 检查并添加主键（如果不存在）
-- ====================================================
SET @pk_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND CONSTRAINT_NAME = 'PRIMARY'
);

-- 如果主键不存在，添加主键
SET @sql = IF(@pk_exists = 0,
  'ALTER TABLE users ADD PRIMARY KEY (id)',
  'SELECT "Primary key already exists on users table" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 2. 修改 id 字段为 AUTO_INCREMENT（如果还不是）
-- ====================================================
SET @auto_inc_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'id'
    AND EXTRA LIKE '%auto_increment%'
);

SET @sql = IF(@auto_inc_exists = 0,
  'ALTER TABLE users MODIFY COLUMN id INT AUTO_INCREMENT',
  'SELECT "id column is already AUTO_INCREMENT" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 3. 扩展 role 字段长度
-- ====================================================
-- 将 role 字段从 VARCHAR(10) 扩展到 VARCHAR(50)
-- 这样可以容纳更长的角色名称，如 'super_admin'
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'user' COMMENT '用户角色';

-- ====================================================
-- 4. 确保 username 字段有唯一索引
-- ====================================================
SET @unique_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'username'
    AND NON_UNIQUE = 0
);

SET @sql = IF(@unique_exists = 0,
  'ALTER TABLE users ADD UNIQUE KEY username (username)',
  'SELECT "Unique index on username already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 5. 确保 email 字段有唯一索引
-- ====================================================
SET @email_unique_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'email'
    AND NON_UNIQUE = 0
);

SET @sql = IF(@email_unique_exists = 0,
  'ALTER TABLE users ADD UNIQUE KEY email (email)',
  'SELECT "Unique index on email already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 6. 显示修复后的表结构
-- ====================================================
SELECT '✅ users 表结构修复完成！' AS message;

-- 显示表结构
DESCRIBE users;

-- 显示索引信息
SHOW INDEX FROM users;

-- ====================================================
-- 7. 验证数据
-- ====================================================
SELECT '当前用户数据:' AS info;
SELECT id, username, email, role, role_id, created_at
FROM users
LIMIT 10;
