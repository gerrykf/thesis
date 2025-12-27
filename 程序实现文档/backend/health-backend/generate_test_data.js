const mysql = require('mysql2/promise');

async function generateDataForUser(connection, username, foods) {
  console.log(`\n=== 处理用户: ${username} ===`);

  // 1. 查找用户
  const [users] = await connection.execute(
    'SELECT id, username FROM users WHERE username = ?',
    [username]
  );

  if (users.length === 0) {
    console.log(`❌ 找不到用户 ${username}`);
    return;
  }

  const userId = users[0].id;
  console.log(`✅ 找到用户: ${users[0].username} (ID: ${userId})`);

  // 2. 删除该用户的所有健康记录和饮食记录
  console.log('正在删除旧数据...');
  const [healthDeleted] = await connection.execute(
    'DELETE FROM health_records WHERE user_id = ?',
    [userId]
  );
  console.log(`✅ 删除了 ${healthDeleted.affectedRows} 条健康记录`);

  const [dietDeleted] = await connection.execute(
    'DELETE FROM diet_records WHERE user_id = ?',
    [userId]
  );
  console.log(`✅ 删除了 ${dietDeleted.affectedRows} 条饮食记录`);

  // 3. 生成2个月的数据（从今天往前推60天）
  console.log('正在生成新数据...');

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 60); // 往前推60天

  if (foods.length === 0) {
    console.log('⚠️  数据库中没有食物数据，跳过饮食记录生成');
  }

  let healthCount = 0;
  let dietCount = 0;

  // 生成每一天的数据
  for (let i = 0; i <= 60; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    // 如果是未来日期，跳过
    if (currentDate > now) break;

    // 随机决定这一天是否打卡（90%的概率）
    if (Math.random() < 0.9) {
      // 生成健康打卡数据
      const weight = (70 + (Math.random() - 0.5) * 2).toFixed(1); // 69-71kg 之间波动
      const exerciseDuration = Math.random() > 0.3 ? Math.floor(20 + Math.random() * 40) : null; // 20-60分钟
      const exerciseTypes = ['跑步', '健身', '游泳', '瑜伽', '骑行', '散步'];
      const exerciseType = exerciseDuration ? exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)] : null;
      const sleepHours = (6 + Math.random() * 3).toFixed(1); // 6-9小时
      const qualities = ['excellent', 'good', 'fair', 'poor'];
      const sleepQuality = qualities[Math.floor(Math.random() * qualities.length)];
      const mood = qualities[Math.floor(Math.random() * qualities.length)];

      // 设置打卡时间为当天的随机时间（6:00-23:00）
      const recordHour = Math.floor(6 + Math.random() * 17);
      const recordMinute = Math.floor(Math.random() * 60);
      const recordSecond = Math.floor(Math.random() * 60);

      const recordDateTime = new Date(currentDate);
      recordDateTime.setHours(recordHour, recordMinute, recordSecond, 0);

      // 转换为 MySQL DATETIME 格式 (UTC)
      const mysqlDateTime = recordDateTime.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      await connection.execute(
        `INSERT INTO health_records
         (user_id, record_date, weight, exercise_duration, exercise_type, sleep_hours, sleep_quality, mood, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, mysqlDateTime, weight, exerciseDuration, exerciseType, sleepHours, sleepQuality, mood]
      );
      healthCount++;

      // 生成饮食记录（70%的天数有饮食记录）
      if (foods.length > 0 && Math.random() < 0.7) {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealsToday = Math.floor(2 + Math.random() * 2); // 2-3餐

        for (let j = 0; j < mealsToday; j++) {
          const mealType = mealTypes[j];
          const food = foods[Math.floor(Math.random() * foods.length)];
          const quantity = Math.floor(100 + Math.random() * 200); // 100-300g

          // 计算营养成分
          const factor = quantity / 100;
          const calories = (food.calories_per_100g * factor).toFixed(2);
          const protein = (food.protein_per_100g * factor).toFixed(2);
          const fat = (food.fat_per_100g * factor).toFixed(2);
          const carbs = (food.carbs_per_100g * factor).toFixed(2);

          // 设置用餐时间
          let mealHour;
          if (mealType === 'breakfast') mealHour = 7 + Math.floor(Math.random() * 2); // 7-9点
          else if (mealType === 'lunch') mealHour = 12 + Math.floor(Math.random() * 2); // 12-14点
          else mealHour = 18 + Math.floor(Math.random() * 2); // 18-20点

          const mealDateTime = new Date(currentDate);
          mealDateTime.setHours(mealHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);
          const mealMysqlDateTime = mealDateTime.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

          await connection.execute(
            `INSERT INTO diet_records
             (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, food.id, mealMysqlDateTime, mealType, quantity, calories, protein, fat, carbs]
          );
          dietCount++;
        }
      }
    }
  }

  console.log(`✅ 用户 ${username} 数据生成完成！`);
  console.log(`- 健康打卡记录: ${healthCount} 条`);
  console.log(`- 饮食记录: ${dietCount} 条`);
}

async function generateTestData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'health_management'
  });

  try {
    console.log('\n=== 开始生成测试数据 ===');

    // 查询所有食物以供饮食记录使用
    const [foods] = await connection.execute(
      'SELECT id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g FROM foods LIMIT 50'
    );

    if (foods.length === 0) {
      console.log('⚠️  数据库中没有食物数据，跳过饮食记录生成');
    }

    // 为多个用户生成数据
    const usernames = ['test01', 'admin', 'sadmin'];
    for (const username of usernames) {
      await generateDataForUser(connection, username, foods);
    }

    console.log('\n🎉 所有用户数据生成完成！\n');

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await connection.end();
  }
}

generateTestData();
