-- 菜单管理表完整字段迁移脚本（修复版）
-- 处理外键约束问题
-- 参考 vue-pure-admin 实现

-- 1. 禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 2. 备份当前表
DROP TABLE IF EXISTS menus_backup;
CREATE TABLE menus_backup AS SELECT * FROM menus;

-- 3. 备份role_menus表（如果存在，之前版本已删除）
-- 如果role_menus_backup已存在说明已有备份，否则创建空表
CREATE TABLE IF NOT EXISTS role_menus_backup (
  role_id INT,
  menu_id INT
);

-- 4. 删除role_menus表（有外键约束）
-- 表可能已被删除，使用IF EXISTS避免错误
DROP TABLE IF EXISTS role_menus;

-- 5. 删除旧菜单表
DROP TABLE IF EXISTS menus;

-- 6. 创建新菜单表（包含所有25个字段）
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` int DEFAULT 0 COMMENT '父菜单ID',
  `menu_type` tinyint DEFAULT 0 COMMENT '菜单类型 0:菜单 1:iframe 2:外链 3:按钮',
  `title` varchar(100) NOT NULL COMMENT '菜单名称',
  `name` varchar(100) DEFAULT NULL COMMENT '路由名称',
  `path` varchar(200) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `rank` int DEFAULT 99 COMMENT '菜单排序',
  `redirect` varchar(200) DEFAULT NULL COMMENT '路由重定向',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
  `extra_icon` varchar(100) DEFAULT NULL COMMENT '右侧图标',
  `enter_transition` varchar(100) DEFAULT NULL COMMENT '进场动画',
  `leave_transition` varchar(100) DEFAULT NULL COMMENT '离场动画',
  `active_path` varchar(200) DEFAULT NULL COMMENT '菜单激活路径',
  `auths` varchar(200) DEFAULT NULL COMMENT '权限标识',
  `frame_src` varchar(500) DEFAULT NULL COMMENT 'iframe链接地址',
  `frame_loading` tinyint DEFAULT 1 COMMENT '加载动画 0:关闭 1:开启',
  `keep_alive` tinyint DEFAULT 0 COMMENT '缓存页面 0:关闭 1:开启',
  `hidden_tag` tinyint DEFAULT 0 COMMENT '隐藏标签 0:不隐藏 1:隐藏',
  `fixed_tag` tinyint DEFAULT 0 COMMENT '固定标签 0:不固定 1:固定',
  `show_link` tinyint DEFAULT 1 COMMENT '是否显示 0:隐藏 1:显示',
  `show_parent` tinyint DEFAULT 0 COMMENT '是否显示父级 0:不显示 1:显示',
  `status` tinyint DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_menu_type` (`menu_type`),
  KEY `idx_rank` (`rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单管理表（完整版）';

-- 7. 数据迁移（从备份表迁移到新表）
-- 注意：只在备份表有数据时才迁移
SET @backup_count = (SELECT COUNT(*) FROM menus_backup);

-- 如果备份表有数据，迁移数据（使用新结构的列名）
INSERT INTO menus (
  id, parent_id, menu_type, title, name, path, component, `rank`,
  redirect, icon, extra_icon, enter_transition, leave_transition, active_path,
  auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
  show_link, show_parent, status, created_at, updated_at
)
SELECT
  id, parent_id, menu_type, title, name, path, component, `rank`,
  redirect, icon, extra_icon, enter_transition, leave_transition, active_path,
  auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
  show_link, show_parent, status, created_at, updated_at
FROM menus_backup
WHERE @backup_count > 0;

-- 8. 重建role_menus表（带外键约束）
CREATE TABLE `role_menus` (
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`),
  KEY `fk_role_menus_menu` (`menu_id`),
  CONSTRAINT `role_menus_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- 9. 恢复role_menus数据
INSERT INTO role_menus (role_id, menu_id)
SELECT role_id, menu_id FROM role_menus_backup;

-- 10. 启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 11. 查看迁移结果
SELECT '=== 菜单表结构 ===' as info;
DESCRIBE menus;

SELECT '=== 菜单数据示例 ===' as info;
SELECT
  id, parent_id, menu_type, title, name, path, component, `rank`,
  icon, keep_alive, show_link, status
FROM menus
ORDER BY parent_id, `rank`
LIMIT 10;

SELECT '=== 统计信息 ===' as info;
SELECT
  COUNT(*) as total_menus,
  SUM(CASE WHEN menu_type = 0 THEN 1 ELSE 0 END) as type_menu,
  SUM(CASE WHEN menu_type = 1 THEN 1 ELSE 0 END) as type_iframe,
  SUM(CASE WHEN menu_type = 2 THEN 1 ELSE 0 END) as type_external,
  SUM(CASE WHEN menu_type = 3 THEN 1 ELSE 0 END) as type_button
FROM menus;

-- 12. 清理备份表（可选，建议保留一段时间后再删除）
-- DROP TABLE menus_backup;
-- DROP TABLE role_menus_backup;
