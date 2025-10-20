-- 创建Token黑名单表
-- 用于强制用户下线功能
-- 当管理员强制某用户下线时，将其token加入此黑名单

CREATE TABLE IF NOT EXISTS `token_blacklist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  `token` VARCHAR(500) NOT NULL COMMENT '被拉黑的JWT Token',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `reason` VARCHAR(200) DEFAULT '强制下线' COMMENT '拉黑原因',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'Token过期时间',
  INDEX `idx_token` (`token`(255)) COMMENT 'Token索引（用于快速查询）',
  INDEX `idx_user_id` (`user_id`) COMMENT '用户ID索引',
  INDEX `idx_expires_at` (`expires_at`) COMMENT '过期时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Token黑名单表';

-- 添加token字段到online_users表（如果不存在）
ALTER TABLE `online_users`
ADD COLUMN IF NOT EXISTS `token` VARCHAR(500) NOT NULL COMMENT 'JWT Token' AFTER `username`,
ADD UNIQUE INDEX IF NOT EXISTS `idx_token` (`token`(255));
