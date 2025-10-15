-- ====================================================
-- 插入超级管理员账户
-- ====================================================
-- 用户名: sadmin
-- 密码: sadmin666
-- 角色: super_admin (role_id = 3)
-- 创建时间: 2025-10-15
-- 说明: 该脚本用于创建或更新超级管理员账户
-- 注意事项:
--   1. 密码已使用 bcrypt (saltRounds=12) 加密
--   2. 使用 ON DUPLICATE KEY UPDATE 支持重复执行
--   3. 如果用户名已存在，将更新密码和角色信息
-- ====================================================

USE health_management;

-- 插入超级管理员账户
INSERT INTO users (username, email, password, role, role_id, created_at)
VALUES
  ('sadmin', 'sadmin@system.local', '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW', 'super_admin', 3, NOW())
ON DUPLICATE KEY UPDATE
  password = '$2a$12$Ax56z5cnV4XwaKx9gNYdUedjDdB7SGfW8dtGiOy9I9Y0XV2uZZHQW',
  role = 'super_admin',
  role_id = 3,
  updated_at = NOW();

-- 验证超级管理员账户
SELECT '✅ 超级管理员账户创建/更新成功！' AS message;
SELECT
  id AS '用户ID',
  username AS '用户名',
  email AS '邮箱',
  role AS '角色代码',
  role_id AS '角色ID',
  created_at AS '创建时间',
  updated_at AS '更新时间'
FROM users
WHERE username = 'sadmin';

-- 显示账户信息
SELECT '
=====================================
账户信息:
=====================================
用户名: sadmin
密码:   sadmin666
角色:   超级管理员 (super_admin)
邮箱:   sadmin@system.local
权限:   拥有所有系统权限
=====================================
' AS '登录信息';
