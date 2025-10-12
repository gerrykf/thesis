-- ================================
-- 健康管理系统数据库初始化脚本
-- ================================
-- 创建日期: 2025-10-04
-- 数据库版本: MySQL 8.0+
-- 字符集: utf8mb4
-- ================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS health_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE health_management;

-- ================================
-- 0. 删除已存在的表（如果存在）
-- ================================
-- 禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 删除表（按依赖关系倒序删除）
DROP TABLE IF EXISTS system_logs;
DROP TABLE IF EXISTS user_goals;
DROP TABLE IF EXISTS diet_records;
DROP TABLE IF EXISTS health_records;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS food_categories;
DROP TABLE IF EXISTS users;

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ================================
-- 1. 创建用户表 (users)
-- ================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(bcrypt加密)',
    nickname VARCHAR(50) COMMENT '昵称',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    gender ENUM('male', 'female') COMMENT '性别',
    birth_date DATE COMMENT '出生日期',
    height DECIMAL(5,2) COMMENT '身高(cm)',
    target_weight DECIMAL(5,2) COMMENT '目标体重(kg)',
    avatar VARCHAR(255) COMMENT '头像URL',
    role ENUM('user', 'admin') DEFAULT 'user' COMMENT '用户角色',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) COMMENT '用户表';

-- ================================
-- 2. 创建食物分类表 (food_categories)
-- ================================
CREATE TABLE IF NOT EXISTS food_categories (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    name_en VARCHAR(50) COMMENT '英文名称',
    parent_id INT COMMENT '父分类ID',
    level TINYINT DEFAULT 1 COMMENT '分类层级',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    icon VARCHAR(100) COMMENT '分类图标',
    color VARCHAR(20) COMMENT '分类颜色',
    description TEXT COMMENT '分类描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_parent_id (parent_id),
    INDEX idx_level (level),
    INDEX idx_sort_order (sort_order)
) COMMENT '食物分类表';

-- 添加自引用外键约束（在表创建后）
ALTER TABLE food_categories 
ADD CONSTRAINT fk_food_categories_parent 
FOREIGN KEY (parent_id) REFERENCES food_categories(id) ON DELETE SET NULL;

-- ================================
-- 3. 创建食物表 (foods)
-- ================================
CREATE TABLE IF NOT EXISTS foods (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '食物ID',

    -- 基本信息 (支持中英文)
    name VARCHAR(100) NOT NULL COMMENT '食物名称(中文)',
    name_en VARCHAR(100) COMMENT '食物名称(英文)',
    category VARCHAR(50) NOT NULL COMMENT '食物分类(中文)',
    category_en VARCHAR(50) COMMENT '食物分类(英文)',
    sub_category VARCHAR(50) COMMENT '子分类(中文)',
    sub_category_en VARCHAR(50) COMMENT '子分类(英文)',
    brand VARCHAR(100) COMMENT '品牌',

    -- 营养成分 (每100g)
    calories_per_100g DECIMAL(8,2) NOT NULL COMMENT '每100g热量(kcal)',
    protein_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g蛋白质(g)',
    fat_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g脂肪(g)',
    carbs_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g碳水化合物(g)',
    fiber_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g纤维(g)',
    sodium_per_100g DECIMAL(8,2) DEFAULT 0 COMMENT '每100g钠(mg)',
    sugar_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g糖(g)',
    cholesterol_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g胆固醇(mg)',
    vitamin_c_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g维生素C(mg)',
    calcium_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g钙(mg)',
    iron_per_100g DECIMAL(6,2) DEFAULT 0 COMMENT '每100g铁(mg)',

    -- 其他信息
    image_url VARCHAR(255) COMMENT '食物图片URL',
    barcode VARCHAR(50) COMMENT '条形码',
    description TEXT COMMENT '食物描述(中文)',
    description_en TEXT COMMENT '食物描述(英文)',
    serving_size DECIMAL(6,2) COMMENT '建议食用量(g)',

    -- 状态信息
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    is_verified BOOLEAN DEFAULT FALSE COMMENT '是否已验证',
    created_by INT COMMENT '创建者ID',
    verified_by INT COMMENT '验证者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 索引
    INDEX idx_name (name),
    INDEX idx_name_en (name_en),
    INDEX idx_category (category),
    INDEX idx_category_en (category_en),
    INDEX idx_barcode (barcode),
    INDEX idx_calories (calories_per_100g),
    INDEX idx_created_by (created_by),
    INDEX idx_is_active (is_active),

    -- 外键
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

    -- 全文索引(支持中英文搜索)
    FULLTEXT INDEX ft_name_desc (name, name_en, description, description_en)
) COMMENT '食物表(支持中英文)';

-- ================================
-- 4. 创建健康记录表 (health_records)
-- ================================
CREATE TABLE IF NOT EXISTS health_records (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    record_date DATE NOT NULL COMMENT '记录日期',
    weight DECIMAL(5,2) COMMENT '体重(kg)',
    exercise_duration INT COMMENT '运动时长(分钟)',
    exercise_type VARCHAR(200) COMMENT '运动类型',
    sleep_hours DECIMAL(4,2) COMMENT '睡眠时长(小时)',
    sleep_quality ENUM('excellent', 'good', 'fair', 'poor') COMMENT '睡眠质量',
    mood ENUM('excellent', 'good', 'fair', 'poor') COMMENT '心情状态',
    notes TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, record_date),

    INDEX idx_user_date (user_id, record_date),
    INDEX idx_record_date (record_date),
    INDEX idx_weight (weight),
    INDEX idx_created_at (created_at)
) COMMENT '健康记录表';

-- ================================
-- 5. 创建饮食记录表 (diet_records)
-- ================================
CREATE TABLE IF NOT EXISTS diet_records (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    food_id INT NOT NULL COMMENT '食物ID',
    record_date DATE NOT NULL COMMENT '记录日期',
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL COMMENT '餐次类型',
    meal_time TIME COMMENT '用餐时间',
    quantity DECIMAL(8,2) NOT NULL COMMENT '食用量(g)',

    -- 营养成分 (实际摄入)
    calories DECIMAL(8,2) NOT NULL COMMENT '热量(kcal)',
    protein DECIMAL(6,2) DEFAULT 0 COMMENT '蛋白质(g)',
    fat DECIMAL(6,2) DEFAULT 0 COMMENT '脂肪(g)',
    carbs DECIMAL(6,2) DEFAULT 0 COMMENT '碳水化合物(g)',
    fiber DECIMAL(6,2) DEFAULT 0 COMMENT '纤维(g)',
    sodium DECIMAL(8,2) DEFAULT 0 COMMENT '钠(mg)',

    notes VARCHAR(255) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE RESTRICT,

    INDEX idx_user_date (user_id, record_date),
    INDEX idx_meal_type (meal_type),
    INDEX idx_food_id (food_id),
    INDEX idx_record_date (record_date),
    INDEX idx_calories (calories)
) COMMENT '饮食记录表';

-- ================================
-- 6. 创建用户目标表 (user_goals)
-- ================================
CREATE TABLE IF NOT EXISTS user_goals (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '目标ID',
    user_id INT NOT NULL COMMENT '用户ID',
    goal_type ENUM('weight', 'exercise', 'calories', 'custom') NOT NULL COMMENT '目标类型',
    goal_name VARCHAR(100) NOT NULL COMMENT '目标名称',
    target_value DECIMAL(10,2) NOT NULL COMMENT '目标值',
    current_value DECIMAL(10,2) DEFAULT 0 COMMENT '当前值',
    unit VARCHAR(20) COMMENT '单位',
    start_date DATE NOT NULL COMMENT '开始日期',
    target_date DATE COMMENT '目标日期',
    status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active' COMMENT '状态',
    description TEXT COMMENT '目标描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_goal_type (goal_type),
    INDEX idx_status (status),
    INDEX idx_target_date (target_date)
) COMMENT '用户目标表';

-- ================================
-- 7. 创建系统日志表 (system_logs)
-- ================================
CREATE TABLE IF NOT EXISTS system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id INT COMMENT '用户ID',
    action VARCHAR(100) NOT NULL COMMENT '操作类型',
    resource VARCHAR(100) COMMENT '操作资源',
    resource_id INT COMMENT '资源ID',
    method VARCHAR(10) COMMENT 'HTTP方法',
    url VARCHAR(500) COMMENT '请求URL',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    request_data JSON COMMENT '请求数据',
    response_status INT COMMENT '响应状态码',
    response_time INT COMMENT '响应时间(ms)',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at),
    INDEX idx_response_status (response_status),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) COMMENT '系统日志表';