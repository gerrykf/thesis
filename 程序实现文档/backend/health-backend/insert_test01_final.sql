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

-- 插入饮食记录数据（使用现有food_id）
-- food_id: 12=全麦面包, 130=三文鱼, 29=包子, 24=土豆, 10=乌冬面
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, fiber, sodium, notes) VALUES
-- 最近7天
(63, 12, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'breakfast', 2, 180, 6, 2, 32, 5, 220, '全麦面包'),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, '三文鱼'),
(63, 24, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'dinner', 1, 150, 3, 0, 33, 4, 8, '土豆'),
(63, 29, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'breakfast', 2, 220, 8, 6, 35, 2, 380, '包子'),
(63, 10, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'lunch', 1, 280, 10, 5, 50, 2, 420, '乌冬面'),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'dinner', 1, 280, 30, 8, 15, 0, 380, '三文鱼'),

-- 最近30天
(63, 12, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 'breakfast', 2, 180, 6, 2, 32, 5, 220, ''),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, ''),
(63, 29, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'breakfast', 2, 220, 8, 6, 35, 2, 380, ''),
(63, 10, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 'lunch', 1, 280, 10, 5, 50, 2, 420, ''),
(63, 24, DATE_SUB(CURDATE(), INTERVAL 21 DAY), 'dinner', 1, 150, 3, 0, 33, 4, 8, ''),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 24 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, ''),
(63, 12, DATE_SUB(CURDATE(), INTERVAL 27 DAY), 'breakfast', 2, 180, 6, 2, 32, 5, 220, ''),

-- 最近90天
(63, 29, DATE_SUB(CURDATE(), INTERVAL 33 DAY), 'breakfast', 2, 220, 8, 6, 35, 2, 380, ''),
(63, 10, DATE_SUB(CURDATE(), INTERVAL 39 DAY), 'lunch', 1, 280, 10, 5, 50, 2, 420, ''),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, ''),
(63, 24, DATE_SUB(CURDATE(), INTERVAL 51 DAY), 'dinner', 1, 150, 3, 0, 33, 4, 8, ''),
(63, 12, DATE_SUB(CURDATE(), INTERVAL 57 DAY), 'breakfast', 2, 180, 6, 2, 32, 5, 220, ''),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 63 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, ''),
(63, 29, DATE_SUB(CURDATE(), INTERVAL 69 DAY), 'breakfast', 2, 220, 8, 6, 35, 2, 380, ''),
(63, 10, DATE_SUB(CURDATE(), INTERVAL 75 DAY), 'lunch', 1, 280, 10, 5, 50, 2, 420, ''),
(63, 24, DATE_SUB(CURDATE(), INTERVAL 81 DAY), 'dinner', 1, 150, 3, 0, 33, 4, 8, ''),
(63, 130, DATE_SUB(CURDATE(), INTERVAL 87 DAY), 'lunch', 1, 350, 35, 12, 20, 0, 450, '');
