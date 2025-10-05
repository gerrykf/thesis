-- ================================
-- 移除 health_records 表中未使用的字段（简化版）
-- 执行日期: 2025-10-05
-- 说明: 直接移除废弃字段，如果字段不存在会报错但不影响其他操作
-- ================================

USE health_management;

-- 方式1: 一次性删除所有字段（推荐，如果所有字段都存在）
ALTER TABLE health_records
    DROP COLUMN exercise_calories,
    DROP COLUMN blood_pressure_systolic,
    DROP COLUMN blood_pressure_diastolic,
    DROP COLUMN heart_rate,
    DROP COLUMN body_temperature;

-- 验证表结构
DESCRIBE health_records;
