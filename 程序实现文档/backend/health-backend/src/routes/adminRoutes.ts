import { Router, type Router as RouterType } from 'express';
import { authenticateToken, requireRole, requireAdminClient } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  toggleUserStatus,
  updateUserById,
  deleteUser,
  getSystemStats,
  getSystemLogs,
  getUserStats,
  getUserHealthStats,
  getUserHealthRecords,
  getAdminFoods,
  getAdminFoodCategories,
  getAdminFoodById,
  createAdminFood,
  updateAdminFood,
  deleteAdminFood,
  // 角色管理
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  // 菜单管理
  getMenus,
  getRoleMenus,
  updateRoleMenus,
  // 用户角色管理
  updateUserRole
} from '../controllers/adminController';

const router: RouterType = Router();

// 添加调试中间件
router.use((req, res, next) => {
  console.log(`Admin路由收到请求: ${req.method} ${req.originalUrl} -> ${req.path}`);
  next();
});

// 管理员认证中间件 - 应用到所有admin路由
router.use(authenticateToken);
router.use(requireAdminClient); // 要求必须是管理端客户端
router.use(requireRole('admin', 'super_admin')); // 要求管理员角色

// 用户管理路由
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUser);

// 用户健康数据管理
router.get('/users/:id/health-stats', getUserHealthStats);
router.get('/users/:id/health-records', getUserHealthRecords);

// 系统统计
router.get('/stats/system', getSystemStats);
router.get('/stats/users', getUserStats);

// 系统日志
router.get('/logs', getSystemLogs);

// 食物管理路由
router.get('/foods', getAdminFoods);
router.get('/foods/categories', getAdminFoodCategories);
router.get('/foods/:id', getAdminFoodById);
router.post('/foods', createAdminFood);
router.put('/foods/:id', updateAdminFood);
router.delete('/foods/:id', deleteAdminFood);

// 角色管理路由（只有超级管理员可以访问）
router.get('/roles', requireRole('super_admin'), getRoles);
router.post('/roles', requireRole('super_admin'), createRole);
router.put('/roles/:id', requireRole('super_admin'), updateRole);
router.delete('/roles/:id', requireRole('super_admin'), deleteRole);
router.patch('/roles/:id/status', requireRole('super_admin'), toggleRoleStatus);

// 菜单管理路由（只有超级管理员可以访问）
router.get('/menus', requireRole('super_admin'), getMenus);
router.get('/roles/:id/menus', requireRole('super_admin'), getRoleMenus);
router.put('/roles/:id/menus', requireRole('super_admin'), updateRoleMenus);

// 用户角色管理路由（管理员和超级管理员都可以访问）
router.put('/users/:id/role', updateUserRole);

// 测试路由（保留用于调试）
router.get('/test', (req: any, res) => {
  console.log('Admin test 路由被调用!');
  res.json({
    message: 'Admin test route working!',
    user: req.user // 显示当前认证用户信息
  });
});

export default router;
