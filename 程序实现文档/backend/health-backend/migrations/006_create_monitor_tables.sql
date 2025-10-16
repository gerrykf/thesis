-- 监控模块数据表迁移文件
-- 创建时间: 2025-10-16

-- 1. 创建登录日志表
CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` INT NULL COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `ip` VARCHAR(45) NOT NULL COMMENT '登录IP地址',
  `address` VARCHAR(200) NULL COMMENT '登录地点',
  `system` VARCHAR(100) NULL COMMENT '操作系统',
  `browser` VARCHAR(100) NULL COMMENT '浏览器类型',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '登录状态：1=成功，0=失败',
  `behavior` VARCHAR(100) NULL COMMENT '登录行为描述',
  `error_message` TEXT NULL COMMENT '失败原因',
  `login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_ip` (`ip`),
  KEY `idx_status` (`status`),
  KEY `idx_login_time` (`login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

-- 2. 创建在线用户表（Session表）
CREATE TABLE IF NOT EXISTS `online_users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `token` VARCHAR(500) NOT NULL COMMENT 'JWT Token',
  `ip` VARCHAR(45) NOT NULL COMMENT '登录IP地址',
  `address` VARCHAR(200) NULL COMMENT '登录地点',
  `system` VARCHAR(100) NULL COMMENT '操作系统',
  `browser` VARCHAR(100) NULL COMMENT '浏览器类型',
  `login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `last_active_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后活跃时间',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'Token过期时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`(255)),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_ip` (`ip`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='在线用户表';

-- 3. 修改 system_logs 表，添加缺失的字段
-- 注意：需要手动检查字段是否存在，如果已存在会报错但不影响其他操作
ALTER TABLE `system_logs`
  ADD COLUMN `module` VARCHAR(100) NULL COMMENT '所属模块' AFTER `user_id`;

ALTER TABLE `system_logs`
  ADD COLUMN `summary` VARCHAR(500) NULL COMMENT '操作概要' AFTER `module`;

ALTER TABLE `system_logs`
  ADD COLUMN `address` VARCHAR(200) NULL COMMENT 'IP地点' AFTER `ip_address`;

ALTER TABLE `system_logs`
  ADD COLUMN `system` VARCHAR(100) NULL COMMENT '操作系统' AFTER `address`;

ALTER TABLE `system_logs`
  ADD COLUMN `browser` VARCHAR(100) NULL COMMENT '浏览器类型' AFTER `system`;

ALTER TABLE `system_logs`
  ADD COLUMN `status` TINYINT NOT NULL DEFAULT 1 COMMENT '操作状态：1=成功，0=失败' AFTER `response_status`;

ALTER TABLE `system_logs`
  ADD COLUMN `operating_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间' AFTER `created_at`;

-- 4. 为 system_logs 表添加索引
ALTER TABLE `system_logs`
  ADD INDEX `idx_module` (`module`);

ALTER TABLE `system_logs`
  ADD INDEX `idx_status` (`status`);

ALTER TABLE `system_logs`
  ADD INDEX `idx_operating_time` (`operating_time`);
