const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'health_management'
  });

  try {
    const username = 'test01';
    const newPassword = 'qweqwe123';

    // 生成密码哈希
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log('\n=== 修改密码 ===');
    console.log('用户名:', username);
    console.log('新密码:', newPassword);
    console.log('密码哈希:', hashedPassword);

    // 更新数据库
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );

    if (result.affectedRows > 0) {
      console.log('\n✅ 密码修改成功！');

      // 验证密码
      const [rows] = await connection.execute(
        'SELECT password FROM users WHERE username = ?',
        [username]
      );

      if (rows.length > 0) {
        const isMatch = await bcrypt.compare(newPassword, rows[0].password);
        console.log('✅ 密码验证:', isMatch ? '正确' : '错误');
      }
    } else {
      console.log('\n❌ 用户不存在！');
    }

    console.log('');
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await connection.end();
  }
}

updatePassword();
