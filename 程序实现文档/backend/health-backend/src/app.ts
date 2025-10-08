import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { testConnection } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

// 路由导入
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';
import foodRoutes from './routes/foodRoutes';
import dietRoutes from './routes/dietRoutes';
import statsRoutes from './routes/statsRoutes';
import adminRoutes from './routes/adminRoutes';
import goalsRoutes from './routes/goalsRoutes';

// 加载环境变量
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 确保日志目录存在
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '健康管理系统 API',
      version: '1.0.0',
      description: '基于Node.js+Express+MySQL的健康管理系统后端API文档',
      contact: {
        name: 'API支持',
        email: 'support@health-system.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发环境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: '用户认证 - 用户注册、登录、个人信息管理'
      },
      {
        name: 'Health',
        description: '健康记录 - 健康数据的记录与管理'
      },
      {
        name: 'Goals',
        description: '健康目标 - 用户健康目标设置与管理'
      },
      {
        name: 'Food',
        description: '食物管理 - 食物数据库管理'
      },
      {
        name: 'Diet',
        description: '饮食记录 - 饮食记录与营养分析'
      },
      {
        name: 'Stats',
        description: '数据统计 - 健康数据统计与分析'
      },
      {
        name: 'Admin',
        description: '系统管理 - 管理员功能'
      }
    ]
  },
  apis: [
    path.join(__dirname, './routes/*.ts'),
    path.join(__dirname, './controllers/*.ts')
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 中间件配置
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// 日志中间件
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' })
}));
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 自定义请求日志
app.use(requestLogger);

// 静态文件服务 - 提供上传的文件访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '健康管理系统 API 文档'
}));

// OpenAPI JSON端点
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// 添加请求日志中间件
app.use('/api', (req, res, next) => {
  console.log(`API请求: ${req.method} ${req.originalUrl}`);
  next();
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// API根路径
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: '健康管理系统 API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health',
      goals: '/api/goals',
      foods: '/api/foods',
      diet: '/api/diet',
      stats: '/api/stats',
      admin: '/api/admin'
    }
  });
});

// 404处理
app.use(notFound);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const startServer = async (): Promise<void> => {
  try {
    // 测试数据库连接
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`📚 API文档访问: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 健康检查: http://localhost:${PORT}/health`);
      console.log(`📋 API根路径: http://localhost:${PORT}/api`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('👋 收到SIGTERM信号，正在优雅关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 收到SIGINT信号，正在优雅关闭服务器...');
  process.exit(0);
});

// 启动应用
startServer();

export default app;
