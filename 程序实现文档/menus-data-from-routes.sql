-- 根据项目路由文件生成的完整菜单数据
-- 包含所有vue-pure-admin字段
-- 需要先执行 database-migration-menus-fixed.sql 迁移表结构

-- 清空现有菜单数据（保留备份）
-- 临时禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE role_menus;
TRUNCATE TABLE menus;

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 2. 系统管理模块 (ID: 10-29)
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, redirect, icon, keep_alive, show_link, status) VALUES
-- 系统管理父级
(
    10,
    0,
    0,
    '系统管理',
    'SystemManagement',
    '/system',
    NULL,
    2,
    null,
    'ri:settings-3-line',
    0,
    1,
    1
),

-- 角色管理
(
    14,
    10,
    0,
    '角色管理',
    'RoleManagement',
    '/system/role',
    NULL,
    3,
    '/role/index',
    'ep:lock',
    0,
    1,
    1
),

-- 菜单管理
(
    16,
    10,
    0,
    '菜单管理',
    'MenuManagement',
    '/system/menu',
    NULL,
    4,
    '/system/menu/index',
    'ep:menu',
    0,
    1,
    1
),

-- 用户管理按钮权限 (ID: 20-24)
INSERT INTO menus (id, parent_id, menu_type, title, name, auths, `rank`, show_link, status) VALUES
(20, 12, 3, '新增用户', NULL, 'user:add', 1, 1, 1),
(21, 12, 3, '编辑用户', NULL, 'user:edit', 2, 1, 1),
(22, 12, 3, '删除用户', NULL, 'user:delete', 3, 1, 1),
(23, 12, 3, '重置密码', NULL, 'user:reset', 4, 1, 1),
(24, 12, 3, '分配角色', NULL, 'user:role', 5, 1, 1);

-- 角色管理按钮权限 (ID: 25-29)
INSERT INTO menus (id, parent_id, menu_type, title, name, auths, `rank`, show_link, status) VALUES
(25, 15, 3, '新增角色', NULL, 'role:add', 1, 1, 1),
(26, 15, 3, '编辑角色', NULL, 'role:edit', 2, 1, 1),
(27, 15, 3, '删除角色', NULL, 'role:delete', 3, 1, 1),
(28, 15, 3, '菜单权限', NULL, 'role:menu', 4, 1, 1),
(29, 15, 3, '切换状态', NULL, 'role:status', 5, 1, 1);

-- 食物管理按钮权限 (ID: 35-39)
INSERT INTO menus (id, parent_id, menu_type, title, name, auths, `rank`, show_link, status) VALUES
(35, 31, 3, '新增食物', NULL, 'food:add', 1, 1, 1),
(36, 31, 3, '编辑食物', NULL, 'food:edit', 2, 1, 1),
(37, 31, 3, '删除食物', NULL, 'food:delete', 3, 1, 1),
(38, 31, 3, '导入食物', NULL, 'food:import', 4, 1, 1),
(39, 31, 3, '导出食物', NULL, 'food:export', 5, 1, 1);

-- 4. 系统监控模块 (ID: 40-45)
INSERT INTO menus (id, parent_id, menu_type, title, name, path, component, `rank`, icon, keep_alive, show_link, status) VALUES
(40, 0, 0, '系统监控', 'SystemMonitor', '/monitor', NULL, 4, 'ri:computer-line', 0, 1, 1),
(41, 40, 0, '在线用户', 'OnlineUser', '/monitor/online', 'monitor/online/index', 1, 'ri:user-line', 1, 1, 1),
(42, 40, 0, '登录日志', 'LoginLog', '/monitor/login-logs', 'monitor/login-log/index', 2, 'ri:shield-keyhole-line', 1, 1, 1),
(43, 40, 0, '操作日志', 'OperationLog', '/monitor/operation-logs', 'monitor/operation-log/index', 3, 'ri:file-list-3-line', 1, 1, 1);

-- 5. 外部链接和iframe示例 (ID: 50-55)
INSERT INTO menus (id, parent_id, menu_type, title, name, path, `rank`, icon, frame_src, frame_loading, show_link, status) VALUES
-- iframe示例
(50, 0, 1, 'Vue官方文档', 'VueDoc', '/external/vue', 10, 'ri:vuejs-fill', 'https://cn.vuejs.org/', 1, 1, 1),
(51, 0, 1, 'Element Plus', 'ElementPlus', '/external/element', 11, 'ep:eleme-filled', 'https://element-plus.org/zh-CN/', 1, 1, 1);

-- 外链示例
INSERT INTO menus (id, parent_id, menu_type, title, name, path, `rank`, icon, show_link, status) VALUES
(52, 0, 2, 'GitHub仓库', 'GitHub', 'https://github.com', 12, 'ri:github-fill', 1, 1),
(53, 0, 2, 'Pure Admin', 'PureAdmin', 'https://pure-admin.cn', 13, 'ri:admin-fill', 1, 1);

-- 6. 角色菜单权限分配

-- 超级管理员(role_id=1) - 拥有所有菜单权限
INSERT INTO role_menus (role_id, menu_id)
SELECT 1, id FROM menus WHERE status = 1;

-- 普通管理员(role_id=2) - 拥有部分菜单权限（排除系统监控）
INSERT INTO role_menus (role_id, menu_id)
SELECT 2, id FROM menus
WHERE status = 1
AND id NOT IN (40, 41, 42, 43)  -- 排除系统监控
AND id < 50;  -- 排除外链和iframe示例

-- 普通用户(role_id=3) - 只有首页和欢迎页
INSERT INTO role_menus (role_id, menu_id)
VALUES
(3, 1),  -- 首页
(3, 2),  -- 数据趋势
(3, 3);  -- 欢迎页

-- 查看菜单树形结构
SELECT
  id,
  parent_id,
  menu_type,
  title,
  name,
  path,
  component,
  `rank`,
  icon,
  CASE menu_type
    WHEN 0 THEN '菜单'
    WHEN 1 THEN 'iframe'
    WHEN 2 THEN '外链'
    WHEN 3 THEN '按钮'
  END as type_text,
  CASE show_link WHEN 1 THEN '是' ELSE '否' END as visible
FROM menus
WHERE status = 1
ORDER BY parent_id, `rank`;

-- 查看权限分配统计
SELECT
  r.id as role_id,
  r.name as role_name,
  COUNT(rm.menu_id) as menu_count
FROM roles r
LEFT JOIN role_menus rm ON r.id = rm.role_id
GROUP BY r.id, r.name
ORDER BY r.id;
