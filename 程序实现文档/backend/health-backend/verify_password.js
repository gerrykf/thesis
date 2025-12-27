const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function verifyPassword() {
  try {
    // 连接数据库
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '000000',
      database: 'health_management'
    });

    // 查询 admin 用户
    const [rows] = await connection.execute(
      'SELECT username, password FROM users WHERE username = ?',
      ['admin']
    );

    if (rows.length === 0) {
      console.log('❌ 用户不存在');
      await connection.end();
      return;
    }

    const user = rows[0];
    const testPassword = 'admin123456';

    console.log('\n验证密码中...\n');
    console.log('用户名:', user.username);
    console.log('测试密码:', testPassword);
    console.log('数据库哈希:', user.password.substring(0, 30) + '...');

    // 验证密码
    const isValid = await bcrypt.compare(testPassword, user.password);

    if (isValid) {
      console.log('\n✅ 密码验证成功！可以正常登录');
    } else {
      console.log('\n❌ 密码验证失败！');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ 验证出错:', error.message);
  }
}

verifyPassword();
