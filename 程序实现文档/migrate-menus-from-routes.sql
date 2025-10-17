-- ====================================================
-- 从前端路由模块迁移菜单数据到数据库
-- 生成时间: 2025-10-17
-- 说明: 该脚本会清空现有菜单数据，并根据前端路由模块重新生成
-- ====================================================

USE health_management;

-- 1. 清空现有菜单数据
-- 注意：由于外键约束，需要先删除 role_menus，再删除 menus
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE role_menus;
TRUNCATE TABLE menus;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. 重置自增ID
ALTER TABLE menus AUTO_INCREMENT = 1;

-- ====================================================
-- 插入菜单数据
-- ====================================================

-- 一级菜单: 首页
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, show_link, keep_alive, status) VALUES
(1, 0, 0, '首页', 'Home', '/', NULL, 0, '/dashboard', 'ep:home-filled', 1, 0, 1);

-- 首页子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, icon, show_link, keep_alive, status) VALUES
(1, 0, '数据趋势', 'Dashboard', '/dashboard', 'dashboard/index', 1, 'ep:data-line', 1, 1, 1),
(1, 0, '欢迎页', 'Welcome', '/welcome', 'welcome/index', 2, 'ep:star-filled', 0, 0, 1);

-- 一级菜单: 系统管理
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, icon, show_link, status) VALUES
(10, 0, 0, '系统管理', 'SystemManagement', '/system', NULL, 2, 'ri:settings-3-line', 1, 1);

-- 系统管理子菜单: 用户管理
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, show_link, status) VALUES
(11, 10, 0, '用户管理', 'UserManagement', '/users', NULL, 1, '/users/list', 'ep:user-filled', 1, 1);

-- 用户管理子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, show_link, active_path, status) VALUES
(11, 0, '用户列表', 'UserList', '/users/list', 'system/users/list/index', 1, 1, NULL, 1),
(11, 0, '用户详情', 'UserDetail', '/users/detail/:id', 'system/users/detail/index', 2, 0, '/users/list', 1);

-- 系统管理子菜单: 角色管理
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, show_link, status) VALUES
(14, 10, 0, '角色管理', 'RoleManagement', '/roles', NULL, 3, '/roles/list', 'ep:lock', 1, 1);

-- 角色管理子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, show_link, status) VALUES
(14, 0, '角色列表', 'RoleList', '/roles/list', 'system/roles/index', 1, 1, 1);

-- 系统管理子菜单: 菜单管理
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, show_link, status) VALUES
(16, 10, 0, '菜单管理', 'MenuManagement', '/menus', NULL, 4, '/menus/list', 'ep:menu', 1, 1);

-- 菜单管理子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, show_link, status) VALUES
(16, 0, '菜单列表', 'MenuList', '/menus/list', 'system/menus/index', 1, 1, 1);

-- 一级菜单: 食物管理
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, show_link, status) VALUES
(20, 0, 0, '食物管理', 'FoodManagement', '/foods', NULL, 3, '/foods/list', 'ep:food', 1, 1);

-- 食物管理子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, show_link, status) VALUES
(20, 0, '食物列表', 'FoodList', '/foods/list', 'foods/list/index', 1, 1, 1);

-- 一级菜单: 系统监控
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, icon, show_link, status) VALUES
(30, 0, 0, '系统监控', 'SystemMonitor', '/monitor', NULL, 4, 'ri:computer-line', 1, 1);

-- 系统监控子菜单
INSERT INTO menus (parent_id, menu_type, title, name, path, component, `rank`, icon, show_link, status) VALUES
(30, 0, '在线用户', 'OnlineUser', '/monitor/online', 'monitor/online/index', 1, 'ri:user-line', 1, 1),
(30, 0, '登录日志', 'LoginLog', '/monitor/login-logs', 'monitor/login-log/index', 2, 'ri:shield-keyhole-line', 1, 1),
(30, 0, '操作日志', 'OperationLog', '/monitor/operation-logs', 'monitor/operation-log/index', 3, 'ri:file-list-3-line', 1, 1);

-- ====================================================
-- 为 super_admin 角色授权所有菜单
-- ====================================================

-- 获取 super_admin 角色ID (假设为3)
SET @super_admin_role_id = 3;

-- 为 super_admin 授权所有菜单
INSERT INTO role_menus (role_id, menu_id)
SELECT @super_admin_role_id, id FROM menus WHERE status = 1;

-- ====================================================
-- 验证数据
-- ====================================================

-- 查看所有菜单
SELECT
    id,
    parent_id,
    menu_type,
    title,
    name,
    path,
    `rank`,
    icon,
    show_link,
    status
FROM menus
ORDER BY parent_id, `rank`, id;

-- 查看 super_admin 的菜单授权数量
SELECT
    r.name AS role_name,
    COUNT(rm.menu_id) AS menu_count
FROM roles r
LEFT JOIN role_menus rm ON r.id = rm.role_id
WHERE r.code = 'super_admin'
GROUP BY r.id, r.name;

-- 查看菜单树形结构（一级菜单及其子菜单数量）
SELECT
    p.id AS parent_id,
    p.title AS parent_title,
    COUNT(c.id) AS children_count
FROM menus p
LEFT JOIN menus c ON p.id = c.parent_id AND c.status = 1
WHERE p.parent_id = 0 AND p.status = 1
GROUP BY p.id, p.title
ORDER BY p.rank;

SELECT '菜单迁移完成！' AS message;
