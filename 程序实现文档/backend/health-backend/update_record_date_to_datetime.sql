-- 修改健康记录表的 record_date 字段为 DATETIME 类型
ALTER TABLE health_records
MODIFY COLUMN record_date DATETIME NOT NULL COMMENT '记录日期时间';

-- 修改饮食记录表的 record_date 字段为 DATETIME 类型
ALTER TABLE diet_records
MODIFY COLUMN record_date DATETIME NOT NULL COMMENT '记录日期时间';

-- 查看修改结果
DESCRIBE health_records;
DESCRIBE diet_records;
