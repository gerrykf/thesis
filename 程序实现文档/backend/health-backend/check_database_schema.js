const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'health_management'
  });

  try {
    console.log('\n=== 检查数据库字段类型 ===\n');

    // 检查 health_records 表
    const [healthRecords] = await connection.execute(
      "SHOW COLUMNS FROM health_records WHERE Field = 'record_date'"
    );
    console.log('health_records.record_date:');
    console.log(healthRecords[0]);

    // 检查 diet_records 表
    const [dietRecords] = await connection.execute(
      "SHOW COLUMNS FROM diet_records WHERE Field = 'record_date'"
    );
    console.log('\ndiet_records.record_date:');
    console.log(dietRecords[0]);

    console.log('\n');
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await connection.end();
  }
}

checkSchema();
