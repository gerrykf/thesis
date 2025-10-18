-- 为 test01 用户（user_id=63）添加近30天的饮食记录
-- 如果某天已有记录则跳过

-- 2025-09-18
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-18', 'breakfast', 150, 174.00, 3.90, 0.45, 38.85, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-18', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-18', 'lunch', 200, 232.00, 5.20, 0.60, 51.80, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-18', 'lunch', 150, 195.00, 28.50, 7.50, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-18', 'dinner', 150, 174.00, 3.90, 0.45, 38.85, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-18', 'dinner', 120, 124.80, 29.04, 1.44, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-18' AND meal_type = 'dinner' AND food_id = 27);

-- 2025-09-19
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-09-19', 'breakfast', 80, 197.60, 7.36, 2.72, 33.04, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-19', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-09-19', 'lunch', 200, 248.00, 10.00, 1.60, 50.60, '午餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19' AND meal_type = 'lunch' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-19', 'lunch', 150, 148.50, 27.00, 3.45, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-19', 'dinner', 180, 199.80, 4.68, 1.62, 42.30, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-19', 'dinner', 130, 169.00, 24.70, 6.50, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-19' AND meal_type = 'dinner' AND food_id = 26);

-- 2025-09-20
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-09-20', 'breakfast', 60, 220.20, 7.92, 3.90, 39.78, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-20', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-20', 'lunch', 200, 232.00, 5.20, 0.60, 51.80, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-20', 'lunch', 150, 156.00, 36.30, 1.80, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-09-20', 'dinner', 180, 178.20, 8.10, 0.90, 38.52, '晚餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'dinner' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-20', 'dinner', 120, 118.80, 21.60, 2.76, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'dinner' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-09-20', 'snack', 150, 52.50, 1.35, 0.45, 11.25, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-20' AND meal_type = 'snack' AND food_id = 37);

-- 继续添加剩余的日期...
-- 2025-09-21
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-21', 'breakfast', 150, 174.00, 3.90, 0.45, 38.85, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-21', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 9, '2025-09-21', 'lunch', 180, 235.80, 9.00, 0.90, 45.00, '午餐-意大利面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21' AND meal_type = 'lunch' AND food_id = 9);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-21', 'lunch', 140, 182.00, 26.60, 7.00, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-21', 'dinner', 170, 188.70, 4.42, 1.53, 39.95, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-21', 'dinner', 130, 135.20, 31.46, 1.56, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-21' AND meal_type = 'dinner' AND food_id = 27);

-- 2025-09-22
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-09-22', 'breakfast', 75, 185.25, 6.90, 2.55, 30.98, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-22', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-22', 'lunch', 190, 220.40, 4.94, 0.57, 49.21, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-22', 'lunch', 160, 158.40, 28.80, 3.68, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-09-22', 'dinner', 180, 223.20, 9.00, 1.44, 45.54, '晚餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'dinner' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-22', 'dinner', 125, 162.50, 23.75, 6.25, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'dinner' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-09-22', 'snack', 120, 55.20, 0.48, 0.24, 13.08, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-22' AND meal_type = 'snack' AND food_id = 38);

-- 2025-09-23 到 2025-09-30 (继续类似的模式)
-- 2025-09-23
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-09-23', 'breakfast', 65, 238.55, 8.58, 4.23, 43.10, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-23');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-23', 'lunch', 180, 208.80, 4.68, 0.54, 46.62, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-23' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-23', 'lunch', 140, 145.60, 33.88, 1.68, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-23' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-23', 'dinner', 165, 183.15, 4.29, 1.49, 38.78, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-23' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-23', 'dinner', 110, 108.90, 19.80, 2.53, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-23' AND meal_type = 'dinner' AND food_id = 28);

-- 2025-09-24
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-24', 'breakfast', 145, 168.20, 3.77, 0.44, 37.56, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-24', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-09-24', 'lunch', 190, 188.10, 8.55, 0.95, 40.66, '午餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'lunch' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-24', 'lunch', 145, 188.50, 27.55, 7.25, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-24', 'dinner', 155, 179.80, 4.03, 0.47, 40.15, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-24', 'dinner', 135, 140.40, 32.67, 1.62, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'dinner' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-09-24', 'snack', 130, 45.50, 1.17, 0.39, 9.75, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-24' AND meal_type = 'snack' AND food_id = 37);

-- 2025-09-25
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-09-25', 'breakfast', 70, 172.90, 6.44, 2.38, 28.91, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-25', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-25', 'lunch', 195, 216.45, 5.07, 1.76, 45.83, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-25', 'lunch', 155, 153.45, 27.90, 3.56, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-09-25', 'dinner', 175, 217.00, 8.75, 1.40, 44.28, '晚餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25' AND meal_type = 'dinner' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-25', 'dinner', 120, 156.00, 22.80, 6.00, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-25' AND meal_type = 'dinner' AND food_id = 26);

-- 2025-09-26
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-09-26', 'breakfast', 70, 256.90, 9.24, 4.55, 46.41, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-26', 'lunch', 185, 214.60, 4.81, 0.56, 47.92, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-26', 'lunch', 145, 150.80, 35.09, 1.74, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-26', 'dinner', 160, 177.60, 4.16, 1.44, 37.60, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-26', 'dinner', 115, 113.85, 20.70, 2.65, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26' AND meal_type = 'dinner' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-09-26', 'snack', 110, 50.60, 0.44, 0.22, 11.99, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-26' AND meal_type = 'snack' AND food_id = 38);

-- 2025-09-27
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-27', 'breakfast', 160, 185.60, 4.16, 0.48, 41.44, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-27', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 9, '2025-09-27', 'lunch', 185, 242.35, 9.25, 0.93, 46.25, '午餐-意大利面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27' AND meal_type = 'lunch' AND food_id = 9);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-27', 'lunch', 150, 195.00, 28.50, 7.50, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-27', 'dinner', 175, 194.25, 4.55, 1.58, 41.13, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-27', 'dinner', 125, 130.00, 30.25, 1.50, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-27' AND meal_type = 'dinner' AND food_id = 27);

-- 2025-09-28
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-09-28', 'breakfast', 85, 209.95, 7.82, 2.89, 35.11, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-28', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-28', 'lunch', 175, 203.00, 4.55, 0.53, 45.33, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-28', 'lunch', 150, 148.50, 27.00, 3.45, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-09-28', 'dinner', 170, 168.30, 7.65, 0.85, 36.38, '晚餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'dinner' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-28', 'dinner', 135, 175.50, 25.65, 6.75, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'dinner' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-09-28', 'snack', 140, 49.00, 1.26, 0.42, 10.50, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-28' AND meal_type = 'snack' AND food_id = 37);

-- 2025-09-29
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-09-29', 'breakfast', 75, 275.25, 9.90, 4.88, 49.73, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-29');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-29', 'lunch', 200, 222.00, 5.20, 1.80, 47.00, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-29' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-29', 'lunch', 150, 156.00, 36.30, 1.80, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-29' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-29', 'dinner', 170, 197.20, 4.42, 0.51, 44.03, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-29' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-09-29', 'dinner', 105, 103.95, 18.90, 2.42, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-29' AND meal_type = 'dinner' AND food_id = 28);

-- 2025-09-30
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-09-30', 'breakfast', 155, 179.80, 4.03, 0.47, 40.15, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-09-30', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-09-30', 'lunch', 195, 241.80, 9.75, 1.56, 49.34, '午餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'lunch' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-09-30', 'lunch', 155, 201.50, 29.45, 7.75, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-09-30', 'dinner', 180, 199.80, 4.68, 1.62, 42.30, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-09-30', 'dinner', 130, 135.20, 31.46, 1.56, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'dinner' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-09-30', 'snack', 125, 57.50, 0.50, 0.25, 13.63, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-09-30' AND meal_type = 'snack' AND food_id = 38);

-- 10月份 (2025-10-01 到 2025-10-11)
-- 2025-10-01
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-10-01', 'breakfast', 80, 197.60, 7.36, 2.72, 33.04, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-01', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-01', 'lunch', 190, 220.40, 4.94, 0.57, 49.21, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-01', 'lunch', 160, 158.40, 28.80, 3.68, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-10-01', 'dinner', 185, 183.15, 8.33, 0.93, 39.59, '晚餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01' AND meal_type = 'dinner' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-01', 'dinner', 130, 169.00, 24.70, 6.50, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-01' AND meal_type = 'dinner' AND food_id = 26);

-- 2025-10-02
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-10-02', 'breakfast', 60, 220.20, 7.92, 3.90, 39.78, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-02', 'lunch', 185, 205.35, 4.81, 1.67, 43.48, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-02', 'lunch', 145, 150.80, 35.09, 1.74, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-02', 'dinner', 165, 191.40, 4.29, 0.50, 42.74, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-02', 'dinner', 110, 108.90, 19.80, 2.53, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02' AND meal_type = 'dinner' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-10-02', 'snack', 135, 47.25, 1.22, 0.41, 10.13, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-02' AND meal_type = 'snack' AND food_id = 37);

-- 2025-10-03
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-03', 'breakfast', 150, 174.00, 3.90, 0.45, 38.85, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-03', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 9, '2025-10-03', 'lunch', 180, 235.80, 9.00, 0.90, 45.00, '午餐-意大利面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03' AND meal_type = 'lunch' AND food_id = 9);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-03', 'lunch', 140, 182.00, 26.60, 7.00, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-03', 'dinner', 170, 188.70, 4.42, 1.53, 39.95, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-03', 'dinner', 135, 140.40, 32.67, 1.62, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-03' AND meal_type = 'dinner' AND food_id = 27);

-- 2025-10-04
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-10-04', 'breakfast', 75, 185.25, 6.90, 2.55, 30.98, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-04', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-04', 'lunch', 195, 226.20, 5.07, 0.59, 50.51, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-04', 'lunch', 155, 153.45, 27.90, 3.56, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-10-04', 'dinner', 175, 217.00, 8.75, 1.40, 44.28, '晚餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'dinner' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-04', 'dinner', 125, 162.50, 23.75, 6.25, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'dinner' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-10-04', 'snack', 115, 52.90, 0.46, 0.23, 12.54, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-04' AND meal_type = 'snack' AND food_id = 38);

-- 2025-10-05 到 2025-10-11 继续...
-- 2025-10-05
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-10-05', 'breakfast', 70, 256.90, 9.24, 4.55, 46.41, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-05');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-05', 'lunch', 190, 210.90, 4.94, 1.71, 44.65, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-05' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-05', 'lunch', 150, 156.00, 36.30, 1.80, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-05' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-05', 'dinner', 160, 185.60, 4.16, 0.48, 41.44, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-05' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-05', 'dinner', 115, 113.85, 20.70, 2.65, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-05' AND meal_type = 'dinner' AND food_id = 28);

-- 2025-10-06
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-06', 'breakfast', 155, 179.80, 4.03, 0.47, 40.15, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-06', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-10-06', 'lunch', 180, 178.20, 8.10, 0.90, 38.52, '午餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'lunch' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-06', 'lunch', 145, 188.50, 27.55, 7.25, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-06', 'dinner', 175, 194.25, 4.55, 1.58, 41.13, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-06', 'dinner', 125, 130.00, 30.25, 1.50, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'dinner' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-10-06', 'snack', 145, 50.75, 1.31, 0.44, 10.88, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-06' AND meal_type = 'snack' AND food_id = 37);

-- 2025-10-07
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-10-07', 'breakfast', 85, 209.95, 7.82, 2.89, 35.11, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-07', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-07', 'lunch', 185, 214.60, 4.81, 0.56, 47.92, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-07', 'lunch', 150, 148.50, 27.00, 3.45, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 9, '2025-10-07', 'dinner', 190, 248.90, 9.50, 0.95, 47.50, '晚餐-意大利面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07' AND meal_type = 'dinner' AND food_id = 9);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-07', 'dinner', 130, 169.00, 24.70, 6.50, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-07' AND meal_type = 'dinner' AND food_id = 26);

-- 2025-10-08
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-10-08', 'breakfast', 65, 238.55, 8.58, 4.23, 43.10, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-08', 'lunch', 180, 199.80, 4.68, 1.62, 42.30, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-08', 'lunch', 140, 145.60, 33.88, 1.68, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-08', 'dinner', 170, 197.20, 4.42, 0.51, 44.03, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-08', 'dinner', 105, 103.95, 18.90, 2.42, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08' AND meal_type = 'dinner' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-10-08', 'snack', 105, 48.30, 0.42, 0.21, 11.44, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-08' AND meal_type = 'snack' AND food_id = 38);

-- 2025-10-09
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-09', 'breakfast', 160, 185.60, 4.16, 0.48, 41.44, '早餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-09', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 7, '2025-10-09', 'lunch', 185, 229.40, 9.25, 1.48, 46.81, '午餐-全麦面条'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09' AND meal_type = 'lunch' AND food_id = 7);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-09', 'lunch', 150, 195.00, 28.50, 7.50, 0.00, '午餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09' AND meal_type = 'lunch' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-09', 'dinner', 165, 183.15, 4.29, 1.49, 38.78, '晚餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09' AND meal_type = 'dinner' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-09', 'dinner', 135, 140.40, 32.67, 1.62, 0.00, '晚餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-09' AND meal_type = 'dinner' AND food_id = 27);

-- 2025-10-10
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 12, '2025-10-10', 'breakfast', 80, 197.60, 7.36, 2.72, 33.04, '早餐-全麦面包'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 25, '2025-10-10', 'breakfast', 100, 144.00, 21.00, 6.00, 0.00, '早餐-鸡蛋'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'breakfast' AND food_id = 25);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-10', 'lunch', 175, 203.00, 4.55, 0.53, 45.33, '午餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'lunch' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-10', 'lunch', 160, 158.40, 28.80, 3.68, 0.00, '午餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'lunch' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 8, '2025-10-10', 'dinner', 175, 173.25, 7.88, 0.88, 37.45, '晚餐-荞麦面'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'dinner' AND food_id = 8);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 26, '2025-10-10', 'dinner', 125, 162.50, 23.75, 6.25, 0.00, '晚餐-鸡胸肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'dinner' AND food_id = 26);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 37, '2025-10-10', 'snack', 125, 43.75, 1.13, 0.38, 9.38, '加餐-苹果'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-10' AND meal_type = 'snack' AND food_id = 37);

-- 2025-10-11
INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 16, '2025-10-11', 'breakfast', 75, 275.25, 9.90, 4.88, 49.73, '早餐-燕麦片'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11');

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 2, '2025-10-11', 'lunch', 195, 216.45, 5.07, 1.76, 45.83, '午餐-糙米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11' AND meal_type = 'lunch' AND food_id = 2);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 27, '2025-10-11', 'lunch', 150, 156.00, 36.30, 1.80, 0.00, '午餐-鱼肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11' AND meal_type = 'lunch' AND food_id = 27);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 1, '2025-10-11', 'dinner', 165, 191.40, 4.29, 0.50, 42.74, '晚餐-白米饭'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11' AND meal_type = 'dinner' AND food_id = 1);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 28, '2025-10-11', 'dinner', 110, 108.90, 19.80, 2.53, 0.00, '晚餐-瘦牛肉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11' AND meal_type = 'dinner' AND food_id = 28);

INSERT INTO diet_records (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
SELECT 63, 38, '2025-10-11', 'snack', 120, 55.20, 0.48, 0.24, 13.08, '加餐-香蕉'
WHERE NOT EXISTS (SELECT 1 FROM diet_records WHERE user_id = 63 AND DATE(record_date) = '2025-10-11' AND meal_type = 'snack' AND food_id = 38);
