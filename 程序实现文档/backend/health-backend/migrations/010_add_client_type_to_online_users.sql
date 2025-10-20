-- 为在线用户表添加客户端类型字段
-- 用于区分H5前台用户和管理后台用户

ALTER TABLE `online_users`
ADD COLUMN `client_type` VARCHAR(20) NOT NULL DEFAULT 'h5' COMMENT '客户端类型: h5-前台, admin-后台' AFTER `username`;

-- 为客户端类型添加索引，方便按类型筛选
ALTER TABLE `online_users`
ADD INDEX `idx_client_type` (`client_type`);
