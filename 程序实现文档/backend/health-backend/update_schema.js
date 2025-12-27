const mysql = require('mysql2/promise');

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'health_management'
  });

  try {
    console.log('\n=== 开始更新数据库字段类型 ===\n');

    // 更新 health_records 表
    console.log('1. 更新 health_records.record_date 为 DATETIME...');
    await connection.execute(
      "ALTER TABLE health_records MODIFY COLUMN record_date DATETIME NOT NULL COMMENT '记录日期时间'"
    );
    console.log('✅ health_records.record_date 更新成功');

    // 更新 diet_records 表
    console.log('2. 更新 diet_records.record_date 为 DATETIME...');
    await connection.execute(
      "ALTER TABLE diet_records MODIFY COLUMN record_date DATETIME NOT NULL COMMENT '记录日期时间'"
    );
    console.log('✅ diet_records.record_date 更新成功');

    // 验证更新
    console.log('\n=== 验证更新结果 ===\n');

    const [healthRecords] = await connection.execute(
      "SHOW COLUMNS FROM health_records WHERE Field = 'record_date'"
    );
    console.log('health_records.record_date:');
    console.log('  Type:', healthRecords[0].Type);

    const [dietRecords] = await connection.execute(
      "SHOW COLUMNS FROM diet_records WHERE Field = 'record_date'"
    );
    console.log('diet_records.record_date:');
    console.log('  Type:', dietRecords[0].Type);

    console.log('\n✅ 数据库字段类型更新完成！\n');
  } catch (error) {
    console.error('❌ 更新失败:', error);
  } finally {
    await connection.end();
  }
}

updateSchema();
