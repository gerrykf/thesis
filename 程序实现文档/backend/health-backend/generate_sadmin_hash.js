const bcrypt = require('bcryptjs');

const password = 'sadmin123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('生成哈希失败:', err);
    process.exit(1);
  }

  console.log('\n✅ sadmin 密码哈希生成成功！\n');
  console.log('密码明文:', password);
  console.log('密码哈希:', hash);
  console.log('\n执行 SQL 更新中...\n');

  // 直接输出哈希供后续使用
  console.log('HASH:', hash);
});
