import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'health_management',
  waitForConnections: true,
  // 连接池大小优化：允许更多并发连接（原来10个太少）
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'),
  // 队列限制：防止内存溢出（原来0表示无限制）
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '100'),
  // 获取连接超时时间：10秒（原来60秒太长）
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '10000'),
  // 连接超时时间：10秒
  timeout: parseInt(process.env.DB_TIMEOUT || '10000'),
  // 启用多语句查询（提升性能）
  multipleStatements: false,
  // 连接空闲时间限制（毫秒）：10分钟
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '600000'),
  // 最大空闲连接数
  maxIdle: parseInt(process.env.DB_MAX_IDLE || '10'),
  // 设置时区为北京时间（UTC+8）
  timezone: '+08:00',
  // 启用查询缓存
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// 创建连接池
export const db = mysql.createPool(dbConfig);

// 测试数据库连接
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await db.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
};

export default db;
