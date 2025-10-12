-- ================================
-- 示例数据 - 食物表多语言数据
-- ================================
-- 用途: 展示如何填充中英文食物数据
-- ================================

USE health_management;

-- 批量更新现有食物的英文字段(示例)
-- 注意: 这只是示例,实际使用时需要根据真实数据调整

-- 更新水果类
UPDATE foods SET
  category_en = 'Fruits',
  name_en = CASE name
    WHEN '苹果' THEN 'Apple'
    WHEN '香蕉' THEN 'Banana'
    WHEN '橙子' THEN 'Orange'
    WHEN '葡萄' THEN 'Grape'
    WHEN '西瓜' THEN 'Watermelon'
    WHEN '草莓' THEN 'Strawberry'
    WHEN '芒果' THEN 'Mango'
    WHEN '梨' THEN 'Pear'
    WHEN '桃子' THEN 'Peach'
    WHEN '猕猴桃' THEN 'Kiwi'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '苹果' THEN 'Fresh red apple, rich in vitamins and fiber'
    WHEN '香蕉' THEN 'Ripe banana, high in potassium'
    WHEN '橙子' THEN 'Juicy orange, rich in vitamin C'
    ELSE description_en
  END
WHERE category = '水果';

-- 更新蔬菜类
UPDATE foods SET
  category_en = 'Vegetables',
  name_en = CASE name
    WHEN '西红柿' THEN 'Tomato'
    WHEN '黄瓜' THEN 'Cucumber'
    WHEN '胡萝卜' THEN 'Carrot'
    WHEN '白菜' THEN 'Chinese Cabbage'
    WHEN '西兰花' THEN 'Broccoli'
    WHEN '菠菜' THEN 'Spinach'
    WHEN '生菜' THEN 'Lettuce'
    WHEN '茄子' THEN 'Eggplant'
    WHEN '土豆' THEN 'Potato'
    WHEN '洋葱' THEN 'Onion'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '西红柿' THEN 'Fresh tomato, rich in lycopene'
    WHEN '黄瓜' THEN 'Crisp cucumber, low in calories'
    WHEN '胡萝卜' THEN 'Orange carrot, high in vitamin A'
    ELSE description_en
  END
WHERE category = '蔬菜';

-- 更新肉类
UPDATE foods SET
  category_en = 'Meat',
  name_en = CASE name
    WHEN '猪肉' THEN 'Pork'
    WHEN '牛肉' THEN 'Beef'
    WHEN '羊肉' THEN 'Lamb'
    WHEN '瘦肉' THEN 'Lean Meat'
    WHEN '五花肉' THEN 'Pork Belly'
    WHEN '牛排' THEN 'Steak'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '猪肉' THEN 'Fresh pork, high in protein'
    WHEN '牛肉' THEN 'Premium beef, rich in iron'
    WHEN '羊肉' THEN 'Tender lamb, rich in protein'
    ELSE description_en
  END
WHERE category = '肉类';

-- 更新禽类
UPDATE foods SET
  category_en = 'Poultry',
  name_en = CASE name
    WHEN '鸡肉' THEN 'Chicken'
    WHEN '鸭肉' THEN 'Duck'
    WHEN '鸡胸肉' THEN 'Chicken Breast'
    WHEN '鸡腿' THEN 'Chicken Leg'
    WHEN '鸡翅' THEN 'Chicken Wing'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '鸡肉' THEN 'Lean chicken, high in protein'
    WHEN '鸡胸肉' THEN 'Boneless chicken breast, low fat'
    ELSE description_en
  END
WHERE category = '禽类';

-- 更新海鲜类
UPDATE foods SET
  category_en = 'Seafood',
  name_en = CASE name
    WHEN '鱼' THEN 'Fish'
    WHEN '虾' THEN 'Shrimp'
    WHEN '螃蟹' THEN 'Crab'
    WHEN '鲑鱼' THEN 'Salmon'
    WHEN '金枪鱼' THEN 'Tuna'
    WHEN '鳕鱼' THEN 'Cod'
    WHEN '扇贝' THEN 'Scallop'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '鲑鱼' THEN 'Fresh salmon, rich in Omega-3'
    WHEN '虾' THEN 'Fresh shrimp, low in calories'
    ELSE description_en
  END
WHERE category = '海鲜';

-- 更新蛋类
UPDATE foods SET
  category_en = 'Eggs',
  name_en = CASE name
    WHEN '鸡蛋' THEN 'Egg'
    WHEN '鸭蛋' THEN 'Duck Egg'
    WHEN '鹌鹑蛋' THEN 'Quail Egg'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '鸡蛋' THEN 'Fresh chicken egg, rich in protein'
    ELSE description_en
  END
WHERE category = '蛋类';

-- 更新奶制品
UPDATE foods SET
  category_en = 'Dairy',
  name_en = CASE name
    WHEN '牛奶' THEN 'Milk'
    WHEN '酸奶' THEN 'Yogurt'
    WHEN '奶酪' THEN 'Cheese'
    WHEN '黄油' THEN 'Butter'
    WHEN '奶油' THEN 'Cream'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '牛奶' THEN 'Fresh milk, rich in calcium'
    WHEN '酸奶' THEN 'Probiotic yogurt, good for digestion'
    ELSE description_en
  END
WHERE category = '奶制品';

-- 更新谷物类
UPDATE foods SET
  category_en = 'Grains',
  name_en = CASE name
    WHEN '米饭' THEN 'Rice'
    WHEN '面条' THEN 'Noodles'
    WHEN '面包' THEN 'Bread'
    WHEN '馒头' THEN 'Steamed Bun'
    WHEN '燕麦' THEN 'Oats'
    WHEN '小麦' THEN 'Wheat'
    WHEN '玉米' THEN 'Corn'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '米饭' THEN 'Steamed white rice, staple food'
    WHEN '燕麦' THEN 'Rolled oats, high in fiber'
    ELSE description_en
  END
WHERE category = '谷物';

-- 更新豆类
UPDATE foods SET
  category_en = 'Legumes',
  name_en = CASE name
    WHEN '黄豆' THEN 'Soybean'
    WHEN '绿豆' THEN 'Mung Bean'
    WHEN '红豆' THEN 'Red Bean'
    WHEN '黑豆' THEN 'Black Bean'
    WHEN '豆腐' THEN 'Tofu'
    WHEN '豆浆' THEN 'Soy Milk'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '豆腐' THEN 'Soft tofu, plant-based protein'
    WHEN '豆浆' THEN 'Fresh soy milk, rich in protein'
    ELSE description_en
  END
WHERE category = '豆类';

-- 更新坚果类
UPDATE foods SET
  category_en = 'Nuts',
  name_en = CASE name
    WHEN '花生' THEN 'Peanut'
    WHEN '核桃' THEN 'Walnut'
    WHEN '杏仁' THEN 'Almond'
    WHEN '腰果' THEN 'Cashew'
    WHEN '开心果' THEN 'Pistachio'
    WHEN '榛子' THEN 'Hazelnut'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '核桃' THEN 'Walnuts, rich in omega-3 fatty acids'
    WHEN '杏仁' THEN 'Almonds, high in vitamin E'
    ELSE description_en
  END
WHERE category = '坚果';

-- 更新饮料类
UPDATE foods SET
  category_en = 'Beverages',
  name_en = CASE name
    WHEN '水' THEN 'Water'
    WHEN '茶' THEN 'Tea'
    WHEN '咖啡' THEN 'Coffee'
    WHEN '果汁' THEN 'Juice'
    WHEN '可乐' THEN 'Cola'
    WHEN '绿茶' THEN 'Green Tea'
    WHEN '红茶' THEN 'Black Tea'
    ELSE name_en
  END,
  description_en = CASE name
    WHEN '绿茶' THEN 'Fresh green tea, rich in antioxidants'
    WHEN '咖啡' THEN 'Freshly brewed coffee'
    ELSE description_en
  END
WHERE category = '饮料';

-- 更新其他常见分类
UPDATE foods SET category_en = 'Oils' WHERE category = '油脂';
UPDATE foods SET category_en = 'Condiments' WHERE category = '调味品';
UPDATE foods SET category_en = 'Snacks' WHERE category = '零食';
UPDATE foods SET category_en = 'Desserts' WHERE category = '甜点';
UPDATE foods SET category_en = 'Fast Food' WHERE category = '快餐';
UPDATE foods SET category_en = 'Others' WHERE category = '其他';

-- 显示更新结果统计
SELECT
  category as '中文分类',
  category_en as '英文分类',
  COUNT(*) as '食物数量',
  SUM(CASE WHEN name_en IS NOT NULL THEN 1 ELSE 0 END) as '已翻译名称',
  SUM(CASE WHEN description_en IS NOT NULL THEN 1 ELSE 0 END) as '已翻译描述'
FROM foods
WHERE is_active = true
GROUP BY category, category_en
ORDER BY category;

SELECT '✅ 英文数据填充完成!' AS status;
