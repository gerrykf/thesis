import { Router, type Router as RouterType } from 'express';
import { authenticateToken, requireRole, requireAdminClient } from '../middleware/auth';
import {
  // 在线用户
  getOnlineUsers,
  forceOfflineUser,
  // 登录日志
  getLoginLogs,
  batchDeleteLoginLogs,
  clearAllLoginLogs,
  // 操作日志
  getOperationLogs,
  batchDeleteOperationLogs,
  clearAllOperationLogs
} from '../controllers/monitorController';

const router: RouterType = Router();

// 添加调试中间件
router.use((req, res, next) => {
  console.log(`Monitor路由收到请求: ${req.method} ${req.originalUrl} -> ${req.path}`);
  next();
});

// 认证和权限中间件
router.use(authenticateToken);
router.use(requireAdminClient); // 要求必须是管理端客户端
router.use(requireRole('admin', 'super_admin')); // 要求管理员或超级管理员权限

// 在线用户管理路由
router.get('/online-users', getOnlineUsers);
router.delete('/online-users/:id', forceOfflineUser);

// 登录日志管理路由
router.get('/login-logs', getLoginLogs);
router.post('/login-logs/batch-delete', batchDeleteLoginLogs);
router.delete('/login-logs/clear', clearAllLoginLogs);

// 操作日志管理路由
router.get('/operation-logs', getOperationLogs);
router.post('/operation-logs/batch-delete', batchDeleteOperationLogs);
router.delete('/operation-logs/clear', clearAllOperationLogs);

export default router;
