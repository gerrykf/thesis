import { Router, type Router as RouterType } from 'express';
import { authenticateToken, requireRole, requireAdminClient } from '../middleware/auth';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload';
import {
  createUser,
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
  getUserDietRecords,
  getUserRegistrationTrend,
  getUserActiveTrend,
  getHealthCheckinRate,
  getDietCheckinRate,
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
  createMenu,
  updateMenu,
  deleteMenu,
  getRoleMenus,
  updateRoleMenus,
  // 用户角色管理
  updateUserRole,
  // 用户目标管理
  getUserGoals,
  // 用户头像管理
  uploadUserAvatar
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
// 移除全局角色检查,改为在具体路由上应用,允许普通用户访问查看接口
// router.use(requireRole('admin', 'super_admin'));

// 菜单管理路由 - 所有登录用户均可访问(用于前端菜单渲染)
router.get('/menus', getMenus);                          // 普通用户可以查看菜单
router.post('/menus', requireRole('super_admin'), createMenu);       // 只有超级管理员可以创建菜单
router.put('/menus/:id', requireRole('super_admin'), updateMenu);    // 只有超级管理员可以更新菜单
router.delete('/menus/:id', requireRole('super_admin'), deleteMenu); // 只有超级管理员可以删除菜单
router.get('/roles/:id/menus', getRoleMenus);            // 普通用户可以查看角色菜单

// 用户管理路由 - 需要管理员或超级管理员权限
router.post('/users', requireRole('admin', 'super_admin'), createUser);
router.get('/users', requireRole('admin', 'super_admin'), getUsers);
router.get('/users/:id', requireRole('admin', 'super_admin'), getUserById);
router.patch('/users/:id/toggle-status', requireRole('admin', 'super_admin'), toggleUserStatus);
router.put('/users/:id', requireRole('admin', 'super_admin'), updateUserById);
router.delete('/users/:id', requireRole('admin', 'super_admin'), deleteUser);
router.put('/users/:id/role', requireRole('admin', 'super_admin'), updateUserRole);
router.post('/users/:id/avatar', requireRole('admin', 'super_admin'), uploadMiddleware.single('avatar'), uploadUserAvatar);

// 用户健康数据管理 - 需要管理员或超级管理员权限
router.get('/users/:id/health-stats', requireRole('admin', 'super_admin'), getUserHealthStats);
router.get('/users/:id/health-records', requireRole('admin', 'super_admin'), getUserHealthRecords);
router.get('/users/:id/diet-records', requireRole('admin', 'super_admin'), getUserDietRecords);
router.get('/users/:id/goals', requireRole('admin', 'super_admin'), getUserGoals);

// 系统统计 - 需要管理员或超级管理员权限
router.get('/stats/system', requireRole('admin', 'super_admin'), getSystemStats);
router.get('/stats/users', requireRole('admin', 'super_admin'), getUserStats);
router.get('/stats/user-registration-trend', requireRole('admin', 'super_admin'), getUserRegistrationTrend);
router.get('/stats/user-active-trend', requireRole('admin', 'super_admin'), getUserActiveTrend);
router.get('/stats/health-checkin-rate', requireRole('admin', 'super_admin'), getHealthCheckinRate);
router.get('/stats/diet-checkin-rate', requireRole('admin', 'super_admin'), getDietCheckinRate);

// 系统日志 - 需要管理员或超级管理员权限
router.get('/logs', requireRole('admin', 'super_admin'), getSystemLogs);

// 食物管理路由 - 查看需要登录,编辑需要管理员权限
router.get('/foods', getAdminFoods);                                        // 所有用户可查看
router.get('/foods/categories', getAdminFoodCategories);                    // 所有用户可查看
router.get('/foods/:id', getAdminFoodById);                                 // 所有用户可查看
router.post('/foods', requireRole('admin', 'super_admin'), createAdminFood);         // 需要管理员
router.put('/foods/:id', requireRole('admin', 'super_admin'), updateAdminFood);      // 需要管理员
router.delete('/foods/:id', requireRole('admin', 'super_admin'), deleteAdminFood);   // 需要管理员

// 角色管理路由
router.get('/roles', requireRole('admin', 'super_admin'), getRoles);              // 管理员可以查看角色列表
router.post('/roles', requireRole('super_admin'), createRole);                    // 只有超级管理员可以创建
router.put('/roles/:id', requireRole('super_admin'), updateRole);                 // 只有超级管理员可以修改
router.delete('/roles/:id', requireRole('super_admin'), deleteRole);              // 只有超级管理员可以删除
router.patch('/roles/:id/status', requireRole('super_admin'), toggleRoleStatus);  // 只有超级管理员可以切换状态
router.put('/roles/:id/menus', requireRole('super_admin'), updateRoleMenus);      // 只有超级管理员可以配置权限

// 测试路由（保留用于调试）
router.get('/test', (req: any, res) => {
  console.log('Admin test 路由被调用!');
  res.json({
    message: 'Admin test route working!',
    user: req.user // 显示当前认证用户信息
  });
});

export default router;
