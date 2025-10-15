-- ====================================================
-- RBAC (Role-Based Access Control) 权限系统数据库迁移脚本
-- 创建时间: 2025-10-15
-- 说明: 该脚本用于在现有数据库基础上添加角色权限管理系统
-- 适用场景: 已有用户数据，需要增加RBAC权限系统
-- 注意事项:
--   1. 本脚本会保留现有的 users 表中的 role 字段（向后兼容）
--   2. 本脚本会在 users 表中添加 role_id 字段
--   3. 本脚本使用 ON DUPLICATE KEY UPDATE 支持重复执行
-- ====================================================

-- ====================================================
-- 1. 创建角色表 (roles)
-- ====================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
  name VARCHAR(50) NOT NULL COMMENT '角色名称',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色标识',
  status TINYINT DEFAULT 1 COMMENT '状态 1:启用 0:禁用',
  remark VARCHAR(255) DEFAULT NULL COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ====================================================
-- 2. 创建菜单/权限表 (menus)
-- ====================================================
CREATE TABLE IF NOT EXISTS menus (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单ID',
  parent_id INT DEFAULT 0 COMMENT '父菜单ID，0表示顶级菜单',
  title VARCHAR(50) NOT NULL COMMENT '菜单标题',
  path VARCHAR(100) DEFAULT NULL COMMENT '路由路径',
  component VARCHAR(100) DEFAULT NULL COMMENT '组件路径',
  icon VARCHAR(50) DEFAULT NULL COMMENT '图标',
  sort INT DEFAULT 0 COMMENT '排序',
  type TINYINT DEFAULT 1 COMMENT '类型 1:菜单 2:按钮',
  permission VARCHAR(100) DEFAULT NULL COMMENT '权限标识',
  status TINYINT DEFAULT 1 COMMENT '状态 1:启用 0:禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单权限表';

-- ====================================================
-- 3. 创建角色-菜单关联表 (role_menus)
-- ====================================================
CREATE TABLE IF NOT EXISTS role_menus (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  role_id INT NOT NULL COMMENT '角色ID',
  menu_id INT NOT NULL COMMENT '菜单ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY uk_role_menu (role_id, menu_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- ====================================================
-- 4. 初始化角色数据 (必须在添加外键前执行)
-- ====================================================
INSERT INTO roles (id, name, code, status, remark) VALUES
(1, '普通用户', 'user', 1, '普通用户角色，可以管理自己的健康数据'),
(2, '管理员', 'admin', 1, '管理员角色，可以管理所有数据和用户'),
(3, '超级管理员', 'super_admin', 1, '超级管理员角色，拥有所有权限，可以管理用户角色')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  code = VALUES(code),
  status = VALUES(status),
  remark = VALUES(remark);

-- ====================================================
-- 5. 修改用户表 - 添加 role_id 字段
-- ====================================================
-- 检查列是否存在，如果不存在则添加
-- 注意: 保留 role 字段用于向后兼容，role_id 为新的权限控制字段
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role_id'
);

-- 如果 role_id 列不存在，则添加（先不设置外键）
SET @sql = IF(@column_exists = 0,
  'ALTER TABLE users ADD COLUMN role_id INT DEFAULT NULL COMMENT ''角色ID''',
  'SELECT ''Column role_id already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 6. 更新现有用户数据 - 设置 role_id
-- ====================================================
-- 将现有 role 字段为 'user' 的用户设置为普通用户角色
UPDATE users SET role_id = 1 WHERE role = 'user' AND (role_id IS NULL OR role_id = 0);

-- 将现有 role 字段为 'admin' 的用户设置为管理员角色
UPDATE users SET role_id = 2 WHERE role = 'admin' AND (role_id IS NULL OR role_id = 0);

-- 将所有 role_id 为 NULL 的用户默认设置为普通用户
UPDATE users SET role_id = 1 WHERE role_id IS NULL;

-- ====================================================
-- 7. 添加外键约束 (在数据更新后)
-- ====================================================
-- 添加外键约束（先检查是否存在）
SET @constraint_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND CONSTRAINT_NAME = 'fk_users_role_id'
);

SET @sql = IF(@constraint_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL',
  'SELECT ''Foreign key fk_users_role_id already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 8. 初始化菜单数据
-- ====================================================

-- 一级菜单
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
-- 首页
(1, 0, '首页', '/', 'Layout', 'HomeFilled', 1, 1, NULL, 1),
-- 健康管理
(10, 0, '健康管理', '/health', 'Layout', 'Finished', 2, 1, NULL, 1),
-- 食物管理
(20, 0, '食物管理', '/foods', 'Layout', 'Food', 3, 1, NULL, 1),
-- 饮食计划
(30, 0, '饮食计划', '/diet', 'Layout', 'Calendar', 4, 1, NULL, 1),
-- 用户管理
(40, 0, '用户管理', '/users', 'Layout', 'User', 5, 1, NULL, 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 二级菜单 - 首页
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(2, 1, '用户欢迎页', '/welcome', '/welcome/index', 'House', 1, 1, 'home.welcome', 1),
(3, 1, '管理员仪表盘', '/dashboard', '/dashboard/index', 'DataAnalysis', 2, 1, 'home.dashboard', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 二级菜单 - 健康管理
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(11, 10, '我的健康记录', '/health/records', '/health/records/index', 'Document', 1, 1, 'health.records', 1),
(12, 10, '所有健康记录', '/health/all-records', '/health/all-records/index', 'Files', 2, 1, 'health.all-records', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 我的健康记录
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(111, 11, '查看', NULL, NULL, NULL, 1, 2, 'health.view.own', 1),
(112, 11, '新增', NULL, NULL, NULL, 2, 2, 'health.add', 1),
(113, 11, '编辑', NULL, NULL, NULL, 3, 2, 'health.edit', 1),
(114, 11, '删除', NULL, NULL, NULL, 4, 2, 'health.delete', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 所有健康记录
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(121, 12, '查看所有', NULL, NULL, NULL, 1, 2, 'health.view.all', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 二级菜单 - 食物管理
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(21, 20, '食物列表', '/foods/list', '/food-management/list/index', 'List', 1, 1, 'food.list', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 食物列表
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(211, 21, '查看', NULL, NULL, NULL, 1, 2, 'food.view', 1),
(212, 21, '新增', NULL, NULL, NULL, 2, 2, 'food.add', 1),
(213, 21, '编辑', NULL, NULL, NULL, 3, 2, 'food.edit', 1),
(214, 21, '删除', NULL, NULL, NULL, 4, 2, 'food.delete', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 二级菜单 - 饮食计划
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(31, 30, '我的饮食计划', '/diet/plan', '/diet/plan/index', 'Calendar', 1, 1, 'diet.plan', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 饮食计划
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(311, 31, '查看', NULL, NULL, NULL, 1, 2, 'diet.view', 1),
(312, 31, '生成', NULL, NULL, NULL, 2, 2, 'diet.generate', 1),
(313, 31, '管理', NULL, NULL, NULL, 3, 2, 'diet.manage', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 二级菜单 - 用户管理
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(41, 40, '用户列表', '/users/list', '/user-management/list/index', 'UserFilled', 1, 1, 'user.list', 1),
(42, 40, '角色管理', '/users/roles', '/role-management/index', 'Avatar', 2, 1, 'role.manage', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  path = VALUES(path),
  component = VALUES(component),
  icon = VALUES(icon),
  sort = VALUES(sort),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 用户列表
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(411, 41, '查看', NULL, NULL, NULL, 1, 2, 'user.view', 1),
(412, 41, '编辑', NULL, NULL, NULL, 2, 2, 'user.edit', 1),
(413, 41, '删除', NULL, NULL, NULL, 3, 2, 'user.delete', 1),
(414, 41, '修改角色', NULL, NULL, NULL, 4, 2, 'user.role.change', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- 三级按钮 - 角色管理
INSERT INTO menus (id, parent_id, title, path, component, icon, sort, type, permission, status) VALUES
(421, 42, '查看', NULL, NULL, NULL, 1, 2, 'role.view', 1),
(422, 42, '新增', NULL, NULL, NULL, 2, 2, 'role.add', 1),
(423, 42, '编辑', NULL, NULL, NULL, 3, 2, 'role.edit', 1),
(424, 42, '删除', NULL, NULL, NULL, 4, 2, 'role.delete', 1),
(425, 42, '权限配置', NULL, NULL, NULL, 5, 2, 'role.permission', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id),
  title = VALUES(title),
  type = VALUES(type),
  permission = VALUES(permission),
  status = VALUES(status);

-- ====================================================
-- 9. 初始化角色-菜单关联数据
-- ====================================================

-- 普通用户权限 (role_id = 1)
INSERT INTO role_menus (role_id, menu_id) VALUES
-- 首页 - 用户欢迎页
(1, 1), (1, 2),
-- 健康管理 - 我的健康记录
(1, 10), (1, 11), (1, 111), (1, 112), (1, 113), (1, 114),
-- 食物管理 - 食物列表（仅查看）
(1, 20), (1, 21), (1, 211),
-- 饮食计划
(1, 30), (1, 31), (1, 311), (1, 312), (1, 313)
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id);

-- 管理员权限 (role_id = 2) - 拥有业务管理权限
INSERT INTO role_menus (role_id, menu_id) VALUES
-- 首页 - 管理员仪表盘
(2, 1), (2, 3),
-- 健康管理 - 所有功能
(2, 10), (2, 11), (2, 111), (2, 112), (2, 113), (2, 114),
(2, 12), (2, 121),
-- 食物管理 - 所有功能
(2, 20), (2, 21), (2, 211), (2, 212), (2, 213), (2, 214),
-- 饮食计划
(2, 30), (2, 31), (2, 311), (2, 312), (2, 313),
-- 用户管理 - 用户列表（可修改用户角色）
(2, 40), (2, 41), (2, 411), (2, 412), (2, 413), (2, 414)
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id);

-- 超级管理员权限 (role_id = 3) - 拥有所有权限包括角色管理
INSERT INTO role_menus (role_id, menu_id) VALUES
-- 首页 - 管理员仪表盘
(3, 1), (3, 3),
-- 健康管理 - 所有功能
(3, 10), (3, 11), (3, 111), (3, 112), (3, 113), (3, 114),
(3, 12), (3, 121),
-- 食物管理 - 所有功能
(3, 20), (3, 21), (3, 211), (3, 212), (3, 213), (3, 214),
-- 饮食计划
(3, 30), (3, 31), (3, 311), (3, 312), (3, 313),
-- 用户管理 - 所有功能
(3, 40), (3, 41), (3, 411), (3, 412), (3, 413), (3, 414),
-- 角色管理 - 所有功能（超级管理员独享）
(3, 42), (3, 421), (3, 422), (3, 423), (3, 424), (3, 425)
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id);

-- ====================================================
-- 10. 验证数据
-- ====================================================
-- 查看角色数据
SELECT '角色数据:' AS info;
SELECT * FROM roles;

-- 查看菜单数据统计
SELECT '菜单数据统计:' AS info;
SELECT
  type,
  CASE type
    WHEN 1 THEN '菜单'
    WHEN 2 THEN '按钮'
    ELSE '未知'
  END AS type_name,
  COUNT(*) as count
FROM menus
GROUP BY type;

-- 查看角色权限统计
SELECT '角色权限统计:' AS info;
SELECT
  r.name AS role_name,
  COUNT(rm.menu_id) AS menu_count
FROM roles r
LEFT JOIN role_menus rm ON r.id = rm.role_id
GROUP BY r.id, r.name;

-- 查看用户角色分布
SELECT '用户角色分布:' AS info;
SELECT
  r.name AS role_name,
  COUNT(u.id) AS user_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
GROUP BY r.id, r.name;

-- ====================================================
-- 11. 插入超级管理员账户
-- ====================================================
-- 用户名: sadmin
-- 密码: sadmin666
-- 角色: super_admin (role_id = 3)
-- 注意: 使用 ON DUPLICATE KEY UPDATE 支持重复执行
INSERT INTO users (username, email, password, role, role_id, created_at)
VALUES
  ('sadmin', 'sadmin@system.local', '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW', 'super_admin', 3, NOW())
ON DUPLICATE KEY UPDATE
  password = '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW',
  role = 'super_admin',
  role_id = 3,
  updated_at = NOW();

-- 验证超级管理员账户
SELECT '超级管理员账户:' AS info;
SELECT id, username, email, role, role_id, created_at
FROM users
WHERE username = 'sadmin';

-- ====================================================
-- 脚本执行完成
-- ====================================================
