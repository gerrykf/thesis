-- 菜单管理表完整字段迁移脚本
-- 参考 vue-pure-admin 实现

-- 1. 备份当前表
CREATE TABLE menus_backup AS SELECT * FROM menus;

-- 2. 删除旧表
DROP TABLE IF EXISTS menus;

-- 3. 创建新表（包含所有25个字段）
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

-- 4. 数据迁移（从备份表迁移到新表）
INSERT INTO menus (
  id, parent_id, menu_type, title, name, path, component, rank,
  icon, auths, show_link, status
)
SELECT
  id,
  parent_id,
  CASE type
    WHEN 'menu' THEN 0
    WHEN 'button' THEN 3
    ELSE 0
  END as menu_type,
  title,
  NULL as name,  -- 原表没有name字段
  path,
  component,
  sort as rank,
  icon,
  permission as auths,
  CASE status WHEN 1 THEN 1 ELSE 0 END as show_link,
  status
FROM menus_backup;

-- 5. 示例数据：添加完整字段的菜单示例
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, rank, redirect,
  icon, enter_transition, leave_transition, keep_alive, show_link, status
) VALUES
-- 首页（带动画和缓存）
(0, 0, '首页', 'Home', '/home', 'home/index', 1, NULL,
 'ep:home-filled', 'animate__fadeIn', 'animate__fadeOut', 1, 1, 1),

-- 系统管理（目录）
(0, 0, '系统管理', 'System', '/system', NULL, 10, '/system/menu',
 'ep:setting', NULL, NULL, 0, 1, 1),

-- iframe示例
(0, 1, 'Ant Design', 'AntDesign', '/external/antd', NULL, 20, NULL,
 'ri:ant-design-fill', NULL, NULL, 0, 1, 1),

-- 外链示例
(0, 2, 'Vue官网', 'VueDoc', 'https://cn.vuejs.org/', NULL, 21, NULL,
 'ri:vuejs-fill', NULL, NULL, 0, 1, 1),

-- 按钮权限示例
(1, 3, '新增用户', NULL, NULL, NULL, 1, NULL,
 NULL, NULL, NULL, 0, 1, 1);

-- 6. 更新iframe菜单的frame_src字段
UPDATE menus SET frame_src = 'https://ant.design/index-cn' WHERE menu_type = 1 AND title = 'Ant Design';

-- 7. 删除备份表（可选，建议保留一段时间）
-- DROP TABLE menus_backup;

-- 8. 查看迁移结果
SELECT
  id, parent_id, menu_type, title, name, path, component, rank,
  icon, keep_alive, show_link, status
FROM menus
ORDER BY parent_id, rank;
