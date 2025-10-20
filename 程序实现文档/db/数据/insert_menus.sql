# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20095
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: localhost (MySQL 9.4.0)
# 数据库: health_management
# 生成时间: 2025-10-20 08:19:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 menus
# ------------------------------------------------------------

DROP TABLE IF EXISTS `menus`;

CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` int DEFAULT '0' COMMENT '父菜单ID',
  `menu_type` tinyint DEFAULT '0' COMMENT '菜单类型 0:菜单 1:iframe 2:外链 3:按钮',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由名称',
  `path` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '组件路径',
  `rank` int DEFAULT '99' COMMENT '菜单排序',
  `redirect` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由重定向',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单图标',
  `extra_icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '右侧图标',
  `enter_transition` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '进场动画',
  `leave_transition` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '离场动画',
  `active_path` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单激活路径',
  `auths` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '权限标识',
  `frame_src` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'iframe链接地址',
  `frame_loading` tinyint DEFAULT '1' COMMENT '加载动画 0:关闭 1:开启',
  `keep_alive` tinyint DEFAULT '0' COMMENT '缓存页面 0:关闭 1:开启',
  `hidden_tag` tinyint DEFAULT '0' COMMENT '隐藏标签 0:不隐藏 1:隐藏',
  `fixed_tag` tinyint DEFAULT '0' COMMENT '固定标签 0:不固定 1:固定',
  `show_link` tinyint DEFAULT '1' COMMENT '是否显示 0:隐藏 1:显示',
  `show_parent` tinyint DEFAULT '0' COMMENT '是否显示父级 0:不显示 1:显示',
  `status` tinyint DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `is_static` tinyint DEFAULT '0' COMMENT '是否为静态路由 0:动态菜单 1:静态路由',
  `router_source` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'database' COMMENT '路由来源 local:本地静态路由 database:数据库动态路由',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_menu_type` (`menu_type`),
  KEY `idx_rank` (`rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单管理表（完整版）';

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;

INSERT INTO `menus` (`id`, `parent_id`, `menu_type`, `title`, `name`, `path`, `component`, `rank`, `redirect`, `icon`, `extra_icon`, `enter_transition`, `leave_transition`, `active_path`, `auths`, `frame_src`, `frame_loading`, `keep_alive`, `hidden_tag`, `fixed_tag`, `show_link`, `show_parent`, `status`, `is_static`, `router_source`, `created_at`, `updated_at`)
VALUES
	(10,0,0,'系统管理','SystemManagement','/system','',3,'','ri:settings-3-line','','','','','','',1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-18 16:47:20'),
	(14,10,0,'角色管理','RoleManagement','/system/role/index','/system/role/index',3,'','ep:lock',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-17 17:57:21'),
	(16,10,0,'菜单管理','MenuManagement','/system/menu/index','/system/menu/index',4,'','ep:menu',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-17 17:57:28'),
	(30,0,0,'系统监控','SystemMonitor','/monitor',NULL,4,NULL,'ri:computer-line',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-17 15:33:34'),
	(31,30,0,'在线用户','OnlineUser','/monitor/online/index','/monitor/online/index',1,'','ri:user-line','','','','','','',1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-20 09:08:53'),
	(32,30,0,'登录日志','LoginLog','/monitor/login-log/index','/monitor/login-log/index',2,'','ri:shield-keyhole-line','','','','','','',1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-20 09:08:36'),
	(33,30,0,'操作日志','OperationLog','/monitor/operation-log/index','/monitor/operation-log/index',3,'','ri:file-list-3-line','','','','','','',1,0,0,0,1,0,1,0,'database','2025-10-17 15:33:34','2025-10-20 09:08:53'),
	(39,0,0,'首页','Home','/','Layout',0,'/dashboard','ep/home-filled',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-18 14:43:47'),
	(40,39,0,'数据趋势','Dashboard','/dashboard','/views/dashboard/index.vue',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 11:10:15'),
	(41,0,0,'用户管理','UserManagement','/user','Layout',1,'/user/index','ri:admin-line',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-18 14:43:47'),
	(42,41,0,'用户列表','UserList','/user/index','/views/user/list/index.vue',1,NULL,NULL,NULL,NULL,NULL,NULL,'user.list',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 11:09:53'),
	(43,41,0,'用户详情','UserDetail','/user/detail/:userId?','/views/user/detail/index.vue',2,NULL,NULL,NULL,NULL,NULL,NULL,'user.view',NULL,1,0,0,0,0,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 11:09:53'),
	(44,42,3,'查看',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'user.view',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(45,42,3,'新增',NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,'user.add',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(46,42,3,'编辑',NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,'user.edit',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(47,42,3,'删除',NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,'user.delete',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(48,42,3,'修改角色',NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,'user.role.change',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(50,0,0,'食物管理','FoodList','/food/index','/views/food/list/index.vue',1,NULL,NULL,NULL,NULL,NULL,NULL,'food.list',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 11:10:30'),
	(51,50,3,'查看',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'food.view',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(52,50,3,'新增',NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,'food.add',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(53,50,3,'编辑',NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,'food.edit',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(54,50,3,'删除',NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,'food.delete',NULL,1,0,0,0,1,0,1,1,'local','2025-10-18 14:43:47','2025-10-20 10:51:15'),
	(71,14,3,'新增','','','',99,'','','','','','','role.add','',0,0,0,0,0,0,1,0,'database','2025-10-18 14:54:53','2025-10-18 16:20:37'),
	(73,14,3,'编辑',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'role.edit',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:21:29','2025-10-18 16:21:29'),
	(74,14,3,'删除',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'role.delete',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:21:46','2025-10-18 16:21:46'),
	(75,14,3,'查看',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'role.view',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:33:24','2025-10-18 16:33:24'),
	(76,16,3,'新增菜单',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'menu.add_menu',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:49:24','2025-10-18 16:49:24'),
	(77,16,3,'新增',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'menu.add',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:49:46','2025-10-18 16:49:46'),
	(78,16,3,'编辑',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'menu.edit',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:50:05','2025-10-18 16:50:05'),
	(79,16,3,'删除',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'menu.delete',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:50:25','2025-10-18 16:50:25'),
	(80,16,3,'查看',NULL,NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,'menu.view',NULL,0,0,0,0,0,0,1,0,'database','2025-10-18 16:50:44','2025-10-18 16:50:44');

/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
