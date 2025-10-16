-- 为 test01 用户 (user_id = 63) 添加测试数据

-- 删除现有数据
DELETE FROM health_records WHERE user_id = 63;
DELETE FROM diet_records WHERE user_id = 63;

-- 插入健康记录数据（最近90天）
INSERT INTO health_records (user_id, record_date, weight, exercise_type, exercise_duration, sleep_hours, sleep_quality, mood, notes) VALUES
-- 最近7天
(63, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 70.5, '跑步', 30, 7.5, 'good', 'excellent', '感觉不错'),
(63, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 70.8, '游泳', 45, 8.0, 'excellent', 'excellent', '游泳后很舒服'),
(63, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 71.0, '骑行', 60, 7.0, 'good', 'fair', '有点累'),
(63, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 71.2, '跑步', 35, 7.8, 'good', 'excellent', ''),

-- 最近30天
(63, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 71.5, '健身', 50, 7.2, 'fair', 'excellent', '力量训练'),
(63, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 71.8, '跑步', 40, 7.5, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 72.0, '游泳', 55, 8.0, 'excellent', 'excellent', '感觉很好'),
(63, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 72.2, '骑行', 45, 7.0, 'good', 'fair', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 21 DAY), 72.5, '跑步', 30, 7.5, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 24 DAY), 72.8, '健身', 60, 7.8, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 27 DAY), 73.0, '跑步', 35, 7.2, 'fair', 'excellent', ''),

-- 最近90天
(63, DATE_SUB(CURDATE(), INTERVAL 33 DAY), 73.2, '游泳', 50, 8.0, 'excellent', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 36 DAY), 73.5, '骑行', 40, 7.0, 'good', 'fair', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 39 DAY), 73.8, '跑步', 45, 7.5, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 42 DAY), 74.0, '健身', 55, 7.8, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 45 DAY), 74.2, '跑步', 30, 7.2, 'fair', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 51 DAY), 74.5, '游泳', 60, 8.0, 'excellent', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 54 DAY), 74.8, '骑行', 45, 7.0, 'good', 'fair', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 57 DAY), 75.0, '跑步', 35, 7.5, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 75.2, '健身', 50, 7.8, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 66 DAY), 75.5, '跑步', 40, 7.2, 'fair', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 69 DAY), 75.8, '游泳', 55, 8.0, 'excellent', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 72 DAY), 76.0, '骑行', 45, 7.0, 'good', 'fair', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 78 DAY), 76.2, '跑步', 30, 7.5, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 81 DAY), 76.5, '健身', 60, 7.8, 'good', 'excellent', ''),
(63, DATE_SUB(CURDATE(), INTERVAL 87 DAY), 76.8, '跑步', 35, 7.2, 'fair', 'excellent', '');

-- 插入饮食记录数据
INSERT INTO diet_records (user_id, record_date, meal_type, food_name, food_category, portion_size, calories, protein, fat, carbs, fiber, sodium, notes) VALUES
-- 最近7天
(63, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '早餐', '燕麦粥', '谷物', '1碗', 150, 5, 3, 27, 4, 200, '加了蜂蜜'),
(63, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '午餐', '鸡胸肉沙拉', '肉类', '1份', 350, 35, 12, 20, 8, 450, '很健康'),
(63, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '晚餐', '清蒸鱼', '海鲜', '1条', 280, 30, 8, 15, 2, 380, '味道不错'),
(63, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '早餐', '全麦面包', '谷物', '2片', 180, 6, 2, 32, 5, 220, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '午餐', '牛肉炒饭', '主食', '1份', 480, 25, 18, 55, 3, 680, '有点油'),
(63, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '晚餐', '蔬菜汤', '蔬菜', '1碗', 120, 4, 2, 18, 6, 280, '清淡'),
(63, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '早餐', '煎蛋', '蛋类', '2个', 160, 12, 11, 2, 0, 180, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '午餐', '意大利面', '主食', '1份', 420, 15, 10, 65, 4, 520, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '晚餐', '烤鸡腿', '肉类', '1个', 320, 28, 18, 5, 1, 450, '好吃'),
(63, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '早餐', '豆浆油条', '传统', '1份', 350, 12, 15, 45, 2, 480, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '午餐', '鱼香肉丝', '中餐', '1份', 450, 22, 20, 48, 3, 720, '下饭'),
(63, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '晚餐', '水果沙拉', '水果', '1份', 180, 2, 5, 35, 6, 50, '清爽'),

-- 最近30天
(63, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '午餐', '宫保鸡丁', '中餐', '1份', 480, 30, 22, 42, 4, 850, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 12 DAY), '午餐', '红烧肉', '中餐', '1份', 520, 25, 30, 38, 2, 920, '有点油腻'),
(63, DATE_SUB(CURDATE(), INTERVAL 15 DAY), '午餐', '烤鱼', '海鲜', '1份', 420, 35, 18, 28, 3, 680, '麻辣味'),
(63, DATE_SUB(CURDATE(), INTERVAL 18 DAY), '午餐', '回锅肉', '中餐', '1份', 550, 28, 35, 40, 3, 980, '很下饭'),
(63, DATE_SUB(CURDATE(), INTERVAL 21 DAY), '午餐', '牛排', '肉类', '1份', 480, 40, 25, 15, 2, 520, '七分熟'),
(63, DATE_SUB(CURDATE(), INTERVAL 24 DAY), '午餐', '糖醋里脊', '中餐', '1份', 520, 22, 28, 48, 2, 720, '酸甜可口'),
(63, DATE_SUB(CURDATE(), INTERVAL 27 DAY), '午餐', '麻婆豆腐', '中餐', '1份', 350, 15, 18, 32, 4, 850, '麻辣'),

-- 最近90天
(63, DATE_SUB(CURDATE(), INTERVAL 33 DAY), '午餐', '炒面', '主食', '1份', 420, 12, 15, 58, 3, 680, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 39 DAY), '午餐', '烤肉', '肉类', '1份', 500, 35, 28, 25, 2, 720, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 45 DAY), '午餐', '寿司', '日料', '10个', 380, 18, 8, 62, 2, 520, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 51 DAY), '午餐', '披萨', '西餐', '2片', 480, 20, 22, 50, 3, 880, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 57 DAY), '午餐', '汉堡', '快餐', '1个', 520, 25, 28, 48, 4, 920, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 63 DAY), '午餐', '拉面', '主食', '1碗', 450, 18, 15, 62, 3, 980, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 69 DAY), '午餐', '盖浇饭', '中餐', '1份', 520, 22, 20, 65, 3, 780, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 75 DAY), '午餐', '煲仔饭', '中餐', '1份', 480, 20, 18, 58, 2, 720, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 81 DAY), '午餐', '炖肉', '肉类', '1份', 550, 30, 32, 35, 2, 850, ''),
(63, DATE_SUB(CURDATE(), INTERVAL 87 DAY), '午餐', '炒菜', '素菜', '2份', 320, 12, 15, 38, 6, 580, '');
