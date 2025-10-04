import { Router, type Router as RouterType } from 'express';
import {
  getUsers,
  getUserById,
  toggleUserStatus,
  getSystemStats,
  getSystemLogs
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 路由定义
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/stats/system', getSystemStats);
router.get('/logs', getSystemLogs);

export default router;
