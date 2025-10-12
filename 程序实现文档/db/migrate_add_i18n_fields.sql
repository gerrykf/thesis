-- ================================
-- 数据库迁移脚本 - 添加多语言支持字段
-- ================================
-- 创建日期: 2025-10-12
-- 用途: 为 foods 表添加英文字段,支持国际化
-- ================================

USE health_management;

-- 添加英文字段到 foods 表
ALTER TABLE foods
ADD COLUMN category_en VARCHAR(50) COMMENT '食物分类(英文)' AFTER category,
ADD COLUMN sub_category_en VARCHAR(50) COMMENT '子分类(英文)' AFTER sub_category,
ADD COLUMN description_en TEXT COMMENT '食物描述(英文)' AFTER description;

-- 添加索引优化查询性能
ALTER TABLE foods
ADD INDEX idx_name_en (name_en),
ADD INDEX idx_category_en (category_en);

-- 删除旧的全文索引
ALTER TABLE foods DROP INDEX ft_name_desc;

-- 创建新的全文索引(支持中英文)
ALTER TABLE foods
ADD FULLTEXT INDEX ft_name_desc (name, name_en, description, description_en);

-- 显示更新后的表结构
DESCRIBE foods;

-- 提示信息
SELECT '✅ 数据库迁移完成! 已添加以下字段:' AS status;
SELECT '  - category_en (食物分类英文)' AS info
UNION ALL SELECT '  - sub_category_en (子分类英文)'
UNION ALL SELECT '  - description_en (食物描述英文)'
UNION ALL SELECT ''
UNION ALL SELECT '📝 下一步: 需要填充英文数据';
