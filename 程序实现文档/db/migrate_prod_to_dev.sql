-- =====================================================
-- 生产环境数据库迁移脚本
-- 目标：将生产环境数据库结构更新为与本地开发环境一致
-- 生成时间：2025-10-20
-- =====================================================

USE health_management;

-- =====================================================
-- 1. 修改 health_records 表
-- =====================================================
SELECT '=== 1. 修改 health_records 表 ===' as info;

-- 1.1 扩展 exercise_type 字段长度
SELECT '1.1 扩展 exercise_type 字段长度: varchar(50) -> varchar(200)' as info;
ALTER TABLE `health_records`
MODIFY COLUMN `exercise_type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '运动类型';

-- =====================================================
-- 2. 修改 online_users 表
-- =====================================================
SELECT '' as '---';
SELECT '=== 2. 修改 online_users 表 ===' as info;

-- 2.1 检查并添加 client_type 字段（如果不存在）
SELECT '2.1 添加 client_type 字段' as info;
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_schema = 'health_management'
      AND table_name = 'online_users'
      AND column_name = 'client_type'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `online_users` ADD COLUMN `client_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''h5'' COMMENT ''客户端类型: h5-前台, admin-后台'' AFTER `username`',
    'SELECT ''字段 client_type 已存在，跳过'' AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2.2 检查并添加 client_type 索引
SELECT '2.2 添加 client_type 索引' as info;
SET @idx_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = 'health_management'
      AND table_name = 'online_users'
      AND index_name = 'idx_client_type'
);

SET @sql = IF(@idx_exists = 0,
    'ALTER TABLE `online_users` ADD KEY `idx_client_type` (`client_type`)',
    'SELECT ''索引 idx_client_type 已存在，跳过'' AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 3. 修改 menus 表索引
-- =====================================================
SELECT '' as '---';
SELECT '=== 3. 添加 menus 表索引 ===' as info;

-- 3.1 添加 idx_parent_id 索引
SELECT '3.1 添加 idx_parent_id 索引' as info;
SET @idx_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = 'health_management'
      AND table_name = 'menus'
      AND index_name = 'idx_parent_id'
);

SET @sql = IF(@idx_exists = 0,
    'ALTER TABLE `menus` ADD KEY `idx_parent_id` (`parent_id`)',
    'SELECT ''索引 idx_parent_id 已存在，跳过'' AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3.2 添加 idx_menu_type 索引
SELECT '3.2 添加 idx_menu_type 索引' as info;
SET @idx_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = 'health_management'
      AND table_name = 'menus'
      AND index_name = 'idx_menu_type'
);

SET @sql = IF(@idx_exists = 0,
    'ALTER TABLE `menus` ADD KEY `idx_menu_type` (`menu_type`)',
    'SELECT ''索引 idx_menu_type 已存在，跳过'' AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3.3 添加 idx_rank 索引
SELECT '3.3 添加 idx_rank 索引' as info;
SET @idx_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = 'health_management'
      AND table_name = 'menus'
      AND index_name = 'idx_rank'
);

SET @sql = IF(@idx_exists = 0,
    'ALTER TABLE `menus` ADD KEY `idx_rank` (`rank`)',
    'SELECT ''索引 idx_rank 已存在，跳过'' AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 4. 修改 users 表
-- =====================================================
SELECT '' as '---';
SELECT '=== 4. 修改 users 表 ===' as info;

-- 4.1 修改 role_id 默认值
SELECT '4.1 修改 role_id 字段，添加默认值 1' as info;
ALTER TABLE `users`
MODIFY COLUMN `role_id` int DEFAULT '1' COMMENT '角色ID，默认为普通用户';

-- =====================================================
-- 5. 验证结果
-- =====================================================
SELECT '' as '---';
SELECT '=== 迁移完成，验证结果 ===' as info;

-- 5.1 验证 health_records 表
SELECT '' as '---';
SELECT '5.1 验证 health_records.exercise_type 字段' as info;
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = 'health_management'
  AND table_name = 'health_records'
  AND column_name = 'exercise_type';

-- 5.2 验证 online_users 表
SELECT '' as '---';
SELECT '5.2 验证 online_users.client_type 字段' as info;
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = 'health_management'
  AND table_name = 'online_users'
  AND column_name = 'client_type';

-- 5.3 验证 online_users 索引
SELECT '' as '---';
SELECT '5.3 验证 online_users 索引' as info;
SELECT
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE table_schema = 'health_management'
  AND table_name = 'online_users'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- 5.4 验证 menus 索引
SELECT '' as '---';
SELECT '5.4 验证 menus 表索引' as info;
SELECT
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE table_schema = 'health_management'
  AND table_name = 'menus'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- 5.5 验证 users 表
SELECT '' as '---';
SELECT '5.5 验证 users.role_id 字段' as info;
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = 'health_management'
  AND table_name = 'users'
  AND column_name = 'role_id';

SELECT '' as '---';
SELECT '=== ✅ 所有迁移步骤已完成 ===' as info;
