import { Router, type Router as RouterType } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  toggleUserStatus,
  updateUserStatus,
  getSystemStats,
  getSystemLogs,
  getUserStats,
  getUserHealthStats,
  getUserHealthRecords
} from '../controllers/adminController';

const router: RouterType = Router();

// 添加调试中间件
router.use((req, res, next) => {
  console.log(`Admin路由收到请求: ${req.method} ${req.originalUrl} -> ${req.path}`);
  next();
});

// 管理员认证中间件 - 应用到所有admin路由
router.use(authenticateToken);
router.use(requireRole('admin'));

// 用户管理路由
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id', updateUserStatus);

// 用户健康数据管理
router.get('/users/:id/health-stats', getUserHealthStats);
router.get('/users/:id/health-records', getUserHealthRecords);

// 系统统计
router.get('/stats/system', getSystemStats);
router.get('/stats/users', getUserStats);

// 系统日志
router.get('/logs', getSystemLogs);

// 测试路由（保留用于调试）
router.get('/test', (req: any, res) => {
  console.log('Admin test 路由被调用!');
  res.json({ 
    message: 'Admin test route working!',
    user: req.user // 显示当前认证用户信息
  });
});

export default router;
