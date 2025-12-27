const bcrypt = require('bcryptjs');

// 生成 admin123456 的 bcrypt 哈希
const password = 'admin123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('生成哈希失败:', err);
    return;
  }

  console.log('\n密码哈希生成成功！\n');
  console.log('密码明文:', password);
  console.log('密码哈希:', hash);
  console.log('\n请执行以下 SQL 语句更新密码：\n');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';\n`);
});
