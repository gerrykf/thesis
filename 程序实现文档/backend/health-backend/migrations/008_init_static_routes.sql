-- ====================================================
-- 初始化静态路由数据到 menus 表
-- 创建时间: 2025-10-18
-- 说明: 将前端静态路由配置同步到数据库
--       路径: frontend/health-manage/src/router/modules/
-- ====================================================

-- ====================================================
-- 1. 清理旧的静态路由数据（可选，首次运行可注释掉）
-- ====================================================
-- DELETE FROM menus WHERE is_static = 1 AND router_source = 'local';

-- ====================================================
-- 2. 插入静态路由数据
-- ====================================================

-- ---------------------------------------------------
-- 2.1 首页模块 (home.ts)
-- ---------------------------------------------------

-- 一级菜单：首页
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`, redirect,
  icon, show_link, is_static, router_source, status
) VALUES (
  0, 0, '首页', 'Home', '/', 'Layout', 0, '/dashboard',
  'ep/home-filled', 1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  redirect = VALUES(redirect);

SET @home_id = LAST_INSERT_ID();

-- 二级菜单：数据趋势
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`,
  show_link, is_static, router_source, status
) VALUES (
  @home_id, 1, '数据趋势', 'Dashboard', '/dashboard', '/views/dashboard/index.vue', 1,
  1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`);

-- ---------------------------------------------------
-- 2.2 用户管理模块 (user.ts)
-- ---------------------------------------------------

-- 一级菜单：用户管理
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`, redirect,
  icon, show_link, is_static, router_source, status
) VALUES (
  0, 0, '用户管理', 'UserManagement', '/user', 'Layout', 1, '/user/index',
  'ri:admin-line', 1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  redirect = VALUES(redirect);

SET @user_management_id = LAST_INSERT_ID();

-- 二级菜单：用户列表
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`,
  auths, show_link, is_static, router_source, status
) VALUES (
  @user_management_id, 1, '用户管理', 'UserList', '/user/index', '/views/user/list/index.vue', 1,
  'user.list', 1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  auths = VALUES(auths);

SET @user_list_id = LAST_INSERT_ID();

-- 三级菜单：用户详情（不显示在菜单中）
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`,
  auths, show_link, is_static, router_source, status
) VALUES (
  @user_management_id, 1, '用户详情', 'UserDetail', '/user/detail/:userId?', '/views/user/detail/index.vue', 2,
  'user.view', 0, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  auths = VALUES(auths);

-- 用户列表的按钮权限
INSERT INTO menus (parent_id, menu_type, title, auths, `rank`, is_static, router_source, status) VALUES
(@user_list_id, 2, '查看', 'user.view', 1, 1, 'local', 1),
(@user_list_id, 2, '新增', 'user.add', 2, 1, 'local', 1),
(@user_list_id, 2, '编辑', 'user.edit', 3, 1, 'local', 1),
(@user_list_id, 2, '删除', 'user.delete', 4, 1, 'local', 1),
(@user_list_id, 2, '修改角色', 'user.role.change', 5, 1, 'local', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  auths = VALUES(auths),
  `rank` = VALUES(`rank`);

-- ---------------------------------------------------
-- 2.3 食物管理模块 (food.ts)
-- ---------------------------------------------------

-- 一级菜单：食物管理
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`, redirect,
  icon, show_link, is_static, router_source, status
) VALUES (
  0, 0, '食物管理', 'FoodManagement', '/food', 'Layout', 3, '/food/index',
  'ep:food', 1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  redirect = VALUES(redirect);

SET @food_management_id = LAST_INSERT_ID();

-- 二级菜单：食物列表
INSERT INTO menus (
  parent_id, menu_type, title, name, path, component, `rank`,
  auths, show_link, is_static, router_source, status
) VALUES (
  @food_management_id, 1, '食物管理', 'FoodList', '/food/index', '/views/food/list/index.vue', 1,
  'food.list', 1, 1, 'local', 1
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  name = VALUES(name),
  path = VALUES(path),
  `rank` = VALUES(`rank`),
  auths = VALUES(auths);

SET @food_list_id = LAST_INSERT_ID();

-- 食物列表的按钮权限
INSERT INTO menus (parent_id, menu_type, title, auths, `rank`, is_static, router_source, status) VALUES
(@food_list_id, 2, '查看', 'food.view', 1, 1, 'local', 1),
(@food_list_id, 2, '新增', 'food.add', 2, 1, 'local', 1),
(@food_list_id, 2, '编辑', 'food.edit', 3, 1, 'local', 1),
(@food_list_id, 2, '删除', 'food.delete', 4, 1, 'local', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  auths = VALUES(auths),
  `rank` = VALUES(`rank`);

-- ====================================================
-- 3. 为静态路由分配权限到角色
-- ====================================================

-- 获取所有静态路由的ID
SET @static_menu_ids = (
  SELECT GROUP_CONCAT(id)
  FROM menus
  WHERE is_static = 1 AND router_source = 'local'
);

-- 为超级管理员分配所有静态路由权限
INSERT IGNORE INTO role_menus (role_id, menu_id)
SELECT 3, id FROM menus WHERE is_static = 1 AND router_source = 'local';

-- 为管理员分配大部分静态路由权限（排除敏感功能）
INSERT IGNORE INTO role_menus (role_id, menu_id)
SELECT 2, id FROM menus
WHERE is_static = 1
  AND router_source = 'local'
  AND menu_type IN (0, 1); -- 只分配菜单，不包括按钮权限

-- 为普通用户分配基础查看权限
INSERT IGNORE INTO role_menus (role_id, menu_id)
SELECT 1, id FROM menus
WHERE is_static = 1
  AND router_source = 'local'
  AND menu_type IN (0, 1)
  AND (auths IS NULL OR auths LIKE '%.view' OR auths LIKE '%.list');

-- ====================================================
-- 4. 验证数据
-- ====================================================

SELECT '静态路由数据统计:' AS info;
SELECT
  CASE menu_type
    WHEN 0 THEN '目录'
    WHEN 1 THEN '菜单'
    WHEN 2 THEN '按钮'
    ELSE '未知'
  END AS menu_type_name,
  COUNT(*) as count
FROM menus
WHERE is_static = 1 AND router_source = 'local'
GROUP BY menu_type;

SELECT '静态路由列表:' AS info;
SELECT id, parent_id, menu_type, title, name, path, auths, is_static, router_source
FROM menus
WHERE is_static = 1 AND router_source = 'local'
ORDER BY `rank` ASC, id ASC;

-- ====================================================
-- 脚本执行完成
-- ====================================================
