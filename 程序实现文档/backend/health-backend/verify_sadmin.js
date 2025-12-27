const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function verifyPassword() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '000000',
      database: 'health_management'
    });

    const [rows] = await connection.execute(
      'SELECT username, password, nickname, role_id FROM users WHERE username = ?',
      ['sadmin']
    );

    if (rows.length === 0) {
      console.log('❌ 用户不存在');
      await connection.end();
      return;
    }

    const user = rows[0];
    const testPassword = 'sadmin123456';

    console.log('\n验证 sadmin 密码中...\n');
    console.log('用户名:', user.username);
    console.log('昵称:', user.nickname);
    console.log('角色ID:', user.role_id);
    console.log('测试密码:', testPassword);

    const isValid = await bcrypt.compare(testPassword, user.password);

    if (isValid) {
      console.log('\n✅ 密码验证成功！sadmin 可以正常登录');
    } else {
      console.log('\n❌ 密码验证失败！');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ 验证出错:', error.message);
  }
}

verifyPassword();
