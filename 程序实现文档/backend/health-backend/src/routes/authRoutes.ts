import { Router, type Router as RouterType } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, updatePassword, uploadAvatar } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload';

const router: RouterType = Router();

// 注册验证规则
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('password')
    .isLength({ min: 6, max: 50 })
    .withMessage('密码长度必须在6-50字符之间'),
  body('nickname')
    .isLength({ min: 1, max: 50 })
    .withMessage('昵称长度必须在1-50字符之间'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
];

// 登录验证规则
const loginValidation = [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
];

// 修改密码验证规则
const updatePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('当前密码不能为空'),
  body('newPassword')
    .isLength({ min: 6, max: 50 })
    .withMessage('新密码长度必须在6-50字符之间')
];

// 路由定义
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/password', authenticateToken, updatePasswordValidation, updatePassword);
router.post('/avatar', authenticateToken, uploadMiddleware.single('avatar'), uploadAvatar);

export default router;
