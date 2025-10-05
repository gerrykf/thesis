-- ================================
-- 健康管理系统测试数据脚本
-- ================================
-- 创建日期: 2025-10-04
-- 说明: 为每张表插入10条测试数据
-- ================================

-- 使用数据库
USE health_management;

-- ================================
-- 清理已存在的测试数据
-- ================================
-- 按照外键依赖顺序删除(从子表到父表)
DELETE FROM system_logs WHERE user_id IN (SELECT id FROM users WHERE username IN (
    'zhang_wei', 'li_na', 'wang_fang', 'liu_qiang', 'chen_jing',
    'zhao_ming', 'sun_li', 'zhou_lei', 'wu_xia', 'zheng_hao'
));

DELETE FROM user_goals WHERE user_id IN (SELECT id FROM users WHERE username IN (
    'zhang_wei', 'li_na', 'wang_fang', 'liu_qiang', 'chen_jing',
    'zhao_ming', 'sun_li', 'zhou_lei', 'wu_xia', 'zheng_hao'
));

DELETE FROM diet_records WHERE user_id IN (SELECT id FROM users WHERE username IN (
    'zhang_wei', 'li_na', 'wang_fang', 'liu_qiang', 'chen_jing',
    'zhao_ming', 'sun_li', 'zhou_lei', 'wu_xia', 'zheng_hao'
));

DELETE FROM health_records WHERE user_id IN (SELECT id FROM users WHERE username IN (
    'zhang_wei', 'li_na', 'wang_fang', 'liu_qiang', 'chen_jing',
    'zhao_ming', 'sun_li', 'zhou_lei', 'wu_xia', 'zheng_hao'
));

-- 删除测试食物数据
DELETE FROM foods WHERE name IN (
    '白米饭', '全麦面包', '鸡胸肉', '苹果', '香蕉',
    '西兰花', '鸡蛋', '纯牛奶', '豆腐', '核桃'
);

-- 删除测试食物分类数据
DELETE FROM food_categories WHERE name IN (
    '米饭类', '面条类', '面包类', '叶菜类', '根茎类',
    '瓜果类', '热带水果', '温带水果', '家禽肉', '畜肉类'
);

-- 删除测试用户
DELETE FROM users WHERE username IN (
    'zhang_wei', 'li_na', 'wang_fang', 'liu_qiang', 'chen_jing',
    'zhao_ming', 'sun_li', 'zhou_lei', 'wu_xia', 'zheng_hao'
);

-- ================================
-- 1. 插入用户测试数据 (10条)
-- ================================
-- 注意: 密码统一为 123456 (bcrypt加密后)
INSERT INTO users (
    username, password, nickname, phone, email, gender, birth_date,
    height, target_weight, avatar, role, is_active, last_login_at
) VALUES
('zhang_wei', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '张伟', '13800000001', 'zhangwei@example.com', 'male', '1990-05-15',
 175.00, 70.00, '/avatars/user1.jpg', 'user', TRUE, '2024-01-15 08:30:00'),

('li_na', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '李娜', '13800000002', 'lina@example.com', 'female', '1995-08-20',
 165.00, 55.00, '/avatars/user2.jpg', 'user', TRUE, '2024-01-15 09:00:00'),

('wang_fang', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '王芳', '13800000003', 'wangfang@example.com', 'female', '1992-03-10',
 160.00, 50.00, '/avatars/user3.jpg', 'user', TRUE, '2024-01-14 18:20:00'),

('liu_qiang', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '刘强', '13800000004', 'liuqiang@example.com', 'male', '1988-11-25',
 180.00, 75.00, '/avatars/user4.jpg', 'user', TRUE, '2024-01-15 07:45:00'),

('chen_jing', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '陈静', '13800000005', 'chenjing@example.com', 'female', '1993-07-18',
 168.00, 58.00, '/avatars/user5.jpg', 'user', TRUE, '2024-01-15 10:15:00'),

('zhao_ming', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '赵明', '13800000006', 'zhaoming@example.com', 'male', '1991-12-05',
 178.00, 72.00, '/avatars/user6.jpg', 'user', TRUE, '2024-01-14 20:30:00'),

('sun_li', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '孙丽', '13800000007', 'sunli@example.com', 'female', '1994-04-22',
 162.00, 52.00, '/avatars/user7.jpg', 'user', TRUE, '2024-01-15 11:00:00'),

('zhou_lei', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '周磊', '13800000008', 'zhoulei@example.com', 'male', '1989-09-14',
 182.00, 78.00, '/avatars/user8.jpg', 'user', TRUE, '2024-01-15 06:50:00'),

('wu_xia', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '吴霞', '13800000009', 'wuxia@example.com', 'female', '1996-06-30',
 158.00, 48.00, '/avatars/user9.jpg', 'user', TRUE, '2024-01-14 22:10:00'),

('zheng_hao', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '郑浩', '13800000010', 'zhenghao@example.com', 'male', '1987-02-28',
 176.00, 73.00, '/avatars/user10.jpg', 'user', TRUE, '2024-01-15 12:30:00');

-- ================================
-- 2. 插入食物二级分类数据 (10条)
-- ================================
INSERT INTO food_categories (name, name_en, parent_id, level, sort_order, description, is_active) VALUES
('米饭类', 'Rice', 1, 2, 1, '各种米饭类主食', TRUE),
('面条类', 'Noodles', 1, 2, 2, '各种面条类主食', TRUE),
('面包类', 'Bread', 1, 2, 3, '各种面包类主食', TRUE),
('叶菜类', 'Leafy Vegetables', 2, 2, 1, '叶菜类蔬菜', TRUE),
('根茎类', 'Root Vegetables', 2, 2, 2, '根茎类蔬菜', TRUE),
('瓜果类', 'Gourds', 2, 2, 3, '瓜果类蔬菜', TRUE),
('热带水果', 'Tropical Fruits', 3, 2, 1, '热带水果类', TRUE),
('温带水果', 'Temperate Fruits', 3, 2, 2, '温带水果类', TRUE),
('家禽肉', 'Poultry', 4, 2, 1, '家禽类肉制品', TRUE),
('畜肉类', 'Livestock Meat', 4, 2, 2, '畜类肉制品', TRUE);

-- ================================
-- 3. 插入食物数据 (10条)
-- ================================
INSERT INTO foods (
    name, name_en, category, sub_category, brand,
    calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g,
    fiber_per_100g, sodium_per_100g, sugar_per_100g, cholesterol_per_100g,
    vitamin_c_per_100g, calcium_per_100g, iron_per_100g,
    image_url, description, serving_size, is_active, is_verified, created_by
) VALUES
('白米饭', 'White Rice', '主食', '米饭类', NULL,
 116.00, 2.60, 0.30, 25.90, 0.30, 5.00, 0.12, 0.00, 0.00, 10.00, 0.50,
 '/foods/rice.jpg', '最常见的主食，提供丰富的碳水化合物', 150.00, TRUE, TRUE, 1),

('全麦面包', 'Whole Wheat Bread', '主食', '面包类', NULL,
 247.00, 12.70, 4.20, 41.30, 6.80, 450.00, 5.00, 0.00, 0.00, 120.00, 2.50,
 '/foods/bread.jpg', '全麦面包，富含膳食纤维', 50.00, TRUE, TRUE, 1),

('鸡胸肉', 'Chicken Breast', '肉类', '家禽肉', NULL,
 165.00, 31.02, 3.57, 0.00, 0.00, 74.00, 0.00, 85.00, 0.00, 11.00, 0.90,
 '/foods/chicken.jpg', '高蛋白低脂肪的优质肉类', 100.00, TRUE, TRUE, 1),

('苹果', 'Apple', '水果', '温带水果', NULL,
 52.00, 0.26, 0.17, 13.81, 2.40, 1.00, 10.39, 0.00, 4.60, 6.00, 0.12,
 '/foods/apple.jpg', '甜脆可口的苹果，富含维生素C和纤维', 200.00, TRUE, TRUE, 1),

('香蕉', 'Banana', '水果', '热带水果', NULL,
 89.00, 1.09, 0.33, 22.84, 2.60, 1.00, 12.23, 0.00, 8.70, 5.00, 0.26,
 '/foods/banana.jpg', '富含钾元素的热带水果', 120.00, TRUE, TRUE, 1),

('西兰花', 'Broccoli', '蔬菜', '瓜果类', NULL,
 34.00, 2.82, 0.37, 6.64, 2.60, 33.00, 1.70, 0.00, 89.20, 47.00, 0.73,
 '/foods/broccoli.jpg', '营养丰富的十字花科蔬菜', 80.00, TRUE, TRUE, 1),

('鸡蛋', 'Egg', '蛋类', NULL, NULL,
 147.00, 13.30, 8.80, 2.80, 0.00, 142.00, 0.56, 585.00, 0.00, 56.00, 1.75,
 '/foods/egg.jpg', '优质蛋白质来源', 50.00, TRUE, TRUE, 1),

('纯牛奶', 'Milk', '奶制品', NULL, NULL,
 54.00, 3.00, 3.20, 3.40, 0.00, 44.00, 5.05, 10.00, 0.00, 104.00, 0.03,
 '/foods/milk.jpg', '富含钙质的乳制品', 250.00, TRUE, TRUE, 1),

('豆腐', 'Tofu', '豆制品', NULL, NULL,
 81.00, 8.08, 3.69, 4.27, 0.30, 7.00, 0.62, 0.00, 0.10, 350.00, 5.36,
 '/foods/tofu.jpg', '植物蛋白的优质来源', 100.00, TRUE, TRUE, 1),

('核桃', 'Walnut', '坚果', NULL, NULL,
 654.00, 15.23, 65.21, 13.71, 6.70, 2.00, 2.61, 0.00, 1.30, 98.00, 2.91,
 '/foods/walnut.jpg', '富含不饱和脂肪酸的坚果', 30.00, TRUE, TRUE, 1);

-- ================================
-- 4. 插入健康记录数据 (10条)
-- ================================
-- 获取实际的用户ID并插入数据
INSERT INTO health_records (
    user_id, record_date, weight, exercise_duration, exercise_type,
    sleep_hours, sleep_quality, mood, notes
)
SELECT u.id, '2024-01-15', 57.50, 45, '慢跑', 7.50, 'good', 'good',
 '今天跑步感觉不错，体重有所下降'
FROM users u WHERE u.username = 'li_na'
UNION ALL
SELECT u.id, '2024-01-15', 58.20, 30, '瑜伽', 8.00, 'excellent', 'excellent',
 '瑜伽练习后身心放松'
FROM users u WHERE u.username = 'wang_fang'
UNION ALL
SELECT u.id, '2024-01-15', 78.50, 60, '游泳', 7.00, 'good', 'good',
 '游泳一小时，很有成就感'
FROM users u WHERE u.username = 'liu_qiang'
UNION ALL
SELECT u.id, '2024-01-14', 62.30, 40, '骑行', 6.50, 'fair', 'good',
 '骑行锻炼，天气不错'
FROM users u WHERE u.username = 'chen_jing'
UNION ALL
SELECT u.id, '2024-01-14', 75.80, 50, '篮球', 7.50, 'good', 'excellent',
 '打篮球出了一身汗'
FROM users u WHERE u.username = 'zhao_ming'
UNION ALL
SELECT u.id, '2024-01-14', 53.20, 35, '健身操', 8.00, 'excellent', 'good',
 '跟着视频做健身操'
FROM users u WHERE u.username = 'sun_li'
UNION ALL
SELECT u.id, '2024-01-13', 80.10, 55, '跑步', 6.00, 'fair', 'fair',
 '跑步后有点累'
FROM users u WHERE u.username = 'zhou_lei'
UNION ALL
SELECT u.id, '2024-01-13', 49.50, 25, '散步', 7.00, 'good', 'good',
 '晚饭后散步半小时'
FROM users u WHERE u.username = 'wu_xia'
UNION ALL
SELECT u.id, '2024-01-13', 76.20, 45, '爬山', 7.50, 'good', 'excellent',
 '周末爬山，空气清新'
FROM users u WHERE u.username = 'zheng_hao'
UNION ALL
SELECT u.id, '2024-01-12', 73.50, 40, '羽毛球', 8.00, 'excellent', 'excellent',
 '打羽毛球很开心'
FROM users u WHERE u.username = 'zhang_wei';

-- ================================
-- 5. 插入饮食记录数据 (10条)
-- ================================
-- 使用JOIN方式获取用户ID和食物ID,确保数据正确插入
INSERT INTO diet_records (
    user_id, food_id, record_date, meal_type, meal_time, quantity,
    calories, protein, fat, carbs, fiber, sodium, notes
)
SELECT
    u.id, f.id, '2024-01-15', 'lunch', '12:00:00', 200.00,
    232.00, 5.20, 0.60, 51.80, 0.60, 10.00, '午餐主食'
FROM users u, foods f
WHERE u.username = 'li_na' AND f.name = '白米饭'
UNION ALL
SELECT
    u.id, f.id, '2024-01-15', 'breakfast', '08:00:00', 150.00,
    78.00, 0.39, 0.26, 20.72, 3.60, 1.50, '早餐水果'
FROM users u, foods f
WHERE u.username = 'li_na' AND f.name = '苹果'
UNION ALL
SELECT
    u.id, f.id, '2024-01-15', 'dinner', '18:30:00', 120.00,
    198.00, 37.22, 4.28, 0.00, 0.00, 88.80, '晚餐蛋白质'
FROM users u, foods f
WHERE u.username = 'wang_fang' AND f.name = '鸡胸肉'
UNION ALL
SELECT
    u.id, f.id, '2024-01-15', 'breakfast', '07:30:00', 100.00,
    147.00, 13.30, 8.80, 2.80, 0.00, 142.00, '早餐鸡蛋2个'
FROM users u, foods f
WHERE u.username = 'liu_qiang' AND f.name = '鸡蛋'
UNION ALL
SELECT
    u.id, f.id, '2024-01-14', 'breakfast', '08:00:00', 250.00,
    135.00, 7.50, 8.00, 8.50, 0.00, 110.00, '早餐牛奶一杯'
FROM users u, foods f
WHERE u.username = 'chen_jing' AND f.name = '纯牛奶'
UNION ALL
SELECT
    u.id, f.id, '2024-01-14', 'snack', '15:30:00', 120.00,
    106.80, 1.31, 0.40, 27.41, 3.12, 1.20, '下午加餐香蕉'
FROM users u, foods f
WHERE u.username = 'zhao_ming' AND f.name = '香蕉'
UNION ALL
SELECT
    u.id, f.id, '2024-01-14', 'breakfast', '07:00:00', 50.00,
    123.50, 6.35, 2.10, 20.65, 3.40, 225.00, '全麦面包早餐'
FROM users u, foods f
WHERE u.username = 'sun_li' AND f.name = '全麦面包'
UNION ALL
SELECT
    u.id, f.id, '2024-01-13', 'dinner', '19:00:00', 150.00,
    121.50, 12.12, 5.54, 6.41, 0.45, 10.50, '晚餐豆腐'
FROM users u, foods f
WHERE u.username = 'zhou_lei' AND f.name = '豆腐'
UNION ALL
SELECT
    u.id, f.id, '2024-01-13', 'lunch', '12:30:00', 100.00,
    34.00, 2.82, 0.37, 6.64, 2.60, 33.00, '午餐蔬菜西兰花'
FROM users u, foods f
WHERE u.username = 'wu_xia' AND f.name = '西兰花'
UNION ALL
SELECT
    u.id, f.id, '2024-01-13', 'snack', '10:00:00', 30.00,
    196.20, 4.57, 19.56, 4.11, 2.01, 0.60, '上午加餐坚果'
FROM users u, foods f
WHERE u.username = 'zheng_hao' AND f.name = '核桃';

-- ================================
-- 6. 插入用户目标数据 (10条)
-- ================================
INSERT INTO user_goals (
    user_id, goal_type, goal_name, target_value, current_value, unit,
    start_date, target_date, status, description
)
SELECT u.id, 'weight', '减重目标', 55.00, 57.50, 'kg',
 '2024-01-01', '2024-03-01', 'active', '希望在3个月内减重到55公斤'
FROM users u WHERE u.username = 'li_na'
UNION ALL
SELECT u.id, 'weight', '控制体重', 56.00, 58.20, 'kg',
 '2024-01-01', '2024-06-01', 'active', '保持健康体重在56公斤'
FROM users u WHERE u.username = 'wang_fang'
UNION ALL
SELECT u.id, 'exercise', '每周运动目标', 300.00, 180.00, '分钟',
 '2024-01-01', '2024-12-31', 'active', '每周运动300分钟，保持健康'
FROM users u WHERE u.username = 'liu_qiang'
UNION ALL
SELECT u.id, 'calories', '每日热量控制', 1500.00, 1650.00, 'kcal',
 '2024-01-01', '2024-06-01', 'active', '控制每日热量摄入在1500卡以内'
FROM users u WHERE u.username = 'chen_jing'
UNION ALL
SELECT u.id, 'weight', '减脂目标', 72.00, 75.80, 'kg',
 '2024-01-01', '2024-04-01', 'active', '3个月减重到72公斤'
FROM users u WHERE u.username = 'zhao_ming'
UNION ALL
SELECT u.id, 'exercise', '跑步目标', 50.00, 35.00, '公里',
 '2024-01-01', '2024-01-31', 'active', '本月跑步50公里'
FROM users u WHERE u.username = 'sun_li'
UNION ALL
SELECT u.id, 'weight', '增肌目标', 82.00, 80.10, 'kg',
 '2024-01-01', '2024-06-01', 'active', '通过健身增肌到82公斤'
FROM users u WHERE u.username = 'zhou_lei'
UNION ALL
SELECT u.id, 'calories', '热量摄入', 1800.00, 1600.00, 'kcal',
 '2024-01-01', '2024-12-31', 'active', '保持每日1800卡热量摄入'
FROM users u WHERE u.username = 'wu_xia'
UNION ALL
SELECT u.id, 'exercise', '每周健身', 240.00, 180.00, '分钟',
 '2024-01-01', '2024-12-31', 'active', '每周健身4小时'
FROM users u WHERE u.username = 'zheng_hao'
UNION ALL
SELECT u.id, 'weight', '维持体重', 73.00, 73.50, 'kg',
 '2024-01-01', '2024-12-31', 'active', '保持健康体重73公斤'
FROM users u WHERE u.username = 'zhang_wei';

-- ================================
-- 7. 插入系统日志数据 (10条)
-- ================================
INSERT INTO system_logs (
    user_id, action, resource, resource_id, method, url, ip_address,
    user_agent, response_status, response_time, created_at
)
SELECT u.id, 'user_login', 'auth', u.id, 'POST', '/api/auth/login', '192.168.1.100',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 200, 150, '2024-01-15 08:00:00'
FROM users u WHERE u.username = 'li_na'
UNION ALL
SELECT u.id, 'create_health_record', 'health_records', 1, 'POST', '/api/health', '192.168.1.101',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 201, 200, '2024-01-15 08:05:00'
FROM users u WHERE u.username = 'wang_fang'
UNION ALL
SELECT u.id, 'get_foods', 'foods', NULL, 'GET', '/api/foods?category=主食', '192.168.1.102',
 'Mozilla/5.0 (Android 12; Mobile; rv:97.0) Gecko/97.0 Firefox/97.0', 200, 80, '2024-01-15 08:10:00'
FROM users u WHERE u.username = 'liu_qiang'
UNION ALL
SELECT u.id, 'create_diet_record', 'diet_records', 1, 'POST', '/api/diet', '192.168.1.103',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 201, 180, '2024-01-15 08:15:00'
FROM users u WHERE u.username = 'chen_jing'
UNION ALL
SELECT u.id, 'update_user_profile', 'users', u.id, 'PUT', '/api/users/profile', '192.168.1.104',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 200, 120, '2024-01-15 08:20:00'
FROM users u WHERE u.username = 'zhao_ming'
UNION ALL
SELECT u.id, 'get_health_records', 'health_records', NULL, 'GET', '/api/health?date=2024-01-14', '192.168.1.105',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 200, 90, '2024-01-15 08:25:00'
FROM users u WHERE u.username = 'sun_li'
UNION ALL
SELECT u.id, 'create_goal', 'user_goals', 8, 'POST', '/api/goals', '192.168.1.106',
 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36', 201, 160, '2024-01-15 08:30:00'
FROM users u WHERE u.username = 'zhou_lei'
UNION ALL
SELECT u.id, 'delete_diet_record', 'diet_records', 5, 'DELETE', '/api/diet/5', '192.168.1.107',
 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 200, 100, '2024-01-15 08:35:00'
FROM users u WHERE u.username = 'wu_xia'
UNION ALL
SELECT u.id, 'get_statistics', 'statistics', NULL, 'GET', '/api/statistics/weekly', '192.168.1.108',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0', 200, 220, '2024-01-15 08:40:00'
FROM users u WHERE u.username = 'zheng_hao'
UNION ALL
SELECT u.id, 'update_goal', 'user_goals', 10, 'PUT', '/api/goals/10', '192.168.1.109',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 200, 140, '2024-01-15 08:45:00'
FROM users u WHERE u.username = 'zhang_wei';

-- ================================
-- 数据验证查询
-- ================================
SELECT '用户表' as 表名, COUNT(*) as 数据条数 FROM users WHERE username LIKE '%__%'
UNION ALL
SELECT '食物分类表', COUNT(*) FROM food_categories WHERE parent_id IS NOT NULL
UNION ALL
SELECT '食物表', COUNT(*) FROM foods WHERE name != '白米饭' OR name = '白米饭'
UNION ALL
SELECT '健康记录表', COUNT(*) FROM health_records
UNION ALL
SELECT '饮食记录表', COUNT(*) FROM diet_records
UNION ALL
SELECT '用户目标表', COUNT(*) FROM user_goals
UNION ALL
SELECT '系统日志表', COUNT(*) FROM system_logs WHERE user_id IS NOT NULL;

-- ================================
-- 测试数据插入完成
-- ================================
