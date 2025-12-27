const bcrypt = require('bcryptjs');

const password = 'admin123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('生成哈希失败:', err);
    process.exit(1);
  }

  console.log('\n✅ 密码哈希生成成功！\n');
  console.log('密码明文:', password);
  console.log('密码哈希:', hash);
  console.log('\n请执行以下 SQL 语句：\n');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';\n`);

  // 验证哈希是否正确
  bcrypt.compare(password, hash, (err, result) => {
    if (result) {
      console.log('✅ 验证成功：哈希可以正确验证密码');
    } else {
      console.log('❌ 验证失败：哈希无法验证密码');
    }
  });
});
