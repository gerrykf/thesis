-- ************************************************************
-- 健康管理系统 - 完整数据初始化脚本
-- 包含：菜单、角色、角色菜单关联
-- 生成时间: 2025-11-02
-- ************************************************************

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 第一步：清空相关表数据
-- ============================================================

-- 先删除角色菜单关联（有外键约束，必须先删除）
DELETE FROM `role_menus`;

-- 删除菜单数据（使用DELETE避免外键约束问题）
DELETE FROM `menus`;

-- 重置菜单表的 AUTO_INCREMENT
ALTER TABLE `menus` AUTO_INCREMENT = 1;

-- 删除角色数据（保留用户关联）
DELETE FROM `roles` WHERE id IN (1, 2, 3);

-- ============================================================
-- 第二步：插入角色数据
-- ============================================================

INSERT INTO `roles` (`id`, `code`, `name`, `remark`, `status`) VALUES
(1, 'user', '普通用户', 'H5端普通用户，仅能查看自己的数据', 1),
(2, 'admin', '管理员', '后台管理员，可管理用户和内容', 1),
(3, 'super_admin', '超级管理员', '系统超级管理员，拥有所有权限', 1);

-- 重置 AUTO_INCREMENT
ALTER TABLE `roles` AUTO_INCREMENT = 4;

-- ============================================================
-- 第三步：插入菜单数据（ID从1开始）
-- ============================================================

INSERT INTO `menus` (`id`, `parent_id`, `menu_type`, `title`, `name`, `path`, `component`, `rank`, `redirect`, `icon`, `auths`, `show_link`, `status`, `is_static`, `router_source`) VALUES
-- ============ 首页模块 (ID: 1-2) ============
(1, 0, 0, '首页', 'Home', '/', 'Layout', 0, '/dashboard', 'ep:home-filled', NULL, 1, 1, 1, 'local'),
(2, 1, 0, '数据趋势', 'Dashboard', '/dashboard', '/views/dashboard/index.vue', 1, NULL, NULL, 'home.dashboard', 1, 1, 1, 'local'),

-- ============ 用户管理模块 (ID: 3-12) ============
(3, 0, 0, '用户管理', 'UserManagement', '/user', 'Layout', 1, '/user/index', 'ri:admin-line', NULL, 1, 1, 1, 'local'),
(4, 3, 0, '用户列表', 'UserList', '/user/index', '/views/user/list/index.vue', 1, NULL, NULL, 'user.list', 1, 1, 1, 'local'),
(5, 3, 0, '用户详情', 'UserDetail', '/user/detail/:userId?', '/views/user/detail/index.vue', 2, NULL, NULL, 'user.view', 0, 1, 1, 'local'),
(6, 3, 0, '用户分析', 'UserDashboard', '/user/dashboard', '/views/user/dashboard/index.vue', 3, NULL, NULL, 'user.dashboard', 1, 1, 1, 'local'),
-- 用户管理按钮权限
(7, 4, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'user.view', 1, 1, 1, 'local'),
(8, 4, 3, '新增', NULL, NULL, NULL, 2, NULL, NULL, 'user.add', 1, 1, 1, 'local'),
(9, 4, 3, '编辑', NULL, NULL, NULL, 3, NULL, NULL, 'user.edit', 1, 1, 1, 'local'),
(10, 4, 3, '删除', NULL, NULL, NULL, 4, NULL, NULL, 'user.delete', 1, 1, 1, 'local'),
(11, 4, 3, '禁用/启用', NULL, NULL, NULL, 5, NULL, NULL, 'user.disable', 1, 1, 1, 'local'),
(12, 4, 3, '修改角色', NULL, NULL, NULL, 6, NULL, NULL, 'user.role.change', 1, 1, 1, 'local'),

-- ============ 食物管理模块 (ID: 13-18) ============
(13, 0, 0, '食物管理', 'FoodManagement', '/food', 'Layout', 2, '/food/index', 'ri:restaurant-line', NULL, 1, 1, 1, 'local'),
(14, 13, 0, '食物列表', 'FoodList', '/food/index', '/views/food/list/index.vue', 1, NULL, NULL, 'food.list', 1, 1, 1, 'local'),
-- 食物管理按钮权限
(15, 14, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'food.view', 1, 1, 1, 'local'),
(16, 14, 3, '新增', NULL, NULL, NULL, 2, NULL, NULL, 'food.add', 1, 1, 1, 'local'),
(17, 14, 3, '编辑', NULL, NULL, NULL, 3, NULL, NULL, 'food.edit', 1, 1, 1, 'local'),
(18, 14, 3, '删除', NULL, NULL, NULL, 4, NULL, NULL, 'food.delete', 1, 1, 1, 'local'),

-- ============ 系统管理模块 (ID: 19-31) ============
(19, 0, 0, '系统管理', 'SystemManagement', '/system', '', 3, NULL, 'ri:settings-3-line', NULL, 1, 1, 0, 'database'),

-- 角色管理 (ID: 20-25)
(20, 19, 0, '角色管理', 'RoleManagement', '/system/role/index', '/system/role/index', 1, NULL, 'ep:lock', 'role.manage', 1, 1, 0, 'database'),
(21, 20, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'role.view', 1, 1, 0, 'database'),
(22, 20, 3, '新增', NULL, NULL, NULL, 2, NULL, NULL, 'role.add', 1, 1, 0, 'database'),
(23, 20, 3, '编辑', NULL, NULL, NULL, 3, NULL, NULL, 'role.edit', 1, 1, 0, 'database'),
(24, 20, 3, '删除', NULL, NULL, NULL, 4, NULL, NULL, 'role.delete', 1, 1, 0, 'database'),
(25, 20, 3, '权限配置', NULL, NULL, NULL, 5, NULL, NULL, 'role.permission', 1, 1, 0, 'database'),

-- 菜单管理 (ID: 26-31)
(26, 19, 0, '菜单管理', 'MenuManagement', '/system/menu/index', '/system/menu/index', 2, NULL, 'ep:menu', 'menu.manage', 1, 1, 0, 'database'),
(27, 26, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'menu.view', 1, 1, 0, 'database'),
(28, 26, 3, '新增菜单', NULL, NULL, NULL, 2, NULL, NULL, 'menu.add_menu', 1, 1, 0, 'database'),
(29, 26, 3, '新增', NULL, NULL, NULL, 3, NULL, NULL, 'menu.add', 1, 1, 0, 'database'),
(30, 26, 3, '编辑', NULL, NULL, NULL, 4, NULL, NULL, 'menu.edit', 1, 1, 0, 'database'),
(31, 26, 3, '删除', NULL, NULL, NULL, 5, NULL, NULL, 'menu.delete', 1, 1, 0, 'database'),

-- ============ 系统监控模块 (ID: 32-44) ============
(32, 0, 0, '系统监控', 'SystemMonitor', '/monitor', NULL, 4, NULL, 'ri:computer-line', NULL, 1, 1, 0, 'database'),

-- 在线用户 (ID: 33-35)
(33, 32, 0, '在线用户', 'OnlineUser', '/monitor/online/index', '/monitor/online/index', 1, NULL, 'ri:user-line', 'online.manage', 1, 1, 0, 'database'),
(34, 33, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'online.view', 1, 1, 0, 'database'),
(35, 33, 3, '强制下线', NULL, NULL, NULL, 2, NULL, NULL, 'online.force_logout', 1, 1, 0, 'database'),

-- 登录日志 (ID: 36-39)
(36, 32, 0, '登录日志', 'LoginLog', '/monitor/login-log/index', '/monitor/login-log/index', 2, NULL, 'ri:shield-keyhole-line', 'login_log.manage', 1, 1, 0, 'database'),
(37, 36, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'login_log.view', 1, 1, 0, 'database'),
(38, 36, 3, '批量删除', NULL, NULL, NULL, 2, NULL, NULL, 'login_log.patch', 1, 1, 0, 'database'),
(39, 36, 3, '清空所有', NULL, NULL, NULL, 3, NULL, NULL, 'login_log.clear_all', 1, 1, 0, 'database'),

-- 操作日志 (ID: 40-43)
(40, 32, 0, '操作日志', 'OperationLog', '/monitor/operation-log/index', '/monitor/operation-log/index', 3, NULL, 'ri:file-list-3-line', 'operation_log.manage', 1, 1, 0, 'database'),
(41, 40, 3, '查看', NULL, NULL, NULL, 1, NULL, NULL, 'operation_log.view', 1, 1, 0, 'database'),
(42, 40, 3, '批量删除', NULL, NULL, NULL, 2, NULL, NULL, 'operation_log.patch', 1, 1, 0, 'database'),
(43, 40, 3, '清空所有', NULL, NULL, NULL, 3, NULL, NULL, 'operation_log.clear_all', 1, 1, 0, 'database');

-- 重置 AUTO_INCREMENT
ALTER TABLE `menus` AUTO_INCREMENT = 44;

-- ============================================================
-- 第四步：插入角色菜单关联（超级管理员拥有所有权限）
-- ============================================================

-- 超级管理员(ID=3)：拥有所有菜单权限(1-43)
INSERT INTO `role_menus` (`role_id`, `menu_id`)
SELECT 3, id FROM `menus` WHERE id BETWEEN 1 AND 43;

-- 管理员(ID=2)：拥有大部分权限，但没有角色和菜单管理的删除权限
INSERT INTO `role_menus` (`role_id`, `menu_id`) VALUES
-- 首页
(2, 1), (2, 2),
-- 用户管理（全部，包括分析）
(2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12),
-- 食物管理（全部）
(2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18),
-- 系统管理
(2, 19),
-- 角色管理（除了删除ID 24）
(2, 20), (2, 21), (2, 22), (2, 23), (2, 25),
-- 菜单管理（除了删除ID 31）
(2, 26), (2, 27), (2, 28), (2, 29), (2, 30),
-- 系统监控
(2, 32),
-- 在线用户（全部）
(2, 33), (2, 34), (2, 35),
-- 登录日志（全部）
(2, 36), (2, 37), (2, 38), (2, 39),
-- 操作日志（全部）
(2, 40), (2, 41), (2, 42), (2, 43);

-- 普通用户(ID=1)：只有首页和查看权限
INSERT INTO `role_menus` (`role_id`, `menu_id`) VALUES
-- 首页
(1, 1), (1, 2),
-- 食物查看权限
(1, 13), (1, 14), (1, 15);

-- ============================================================
-- 完成
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

-- 验证数据
SELECT '=== 角色统计 ===' AS info;
SELECT id, code, name, remark, status FROM `roles` ORDER BY id;

SELECT '=== 菜单统计 ===' AS info;
SELECT
    menu_type,
    CASE menu_type
        WHEN 0 THEN '菜单'
        WHEN 3 THEN '按钮'
        ELSE '其他'
    END AS type_name,
    COUNT(*) AS count
FROM `menus`
GROUP BY menu_type;

SELECT '=== 角色权限统计 ===' AS info;
SELECT
    r.id,
    r.name AS role_name,
    COUNT(rm.menu_id) AS menu_count
FROM `roles` r
LEFT JOIN `role_menus` rm ON r.id = rm.role_id
GROUP BY r.id, r.name
ORDER BY r.id;

SELECT '=== 数据初始化完成 ===' AS info;

-- ============================================================
-- 第五步：更新用户表的 role_id（修复权限关联）
-- ============================================================

-- 更新超级管理员用户（sadmin）的 role_id 为 3
UPDATE `users` SET `role_id` = 3 WHERE `username` = 'sadmin' AND `role` = 'super_admin';

-- 更新管理员用户（admin）的 role_id 为 2
UPDATE `users` SET `role_id` = 2 WHERE `username` = 'admin' AND `role` = 'admin';

-- 更新所有其他用户的 role_id 为 1（普通用户）
UPDATE `users` SET `role_id` = 1 WHERE `role_id` IS NULL OR `role_id` NOT IN (1, 2, 3);

-- 验证用户 role_id 更新结果
SELECT '=== 用户角色更新统计 ===' AS info;
SELECT username, role, role_id FROM `users` WHERE username IN ('sadmin', 'admin') OR role_id = 1 LIMIT 10;
