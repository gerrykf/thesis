-- ====================================================
-- 添加静态路由字段到 menus 表
-- 创建时间: 2025-10-18
-- 说明: 在 menus 表中添加 is_static 和 router_source 字段
--       用于区分静态路由和动态菜单
-- ====================================================

-- ====================================================
-- 1. 添加字段
-- ====================================================

-- 检查 is_static 字段是否存在
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'menus'
    AND COLUMN_NAME = 'is_static'
);

-- 如果 is_static 字段不存在，则添加
SET @sql = IF(@column_exists = 0,
  'ALTER TABLE menus ADD COLUMN is_static TINYINT DEFAULT 0 COMMENT ''是否为静态路由 0:动态菜单 1:静态路由'' AFTER status',
  'SELECT ''Column is_static already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查 router_source 字段是否存在
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'menus'
    AND COLUMN_NAME = 'router_source'
);

-- 如果 router_source 字段不存在，则添加
SET @sql = IF(@column_exists = 0,
  'ALTER TABLE menus ADD COLUMN router_source VARCHAR(20) DEFAULT ''database'' COMMENT ''路由来源 local:本地静态路由 database:数据库动态路由'' AFTER is_static',
  'SELECT ''Column router_source already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 2. 更新现有数据
-- ====================================================

-- 将所有现有的菜单标记为数据库来源的动态菜单
UPDATE menus
SET is_static = 0,
    router_source = 'database'
WHERE is_static IS NULL OR router_source IS NULL;

-- ====================================================
-- 3. 验证字段添加结果
-- ====================================================

SELECT '字段添加完成，当前 menus 表结构:' AS info;
DESCRIBE menus;

SELECT '当前菜单统计:' AS info;
SELECT
  CASE is_static
    WHEN 0 THEN '动态菜单'
    WHEN 1 THEN '静态路由'
    ELSE '未知'
  END AS menu_type,
  router_source,
  COUNT(*) as count
FROM menus
GROUP BY is_static, router_source;

-- ====================================================
-- 脚本执行完成
-- ====================================================
